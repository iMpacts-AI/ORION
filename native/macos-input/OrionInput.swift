// orion-input-macos — ORION's keyboard + mouse helper for macOS.
//
// Same command line protocol and reply lines as the Windows helper
// (native/win32-native-input) and the Linux one (native/linux-x11-input):
//
//   status | getpos | setpos X Y | click [btn] | clickat X Y [btn] [double]
//   doubleclick | mousedown [btn] | mouseup [btn] | drag X1 Y1 X2 Y2 [btn]
//   scroll N | typeunicode BASE64 | presskey SPEC | keydown KEY | keyup KEY
//   submit | releaseall | foreground
//
// Coordinates are global display points with a top-left origin (what
// CGEvent uses). Input needs the Accessibility permission for whichever app
// runs this helper; `status` reports PERMISSION_REQUIRED when it is missing,
// and input commands refuse instead of silently doing nothing.
// ORION_EXPECT_HWND=<window number> refuses input when another window is in front.
// On macOS "cmd" is Command and "ctrl" is Control (unlike Windows/Linux,
// where cmd maps to Ctrl).
//
// Build: swiftc -O -o orion-input-macos OrionInput.swift
// Made by iMpact Team.

import AppKit
import ApplicationServices
import Foundation

setvbuf(stdout, nil, _IOLBF, 0)

func out(_ s: String) { print(s) }
func msleep(_ ms: Int) { usleep(useconds_t(ms * 1000)) }

let src = CGEventSource(stateID: .hidSystemState)

// ------------------------------------------------------------------ windows
struct Front { var window: Int; var pid: Int32; var name: String; var title: String }

func frontWindow() -> Front {
    let app = NSWorkspace.shared.frontmostApplication
    let pid = app?.processIdentifier ?? 0
    var win = 0, title = ""
    if let list = CGWindowListCopyWindowInfo([.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]] {
        for w in list {
            let owner = (w[kCGWindowOwnerPID as String] as? Int32) ?? -1
            let layer = (w[kCGWindowLayer as String] as? Int) ?? -1
            // The list is front-to-back. Accept any app level below the menu
            // bar (24): floating panels and always-on-top windows count too.
            if owner == pid && layer >= 0 && layer < 24 {
                win = (w[kCGWindowNumber as String] as? Int) ?? 0
                title = (w[kCGWindowName as String] as? String) ?? ""
                break
            }
        }
    }
    let name = app?.localizedName ?? ""
    return Front(window: win, pid: pid, name: name, title: title.replacingOccurrences(of: "|", with: "/"))
}
func foregroundInfo() -> String {
    let f = frontWindow()
    return "HWND:\(f.window)|PID:\(f.pid)|PROCESS:\(f.name)|TITLE:\(f.title)"
}

// ------------------------------------------------------------------ pointer
func currentPos() -> CGPoint { CGEvent(source: nil)?.location ?? .zero }

func buttonOf(_ s: String?) -> CGMouseButton {
    switch (s ?? "left").lowercased() { case "right": return .right; case "middle": return .center; default: return .left }
}
func buttonName(_ b: CGMouseButton) -> String { b == .right ? "right" : b == .center ? "middle" : "left" }
func downType(_ b: CGMouseButton) -> CGEventType { b == .right ? .rightMouseDown : b == .center ? .otherMouseDown : .leftMouseDown }
func upType(_ b: CGMouseButton) -> CGEventType { b == .right ? .rightMouseUp : b == .center ? .otherMouseUp : .leftMouseUp }
func dragType(_ b: CGMouseButton) -> CGEventType { b == .right ? .rightMouseDragged : b == .center ? .otherMouseDragged : .leftMouseDragged }

func post(_ e: CGEvent?) { e?.post(tap: .cghidEventTap) }

