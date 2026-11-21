// input-probe-macos <logfile> [x y w h]
// macOS test window for ORION's input helper. Logs every event it receives in
// the same format as the Windows and X11 probes, so tests/input/helper-e2e.mjs
// runs unchanged on all three:
//   READY|HWND:<window number>|X:|Y:|W:|H:   KEYDOWN|<name>|CTRL:|SHIFT:|ALT:|CMD:
//   KEYUP|<name>   CHAR|U+XXXX|<c>   MOUSEDOWN|Left|x,y   MOUSEUP|Left|x,y
//   DOUBLECLICK|Left|x,y   WHEEL|<delta>|x,y   DRAG|x1,y1->x2,y2
// Coordinates are global points with a top-left origin (same as CGEvent).
// CTRL is true for Control or Command: tests written for Windows check CTRL,
// and on macOS the shortcut key is Command.
// Build: swiftc -O -o input-probe-macos InputProbe.swift
// Made by iMpact Team.

import AppKit

let argv = CommandLine.arguments
if argv.count < 2 { FileHandle.standardError.write("usage: input-probe-macos <logfile> [x y w h]\n".data(using: .utf8)!); exit(2) }
let logPath = argv[1]
var rect = (x: 100.0, y: 100.0, w: 800.0, h: 500.0)
// --controls: add a real button, text field and checkbox (for uia-list / uia-invoke / uia-setvalue tests)
let withControls = CommandLine.arguments.contains("--controls")
if argv.count >= 6, !argv[2].hasPrefix("--"), let x = Double(argv[2]), let y = Double(argv[3]), let w = Double(argv[4]), let h = Double(argv[5]) { rect = (x, y, w, h) }

FileManager.default.createFile(atPath: logPath, contents: nil) // ok if it exists: we append below
let log = FileHandle(forWritingAtPath: logPath)!
log.seekToEndOfFile()
func W(_ s: String) { log.write((s + "\n").data(using: .utf8)!) }

let primaryHeight = NSScreen.screens.first?.frame.height ?? 900
// Where the event happened (not where the cursor is now: by the time an event
// is handled the cursor may already have moved on, e.g. during a drag).
func globalTopLeft(_ e: NSEvent) -> (Int, Int) {
    var p = NSEvent.mouseLocation
    if let w = e.window {
        p = w.convertToScreen(NSRect(origin: e.locationInWindow, size: .zero)).origin  // bottom-left origin
    }
    return (Int(p.x.rounded()), Int((primaryHeight - p.y).rounded()))
}
func tf(_ b: Bool) -> String { b ? "True" : "False" }

let keyNames: [UInt16: String] = [
    0: "A", 11: "B", 8: "C", 2: "D", 14: "E", 3: "F", 5: "G", 4: "H", 34: "I", 38: "J", 40: "K", 37: "L", 46: "M",
    45: "N", 31: "O", 35: "P", 12: "Q", 15: "R", 1: "S", 17: "T", 32: "U", 9: "V", 13: "W", 7: "X", 16: "Y", 6: "Z",
    29: "D0", 18: "D1", 19: "D2", 20: "D3", 21: "D4", 23: "D5", 22: "D6", 26: "D7", 28: "D8", 25: "D9",
    36: "Return", 48: "Tab", 49: "Space", 51: "Back", 53: "Escape", 117: "Delete", 114: "Insert",
    115: "Home", 119: "End", 116: "PageUp", 121: "Next", 123: "Left", 124: "Right", 125: "Down", 126: "Up",
    24: "Oemplus", 27: "OemMinus",
    122: "F1", 120: "F2", 99: "F3", 118: "F4", 96: "F5", 97: "F6", 98: "F7", 100: "F8", 101: "F9", 109: "F10",
    103: "F11", 111: "F12", 105: "F13", 107: "F14", 113: "F15", 106: "F16", 64: "F17", 79: "F18", 80: "F19", 90: "F20",
    55: "LWin", 54: "RWin", 56: "ShiftKey", 60: "ShiftKey", 58: "Menu", 61: "Menu", 59: "ControlKey", 62: "ControlKey",
]
func name(_ code: UInt16) -> String { keyNames[code] ?? "KeyCode\(code)" }