func moveTo(_ p: CGPoint) -> Bool {
    post(CGEvent(mouseEventSource: src, mouseType: .mouseMoved, mouseCursorPosition: p, mouseButton: .left))
    for _ in 0..<20 {
        let c = currentPos()
        if abs(c.x - p.x) <= 1 && abs(c.y - p.y) <= 1 { return true }
        msleep(5)
    }
    // Some sessions ignore synthetic moves without focus; warp as a fallback.
    CGWarpMouseCursorPosition(p)
    msleep(10)
    let c = currentPos()
    return abs(c.x - p.x) <= 1 && abs(c.y - p.y) <= 1
}
func button(_ b: CGMouseButton, down: Bool, at p: CGPoint, clickState: Int64 = 1) {
    let e = CGEvent(mouseEventSource: src, mouseType: down ? downType(b) : upType(b), mouseCursorPosition: p, mouseButton: b)
    e?.setIntegerValueField(.mouseEventClickState, value: clickState)
    post(e)
}
func click(_ b: CGMouseButton, at p: CGPoint, clickState: Int64 = 1) {
    button(b, down: true, at: p, clickState: clickState)
    msleep(25)
    button(b, down: false, at: p, clickState: clickState)
}

// ------------------------------------------------------------------ keyboard
// macOS virtual key codes (Carbon kVK_*)
let letterCodes: [Character: CGKeyCode] = [
    "a": 0, "s": 1, "d": 2, "f": 3, "h": 4, "g": 5, "z": 6, "x": 7, "c": 8, "v": 9, "b": 11, "q": 12, "w": 13,
    "e": 14, "r": 15, "y": 16, "t": 17, "1": 18, "2": 19, "3": 20, "4": 21, "6": 22, "5": 23, "=": 24, "9": 25,
    "7": 26, "-": 27, "8": 28, "0": 29, "]": 30, "o": 31, "u": 32, "[": 33, "i": 34, "p": 35, "l": 37, "j": 38,
    "'": 39, "k": 40, ";": 41, "\\": 42, ",": 43, "/": 44, "n": 45, "m": 46, ".": 47, "`": 50, "+": 24,
]
let namedCodes: [String: CGKeyCode] = [
    "enter": 36, "return": 36, "tab": 48, "space": 49, "spacebar": 49, "backspace": 51, "back": 51, "bksp": 51,
    "bs": 51, "esc": 53, "escape": 53, "delete": 117, "del": 117, "insert": 114, "ins": 114, "help": 114,
    "home": 115, "end": 119, "pageup": 116, "pgup": 116, "pagedown": 121, "pgdn": 121,
    "left": 123, "right": 124, "down": 125, "up": 126, "capslock": 57, "plus": 24, "minus": 27,
    "f1": 122, "f2": 120, "f3": 99, "f4": 118, "f5": 96, "f6": 97, "f7": 98, "f8": 100, "f9": 101, "f10": 109,
    "f11": 103, "f12": 111, "f13": 105, "f14": 107, "f15": 113, "f16": 106, "f17": 64, "f18": 79, "f19": 80, "f20": 90,
]
struct Mod { let code: CGKeyCode; let flag: CGEventFlags }
let modifiers: [String: Mod] = [
    "cmd": Mod(code: 55, flag: .maskCommand), "command": Mod(code: 55, flag: .maskCommand),
    "win": Mod(code: 55, flag: .maskCommand), "windows": Mod(code: 55, flag: .maskCommand),
    "meta": Mod(code: 55, flag: .maskCommand), "super": Mod(code: 55, flag: .maskCommand),
    "ctrl": Mod(code: 59, flag: .maskControl), "control": Mod(code: 59, flag: .maskControl),
    "lctrl": Mod(code: 59, flag: .maskControl), "rctrl": Mod(code: 62, flag: .maskControl),
    "shift": Mod(code: 56, flag: .maskShift), "lshift": Mod(code: 56, flag: .maskShift), "rshift": Mod(code: 60, flag: .maskShift),
    "alt": Mod(code: 58, flag: .maskAlternate), "option": Mod(code: 58, flag: .maskAlternate), "opt": Mod(code: 58, flag: .maskAlternate),
    "lalt": Mod(code: 58, flag: .maskAlternate), "ralt": Mod(code: 61, flag: .maskAlternate),
]

func keyCode(for raw: String) -> CGKeyCode? {
    var t = raw.trimmingCharacters(in: .whitespaces).lowercased()
    if t.hasPrefix("{") && t.hasSuffix("}") && t.count > 2 { t = String(t.dropFirst().dropLast()).trimmingCharacters(in: .whitespaces) }
    if t.count == 1, let c = t.first, let k = letterCodes[c] { return k }
    if t == " " { return 49 }
    return namedCodes[t]
}

func key(_ code: CGKeyCode, down: Bool, flags: CGEventFlags) {
    let e = CGEvent(keyboardEventSource: src, virtualKey: code, keyDown: down)
    e?.flags = flags
    post(e)
}