final class ProbeView: NSView {
    var downAt: (Int, Int)? = nil
    var moved = false
    var lastFlags: NSEvent.ModifierFlags = []
    override var acceptsFirstResponder: Bool { true }
    override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }

    func mods(_ f: NSEvent.ModifierFlags) -> String {
        "CTRL:\(tf(f.contains(.control) || f.contains(.command)))|SHIFT:\(tf(f.contains(.shift)))|ALT:\(tf(f.contains(.option)))|CMD:\(tf(f.contains(.command)))"
    }
    override func keyDown(with e: NSEvent) {
        W("KEYDOWN|\(name(e.keyCode))|\(mods(e.modifierFlags))")
        let f = e.modifierFlags
        guard let chars = e.characters, !chars.isEmpty else { return }
        // Windows sends no printable character for Ctrl/Cmd+<key>; follow it.
        let printable = chars.unicodeScalars.allSatisfy { $0.value >= 0x20 && $0.value != 0x7f && !(0xF700...0xF8FF).contains($0.value) }
        if (f.contains(.control) || f.contains(.command)) && printable { return }
        for u in chars.utf16 {
            if (0xF700...0xF8FF).contains(Int(u)) { continue }     // AppKit function-key private use codes
            let s = (u >= 0x20 && u != 0x7f && !(0xD800...0xDFFF).contains(Int(u))) ? String(utf16CodeUnits: [u], count: 1) : ""
            W(String(format: "CHAR|U+%04X|", u) + s)
        }
    }
    override func keyUp(with e: NSEvent) { W("KEYUP|\(name(e.keyCode))") }
    override func flagsChanged(with e: NSEvent) {
        let f = e.modifierFlags
        let pairs: [(NSEvent.ModifierFlags, String)] = [(.control, "ControlKey"), (.shift, "ShiftKey"), (.option, "Menu"), (.command, "LWin")]
        for (flag, n) in pairs {
            if f.contains(flag) && !lastFlags.contains(flag) { W("KEYDOWN|\(n)|\(mods(f))") }
            if !f.contains(flag) && lastFlags.contains(flag) { W("KEYUP|\(n)") }
        }
        lastFlags = f
    }
    func down(_ e: NSEvent, _ b: String) {
        let (x, y) = globalTopLeft(e)
        W("MOUSEDOWN|\(b)|\(x),\(y)")
        if e.clickCount == 2 { W("DOUBLECLICK|\(b)|\(x),\(y)") }
        if b == "Left" { downAt = (x, y); moved = false }
    }
    func up(_ e: NSEvent, _ b: String) {
        let (x, y) = globalTopLeft(e)
        W("MOUSEUP|\(b)|\(x),\(y)")
        if b == "Left", let a = downAt, moved, a != (x, y) { W("DRAG|\(a.0),\(a.1)->\(x),\(y)") }
        if b == "Left" { downAt = nil }
    }
    override func mouseDown(with e: NSEvent) { window?.makeFirstResponder(self); down(e, "Left") }
    override func mouseUp(with e: NSEvent) { up(e, "Left") }
    override func rightMouseDown(with e: NSEvent) { down(e, "Right") }
    override func rightMouseUp(with e: NSEvent) { up(e, "Right") }
    override func otherMouseDown(with e: NSEvent) { down(e, "Middle") }
    override func otherMouseUp(with e: NSEvent) { up(e, "Middle") }
    override func mouseDragged(with e: NSEvent) { if downAt != nil { moved = true } }
    override func scrollWheel(with e: NSEvent) {
        let (x, y) = globalTopLeft(e)
        // line-based wheel events: deltaY is in lines; 120 per notch like Windows
        let lines = e.hasPreciseScrollingDeltas ? e.scrollingDeltaY / 10 : e.deltaY
        let d = Int((lines * 120).rounded())
        if d != 0 { W("WHEEL|\(d)|\(x),\(y)") }
    }
}

final class Controls: NSObject, NSTextFieldDelegate {
    @objc func pressed(_ b: NSButton) { W("BUTTON|\(b.title)") }
    @objc func toggled(_ b: NSButton) { W("CHECK|\(b.title)|\(b.state == .on ? "on" : "off")") }
    func controlTextDidChange(_ n: Notification) { if let f = n.object as? NSTextField { W("FIELD|\(f.placeholderString ?? "")|\(f.stringValue)") } }
}
let controls = Controls()

final class Delegate: NSObject, NSApplicationDelegate {
    var window: NSWindow!
    func applicationDidFinishLaunching(_ n: Notification) {
        // AppKit frames are bottom-left origin; convert the requested top-left rect.
        let frame = NSRect(x: rect.x, y: primaryHeight - rect.y - rect.h, width: rect.w, height: rect.h)
        window = KeyableWindow(contentRect: frame, styleMask: [.borderless], backing: .buffered, defer: false)
        window.title = "ORION Input Probe"
        window.backgroundColor = .white
        window.level = .floating
        let v = ProbeView(frame: NSRect(x: 0, y: 0, width: rect.w, height: rect.h))
        window.contentView = v
        if withControls {
            let b = NSButton(title: "Press Me", target: controls, action: #selector(Controls.pressed(_:)))
            b.frame = NSRect(x: 40, y: rect.h - 80, width: 160, height: 32)
            let f = NSTextField(frame: NSRect(x: 40, y: rect.h - 140, width: 300, height: 24))
            f.placeholderString = "Your name"
            f.delegate = controls
            f.setAccessibilityLabel("Your name")
            let c = NSButton(checkboxWithTitle: "Remember me", target: controls, action: #selector(Controls.toggled(_:)))
            c.frame = NSRect(x: 40, y: rect.h - 190, width: 200, height: 24)
            for x in [b, f, c] as [NSView] { v.addSubview(x) }
        }
        window.makeKeyAndOrderFront(nil)
        window.makeFirstResponder(v)
        NSApp.activate(ignoringOtherApps: true)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            NSApp.activate(ignoringOtherApps: true)
            self.window.makeKeyAndOrderFront(nil)
            let f = self.window.frame
            W("READY|HWND:\(self.window.windowNumber)|X:\(Int(f.minX))|Y:\(Int(primaryHeight - f.maxY))|W:\(Int(f.width))|H:\(Int(f.height))")
        }
    }
}

// Borderless windows can't become key (receive keyboard input) by default; allow it.
final class KeyableWindow: NSWindow { override var canBecomeKey: Bool { true }; override var canBecomeMain: Bool { true } }

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let delegate = Delegate()
app.delegate = delegate
app.run()