func typeText(_ s: String) -> (typed: Int, total: Int) {
    var typed = 0, total = 0
    let text = s.replacingOccurrences(of: "\r\n", with: "\n")
    for ch in text {
        let units = Array(String(ch).utf16)
        total += units.count
        if ch == "\n" || ch == "\r" { key(36, down: true, flags: []); key(36, down: false, flags: []); typed += 1; continue }
        if ch == "\t" { key(48, down: true, flags: []); key(48, down: false, flags: []); typed += 1; continue }
        guard let d = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: true),
              let u = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: false) else { continue }
        d.flags = []; u.flags = []
        units.withUnsafeBufferPointer { p in
            d.keyboardSetUnicodeString(stringLength: units.count, unicodeString: p.baseAddress)
            u.keyboardSetUnicodeString(stringLength: units.count, unicodeString: p.baseAddress)
        }
        post(d); post(u)
        typed += units.count
        msleep(3)
    }
    return (typed, total)
}

enum Chord { case keys([Mod], CGKeyCode), literal(String), invalid(String) }

// Same grammar as the Windows helper: "cmd+s", "Ctrl + Shift + K", "^s",
// "^space", "^{SPACE}", "%{F4}", "+{TAB}", "enter", "{ENTER}". A single
// non-alphanumeric character is typed as that character.
func parseChord(_ spec: String) -> Chord {
    let s = spec.trimmingCharacters(in: .whitespaces)
    if spec.isEmpty { return .invalid("empty key") }
    if s.isEmpty { return .keys([], 49) }
    if s.count == 1 {
        let c = s.first!
        if c.isLetter && c.isASCII || c.isNumber && c.isASCII { return .keys([], letterCodes[Character(c.lowercased())]!) }
        return .literal(s)
    }
    let lower = s.lowercased()
    if let plus = lower.firstIndex(of: "+"), plus != lower.startIndex,
       modifiers[lower[..<plus].trimmingCharacters(in: .whitespaces)] != nil {
        var mods: [Mod] = []
        var rest = Substring(lower)
        while let p = rest.firstIndex(of: "+"), p != rest.startIndex,
              let m = modifiers[rest[..<p].trimmingCharacters(in: .whitespaces)] {
            if !mods.contains(where: { $0.code == m.code }) { mods.append(m) }
            rest = rest[rest.index(after: p)...]
        }
        var last = rest.trimmingCharacters(in: .whitespaces)
        if last.isEmpty && lower.hasSuffix("++") { last = "+" }
        if last.isEmpty { return .invalid("shortcut has no key after the modifiers") }
        if let m = modifiers[last] { return .keys(mods, m.code) }
        guard let k = keyCode(for: last) else { return .invalid("unknown key '\(last)'") }
        return .keys(mods, k)
    }
    var mods: [Mod] = []
    var chars = Array(s)
    while chars.count > 1, let c = chars.first, "^%+".contains(c) {
        let m = c == "^" ? modifiers["ctrl"]! : c == "%" ? modifiers["alt"]! : modifiers["shift"]!
        if !mods.contains(where: { $0.code == m.code }) { mods.append(m) }
        chars.removeFirst()
    }
    let keyPart = String(chars)
    if keyPart.count == 3 && keyPart.hasPrefix("{") && keyPart.hasSuffix("}") {
        let inner = keyPart[keyPart.index(after: keyPart.startIndex)]
        if !(inner.isLetter || inner.isNumber) {
            if mods.isEmpty { return .literal(String(inner)) }
            if let k = letterCodes[inner] { return .keys(mods, k) }
        }
    }
    guard let k = keyCode(for: keyPart) else { return .invalid("unknown key '\(keyPart)'") }
    return .keys(mods, k)
}

func sendChord(_ mods: [Mod], _ k: CGKeyCode) {
    var flags: CGEventFlags = []
    for m in mods { flags.insert(m.flag); key(m.code, down: true, flags: flags); msleep(10) }
    key(k, down: true, flags: flags); msleep(10); key(k, down: false, flags: flags)
    for m in mods.reversed() { msleep(10); flags.remove(m.flag); key(m.code, down: false, flags: flags) }
}

func releaseAll() -> Int {
    var n = 0
    let f = CGEventSource.flagsState(.combinedSessionState)
    for (flag, code) in [(CGEventFlags.maskCommand, CGKeyCode(55)), (.maskShift, 56), (.maskAlternate, 58), (.maskControl, 59)] where f.contains(flag) {
        key(code, down: false, flags: []); n += 1
    }
    let p = currentPos()
    for b in [CGMouseButton.left, .right, .center] where CGEventSource.buttonState(.combinedSessionState, button: b) {
        button(b, down: false, at: p); n += 1
    }
    return n
}

// ------------------------------------------------------------------ main
var args = Array(CommandLine.arguments.dropFirst())
guard let cmdRaw = args.first else {
    out("USAGE: orion-input-macos <status|getpos|setpos|click|clickat|doubleclick|mousedown|mouseup|drag|scroll|typeunicode|presskey|keydown|keyup|submit|releaseall|foreground> [args]")
    exit(0)
}
let cmd = cmdRaw.lowercased()
args.removeFirst()
func arg(_ i: Int) -> String? { i < args.count ? args[i] : nil }

let inputCommands: Set<String> = ["clickat", "click", "doubleclick", "mousedown", "drag", "scroll", "typeunicode", "presskey", "keydown", "submit", "setpos"]
let trusted = AXIsProcessTrusted()

if inputCommands.contains(cmd) && !trusted {
    out("PERMISSION_REQUIRED:macOS has not given Accessibility access to the app running ORION (System Settings > Privacy & Security > Accessibility); nothing was sent")
    exit(15)
}
if let expect = ProcessInfo.processInfo.environment["ORION_EXPECT_HWND"], !expect.isEmpty, expect != "0", inputCommands.contains(cmd) {
    let f = frontWindow()
    if String(f.window) != expect {
        out("FOCUS_CHANGED:the window in front is no longer the one ORION was working in; nothing was sent|EXPECTED:\(expect)|\(foregroundInfo())")
        exit(13)
    }
}

var code: Int32 = 0
switch cmd {
case "status":
    let screen = CGDisplayBounds(CGMainDisplayID())
    let shot = CGPreflightScreenCaptureAccess()
    out("STATUS:\(trusted ? "INTERACTIVE" : "PERMISSION_REQUIRED")|DESKTOP:macOS|SCREEN:\(Int(screen.width))x\(Int(screen.height))|ACCESSIBILITY:\(trusted ? "TRUSTED" : "NOT_TRUSTED")|SCREEN_RECORDING:\(shot ? "GRANTED" : "NOT_GRANTED")")
case "getpos":
    let p = currentPos(); out("POS:\(Int(p.x.rounded())),\(Int(p.y.rounded()))")
case "setpos":
    guard let x = arg(0).flatMap(Double.init), let y = arg(1).flatMap(Double.init) else { out("ERR_INVALID_ARGS: setpos requires <x> <y>"); code = 2; break }
    let ok = moveTo(CGPoint(x: x, y: y)); let c = currentPos()
    out(ok ? "SET_OK:\(Int(c.x)),\(Int(c.y))" : "SET_UNVERIFIED:\(Int(x)),\(Int(y))|ACTUAL:\(Int(c.x)),\(Int(c.y))")
case "click":
    let b = buttonOf(arg(0)); click(b, at: currentPos()); out("CLICK_OK:\(buttonName(b))")
case "clickat":
    guard let x = arg(0).flatMap(Double.init), let y = arg(1).flatMap(Double.init) else { out("ERR_INVALID_ARGS: clickat requires <x> <y> [button] [double]"); code = 2; break }
    let p = CGPoint(x: x, y: y), b = buttonOf(arg(2)), dbl = arg(3)?.lowercased() == "double"
    if !moveTo(p) { let c = currentPos(); out("CLICKAT_FAILED:cursor not at target|ACTUAL:\(Int(c.x)),\(Int(c.y))"); code = 3; break }
    msleep(30); click(b, at: p)
    if dbl { msleep(60); click(b, at: p, clickState: 2) }
    let c = currentPos()
    out("CLICKAT_OK:\(Int(c.x)),\(Int(c.y))|BUTTON:\(buttonName(b))\(dbl ? "|DOUBLE" : "")|\(foregroundInfo())")
case "doubleclick":
    let p = currentPos(); click(.left, at: p); msleep(50); click(.left, at: p, clickState: 2); out("DOUBLECLICK_OK:left")
case "mousedown", "mouseup":
    let b = buttonOf(arg(0)); button(b, down: cmd == "mousedown", at: currentPos())
    out("\(cmd == "mousedown" ? "MOUSEDOWN_OK:" : "MOUSEUP_OK:")\(buttonName(b))")
case "drag":
    guard let x1 = arg(0).flatMap(Double.init), let y1 = arg(1).flatMap(Double.init),
          let x2 = arg(2).flatMap(Double.init), let y2 = arg(3).flatMap(Double.init) else { out("ERR_INVALID_ARGS: drag requires <x1> <y1> <x2> <y2> [button]"); code = 2; break }
    let b = buttonOf(arg(4)), a = CGPoint(x: x1, y: y1), z = CGPoint(x: x2, y: y2)
    if !moveTo(a) { let c = currentPos(); out("DRAG_FAILED:cursor not at start|ACTUAL:\(Int(c.x)),\(Int(c.y))"); code = 3; break }
    msleep(30); button(b, down: true, at: a)
    let steps = max(4, min(25, Int(max(abs(x2 - x1), abs(y2 - y1)) / 20)))
    for i in 1...steps {
        let p = CGPoint(x: x1 + (x2 - x1) * Double(i) / Double(steps), y: y1 + (y2 - y1) * Double(i) / Double(steps))
        post(CGEvent(mouseEventSource: src, mouseType: dragType(b), mouseCursorPosition: p, mouseButton: b))
        msleep(12)
    }
    msleep(30); button(b, down: false, at: z)
    msleep(20)
    let c = currentPos(), ok = abs(c.x - x2) <= 2 && abs(c.y - y2) <= 2
    out("\(ok ? "DRAG_OK:" : "DRAG_UNVERIFIED:")\(Int(c.x)),\(Int(c.y))|FROM:\(Int(x1)),\(Int(y1))|BUTTON:\(buttonName(b))")
    if !ok { code = 3 }
case "scroll":
    let n = Int32(arg(0).flatMap { Int($0) } ?? -3)
    post(CGEvent(scrollWheelEvent2Source: src, units: .line, wheelCount: 1, wheel1: n, wheel2: 0, wheel3: 0))
    out("SCROLL_OK:\(n)")
case "typeunicode":
    guard let b = arg(0), let data = Data(base64Encoded: b), let s = String(data: data, encoding: .utf8) else { out("ERR_INVALID_ARGS: typeunicode requires <base64>"); code = 2; break }
    let r = typeText(s)
    if r.typed == r.total { out("TYPEUNICODE_OK:\(r.typed)|\(foregroundInfo())") } else { out("TYPEUNICODE_PARTIAL:\(r.typed)/\(r.total)|\(foregroundInfo())"); code = 6 }
case "submit":
    key(36, down: true, flags: []); key(36, down: false, flags: []); out("SUBMIT_OK:enter|\(foregroundInfo())")
case "presskey":
    guard let spec = arg(0) else { out("ERR_INVALID_ARGS: presskey requires <key>"); code = 2; break }
    switch parseChord(spec) {
    case .invalid(let why): out("ERR_INVALID_KEY:\(spec)|\(why)"); code = 2
    case .literal(let t): _ = typeText(t); out("KEY_OK:\(spec)|CHAR")
    case .keys(let mods, let k):
        sendChord(mods, k); out("KEY_OK:\(spec)|VK:\(k)|MODS:\(mods.map { String($0.code) }.joined(separator: ","))")
    }
case "keydown", "keyup":
    let name = arg(0) ?? ""
    if let m = modifiers[name.lowercased()] {
        key(m.code, down: cmd == "keydown", flags: cmd == "keydown" ? m.flag : [])
    } else if let k = keyCode(for: name) {
        key(k, down: cmd == "keydown", flags: [])
    } else { out("ERR_INVALID_KEY:\(name)"); code = 2; break }
    out("\(cmd == "keydown" ? "KEYDOWN_OK:" : "KEYUP_OK:")\(name)")
case "releaseall":
    out("RELEASEALL_OK:\(releaseAll())")
case "foreground":
    out("FOREGROUND:\(foregroundInfo())|UIPI_BLOCKED:False")
default:
    out("ERR_UNKNOWN_CMD:\(cmd)"); code = 4
}
exit(code)
