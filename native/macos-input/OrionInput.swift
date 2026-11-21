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
struct Front { var window: Int; var pid: Int32; var name: String; var title: String; var bounds: CGRect = .zero }

func frontWindow() -> Front {
    let app = NSWorkspace.shared.frontmostApplication
    let pid = app?.processIdentifier ?? 0
    var win = 0, title = "", bounds = CGRect.zero
    if let list = CGWindowListCopyWindowInfo([.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]] {
        for w in list {
            let owner = (w[kCGWindowOwnerPID as String] as? Int32) ?? -1
            let layer = (w[kCGWindowLayer as String] as? Int) ?? -1
            // The list is front-to-back. Accept any app level below the menu
            // bar (24): floating panels and always-on-top windows count too.
            if owner == pid && layer >= 0 && layer < 24 {
                win = (w[kCGWindowNumber as String] as? Int) ?? 0
                title = (w[kCGWindowName as String] as? String) ?? ""
                if let b = w[kCGWindowBounds as String] as? NSDictionary, let r = CGRect(dictionaryRepresentation: b) { bounds = r }
                break
            }
        }
    }
    let name = app?.localizedName ?? ""
    return Front(window: win, pid: pid, name: name, title: title.replacingOccurrences(of: "|", with: "/"), bounds: bounds)
}
func foregroundInfo() -> String {
    let f = frontWindow()
    return "HWND:\(f.window)|PID:\(f.pid)|PROCESS:\(f.name)|TITLE:\(f.title)|BOUNDS:\(Int(f.bounds.minX)),\(Int(f.bounds.minY)),\(Int(f.bounds.width)),\(Int(f.bounds.height))"
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


// ------------------------------------------------------------------ apps + windows
func jsonEsc(_ s: String) -> String {
    var o = ""
    for u in s.unicodeScalars {
        switch u {
        case "\"": o += "\\\""
        case "\\": o += "\\\\"
        default: o += u.value < 0x20 ? " " : String(u)
        }
    }
    return o
}
func b64(_ s: String?) -> String? { s.flatMap { Data(base64Encoded: $0) }.flatMap { String(data: $0, encoding: .utf8) } }

func listWindows() -> [String] {
    var lines: [String] = []
    guard let list = CGWindowListCopyWindowInfo([.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]] else { return lines }
    for w in list {
        let layer = (w[kCGWindowLayer as String] as? Int) ?? -1
        guard layer >= 0 && layer < 24 else { continue }
        let owner = (w[kCGWindowOwnerName as String] as? String) ?? ""
        let pid = (w[kCGWindowOwnerPID as String] as? Int32) ?? 0
        let num = (w[kCGWindowNumber as String] as? Int) ?? 0
        let title = (w[kCGWindowName as String] as? String) ?? ""
        var r = CGRect.zero
        if let b = w[kCGWindowBounds as String] as? NSDictionary, let rr = CGRect(dictionaryRepresentation: b) { r = rr }
        if r.width < 40 || r.height < 40 { continue }
        lines.append("{\"window\":\(num),\"pid\":\(pid),\"process\":\"\(jsonEsc(owner))\",\"title\":\"\(jsonEsc(title))\",\"x\":\(Int(r.minX)),\"y\":\(Int(r.minY)),\"w\":\(Int(r.width)),\"h\":\(Int(r.height))}")
    }
    return lines
}

// Windows app names ORION's tools and models use -> the macOS app that does the job.
let macAliases: [String: String] = [
    "notepad": "TextEdit", "wordpad": "TextEdit", "text editor": "TextEdit",
    "file explorer": "Finder", "explorer": "Finder", "files": "Finder", "this pc": "Finder",
    "cmd": "Terminal", "command prompt": "Terminal", "powershell": "Terminal", "windows terminal": "Terminal", "terminal": "Terminal",
    "task manager": "Activity Monitor", "control panel": "System Settings", "settings": "System Settings",
    "system preferences": "System Settings", "paint": "Preview", "photos": "Photos", "snipping tool": "Screenshot",
    "calc": "Calculator", "calculator": "Calculator", "edge": "Microsoft Edge", "microsoft edge": "Microsoft Edge",
    "chrome": "Google Chrome", "google chrome": "Google Chrome", "word": "Microsoft Word", "excel": "Microsoft Excel",
    "powerpoint": "Microsoft PowerPoint", "outlook": "Microsoft Outlook", "teams": "Microsoft Teams",
    "vscode": "Visual Studio Code", "vs code": "Visual Studio Code", "code": "Visual Studio Code",
    "wt": "Terminal", "taskmgr": "Activity Monitor", "mspaint": "Preview", "snippingtool": "Screenshot",
    "control": "System Settings", "ms-settings": "System Settings", "msedge": "Microsoft Edge", "winword": "Microsoft Word",
    "powerpnt": "Microsoft PowerPoint", "onenote": "Microsoft OneNote",
    "mail": "Mail", "calendar": "Calendar", "clock": "Clock", "maps": "Maps", "music": "Music", "spotify": "Spotify",
]
func macAppName(_ raw: String) -> String {
    let k = raw.trimmingCharacters(in: .whitespaces).lowercased().replacingOccurrences(of: ".exe", with: "")
    return macAliases[k] ?? raw.trimmingCharacters(in: .whitespaces)
}
func runningApp(matching name: String) -> NSRunningApplication? {
    let n = name.lowercased()
    let apps = NSWorkspace.shared.runningApplications.filter { $0.activationPolicy == .regular }
    if let a = apps.first(where: { ($0.localizedName ?? "").lowercased() == n }) { return a }
    if let a = apps.first(where: { ($0.localizedName ?? "").lowercased().contains(n) || ($0.bundleIdentifier ?? "").lowercased().contains(n) }) { return a }
    // match a window title (e.g. "YouTube" in a browser window)
    if let list = CGWindowListCopyWindowInfo([.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]] {
        for w in list where ((w[kCGWindowName as String] as? String) ?? "").lowercased().contains(n) {
            if let pid = w[kCGWindowOwnerPID as String] as? Int32, let a = NSRunningApplication(processIdentifier: pid) { return a }
        }
    }
    return nil
}
@discardableResult
func runOpen(_ args: [String]) -> Int32 {
    let p = Process()
    p.executableURL = URL(fileURLWithPath: "/usr/bin/open")
    p.arguments = args
    p.standardOutput = FileHandle.nullDevice
    p.standardError = FileHandle.nullDevice
    do { try p.run() } catch { return 127 }
    p.waitUntilExit()
    return p.terminationStatus
}
func waitFront(_ pred: (NSRunningApplication) -> Bool, ms: Int) -> NSRunningApplication? {
    var waited = 0
    while waited <= ms {
        if let f = NSWorkspace.shared.frontmostApplication, pred(f) { return f }
        msleep(100); waited += 100
    }
    return nil
}
// Bring an app to the front. Background processes may not activate others on
// recent macOS, so `open -a <bundle>` (handled by LaunchServices) is the fallback.
func focusApp(_ a: NSRunningApplication) -> Bool {
    if NSWorkspace.shared.frontmostApplication?.processIdentifier == a.processIdentifier { return true }
    a.activate(options: [.activateAllWindows])
    if waitFront({ $0.processIdentifier == a.processIdentifier }, ms: 700) != nil { return true }
    if let url = a.bundleURL { runOpen(["-a", url.path]) }
    return waitFront({ $0.processIdentifier == a.processIdentifier }, ms: 2000) != nil
}

// ------------------------------------------------------------------ accessibility tree (UIA equivalent)
func ax(_ e: AXUIElement, _ a: String) -> AnyObject? {
    var v: AnyObject?
    return AXUIElementCopyAttributeValue(e, a as CFString, &v) == .success ? v : nil
}
func axString(_ e: AXUIElement, _ a: String) -> String { (ax(e, a) as? String) ?? "" }
func axFrame(_ e: AXUIElement) -> CGRect? {
    guard let pv = ax(e, kAXPositionAttribute), let sv = ax(e, kAXSizeAttribute) else { return nil }
    var p = CGPoint.zero, s = CGSize.zero
    guard CFGetTypeID(pv) == AXValueGetTypeID(), CFGetTypeID(sv) == AXValueGetTypeID() else { return nil }
    AXValueGetValue(pv as! AXValue, .cgPoint, &p)
    AXValueGetValue(sv as! AXValue, .cgSize, &s)
    return CGRect(origin: p, size: s)
}
struct Control { let el: AXUIElement; let name: String; let role: String; let frame: CGRect; let password: Bool }
let interactiveRoles: [String: String] = [
    "AXButton": "Button", "AXTextField": "Edit", "AXTextArea": "Edit", "AXSecureTextField": "Edit", "AXComboBox": "ComboBox",
    "AXCheckBox": "CheckBox", "AXRadioButton": "RadioButton", "AXPopUpButton": "ComboBox", "AXMenuButton": "SplitButton",
    "AXMenuItem": "MenuItem", "AXLink": "Hyperlink", "AXTab": "TabItem", "AXDisclosureTriangle": "Button", "AXSlider": "Slider",
    "AXIncrementor": "Spinner", "AXSearchField": "Edit", "AXCell": "ListItem", "AXRow": "ListItem",
]
func controlName(_ e: AXUIElement) -> String {
    for a in [kAXTitleAttribute, kAXDescriptionAttribute, "AXPlaceholderValue", kAXHelpAttribute] {
        let s = axString(e, a).trimmingCharacters(in: .whitespacesAndNewlines)
        if !s.isEmpty { return s }
    }
    if let t = ax(e, kAXTitleUIElementAttribute), CFGetTypeID(t) == AXUIElementGetTypeID() {
        let s = axString(t as! AXUIElement, kAXValueAttribute)
        if !s.isEmpty { return s }
    }
    let role = axString(e, kAXRoleAttribute)
    if role == "AXButton" || role == "AXCheckBox" || role == "AXRadioButton" { return axString(e, kAXValueAttribute) }
    return ""
}
func frontWindowElement() -> AXUIElement? {
    guard let app = NSWorkspace.shared.frontmostApplication else { return nil }
    let a = AXUIElementCreateApplication(app.processIdentifier)
    if let w = ax(a, kAXFocusedWindowAttribute), CFGetTypeID(w) == AXUIElementGetTypeID() { return (w as! AXUIElement) }
    if let ws = ax(a, kAXWindowsAttribute) as? [AXUIElement], let w = ws.first { return w }
    return a
}
func collectControls(max: Int) -> [Control] {
    guard let root = frontWindowElement() else { return [] }
    var out: [Control] = [], queue: [AXUIElement] = [root], seen = 0
    while !queue.isEmpty && out.count < max && seen < 4000 {
        let e = queue.removeFirst(); seen += 1
        let role = axString(e, kAXRoleAttribute), sub = axString(e, kAXSubroleAttribute)
        if let mapped = interactiveRoles[role] ?? interactiveRoles[sub] {
            let enabled = (ax(e, kAXEnabledAttribute) as? Bool) ?? true
            if enabled, let f = axFrame(e), f.width >= 2, f.height >= 2 {
                let name = controlName(e)
                if !name.isEmpty || mapped == "Edit" {
                    out.append(Control(el: e, name: name, role: mapped, frame: f, password: role == "AXSecureTextField" || sub == "AXSecureTextField"))
                }
            }
        }
        if let kids = ax(e, kAXChildrenAttribute) as? [AXUIElement] { queue.append(contentsOf: kids) }
    }
    return out
}
func findControl(_ name: String, timeoutMs: Int = 3000) -> Control? {
    let n = name.trimmingCharacters(in: .whitespaces).lowercased()
    var waited = 0
    repeat {
        let all = collectControls(max: 400)
        if let c = all.first(where: { $0.name.lowercased() == n }) { return c }
        if let c = all.first(where: { $0.name.lowercased().contains(n) }) { return c }
        msleep(150); waited += 150
    } while waited < timeoutMs
    return nil
}
func describe(_ c: Control) -> String { "NAME:\(c.name.replacingOccurrences(of: "|", with: "/"))|TYPE:\(c.role)" }

// ------------------------------------------------------------------ main
var args = Array(CommandLine.arguments.dropFirst())
guard let cmdRaw = args.first else {
    out("USAGE: orion-input-macos <status|permission|getpos|setpos|click|clickat|doubleclick|mousedown|mouseup|drag|scroll|typeunicode|presskey|keydown|keyup|winhotkey|submit|releaseall|foreground|windows|focus|launch|uia-list|uia-invoke|uia-setvalue|uia-focused-value> [args]")
    exit(0)
}
let cmd = cmdRaw.lowercased()
args.removeFirst()
func arg(_ i: Int) -> String? { i < args.count ? args[i] : nil }

let inputCommands: Set<String> = ["clickat", "click", "doubleclick", "mousedown", "drag", "scroll", "typeunicode", "presskey", "keydown", "submit", "setpos", "winhotkey", "uia-invoke", "uia-setvalue"]
let needsAccessibility: Set<String> = inputCommands.union(["uia-list", "uia-focused-value"])
let trusted = AXIsProcessTrusted()

if needsAccessibility.contains(cmd) && !trusted {
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
case "windows":
    for l in listWindows() { out(l) }
    out("WINDOWS_OK:\(listWindows().count)")
case "focus":
    guard let name = b64(arg(0)) ?? arg(0) else { out("ERR_INVALID_ARGS: focus requires <base64 app or window name>"); code = 2; break }
    guard let a = runningApp(matching: macAppName(name)) ?? runningApp(matching: name) else {
        out("FOCUS_NOT_FOUND:\(name.replacingOccurrences(of: "|", with: "/"))|\(foregroundInfo())"); code = 8; break
    }
    if focusApp(a) { out("FOCUS_OK:\(a.localizedName ?? "")|\(foregroundInfo())") }
    else { out("FOCUS_UNVERIFIED:\(a.localizedName ?? "")|\(foregroundInfo())"); code = 3 }
case "launch":
    guard let target = b64(arg(0)) ?? arg(0), !target.isEmpty else { out("ERR_INVALID_ARGS: launch requires <base64 app name or URL>"); code = 2; break }
    let before = NSWorkspace.shared.frontmostApplication?.processIdentifier
    if target.contains("://") {
        if runOpen([target]) != 0 { out("LAUNCH_FAILED:could not open \(target)"); code = 8; break }
        if let f = waitFront({ $0.processIdentifier != before }, ms: 6000) ?? NSWorkspace.shared.frontmostApplication {
            out("LAUNCH_OK:\(f.localizedName ?? "")|URL:\(target)|PID:\(f.processIdentifier)|\(foregroundInfo())")
        }
        break
    }
    let app = macAppName(target)
    if runOpen(["-a", app]) != 0 && (app == target || runOpen(["-a", target]) != 0) {
        out("LAUNCH_NOT_FOUND:'\(target)' is not installed (looked for '\(app)')"); code = 8; break
    }
    let want = app.lowercased()
    if let f = waitFront({ ($0.localizedName ?? "").lowercased().contains(want) || want.contains(($0.localizedName ?? "~").lowercased()) }, ms: 8000) {
        out("LAUNCH_OK:\(f.localizedName ?? app)|PID:\(f.processIdentifier)|FRONT:True|\(foregroundInfo())")
    } else if let r = runningApp(matching: app) {
        out("LAUNCH_UNVERIFIED:\(r.localizedName ?? app) is running but not in front|PID:\(r.processIdentifier)|\(foregroundInfo())"); code = 3
    } else {
        out("LAUNCH_UNVERIFIED:\(app) did not start|\(foregroundInfo())"); code = 3
    }
case "winhotkey":
    // The Windows key's role on macOS is Command: Win+<key> -> Cmd+<key>.
    let keys = args.filter { !["win", "windows", "lwin", "rwin"].contains($0.lowercased()) }
    let spec = (["cmd"] + keys).joined(separator: "+")
    if keys.isEmpty { out("ERR_INVALID_KEY:win|macOS has no Start menu key; send a shortcut such as cmd+space"); code = 2; break }
    switch parseChord(spec) {
    case .keys(let mods, let k): sendChord(mods, k); out("WINHOTKEY_OK:\(spec)")
    case .literal(let t): _ = typeText(t); out("WINHOTKEY_OK:\(spec)|CHAR")
    case .invalid(let why): out("ERR_INVALID_KEY:\(spec)|\(why)"); code = 2
    }
case "permission":
    let opts = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
    let ok = AXIsProcessTrustedWithOptions(opts)
    out(ok ? "PERMISSION_OK:ACCESSIBILITY" : "PERMISSION_REQUESTED:macOS is showing the Accessibility prompt; allow the app running ORION, then retry")
    if !ok { code = 15 }
case "uia-list":
    let max = Int(arg(0) ?? "") ?? 60
    let cs = collectControls(max: Swift.max(1, Swift.min(200, max)))
    for (i, c) in cs.enumerated() {
        out("{\"id\":\(i),\"name\":\"\(jsonEsc(c.name))\",\"role\":\"\(c.role)\",\"x\":\(Int(c.frame.midX)),\"y\":\(Int(c.frame.midY)),\"w\":\(Int(c.frame.width)),\"h\":\(Int(c.frame.height)),\"password\":\(c.password)}")
    }
    if cs.isEmpty { out("UIA_LIST_EMPTY|\(foregroundInfo())"); code = 8 } else { out("UIA_LIST_OK:\(cs.count)|\(foregroundInfo())") }
case "uia-invoke":
    guard let name = b64(arg(0)) else { out("ERR_INVALID_ARGS: uia-invoke requires <base64 name>"); code = 2; break }
    guard let c = findControl(name) else { out("UIA_NOT_FOUND:\(name.replacingOccurrences(of: "|", with: "/"))|\(foregroundInfo())"); code = 8; break }
    if AXUIElementPerformAction(c.el, kAXPressAction as CFString) == .success {
        out("UIA_INVOKE_OK:\(describe(c))|VIA:PRESS")
    } else {
        let p = CGPoint(x: c.frame.midX, y: c.frame.midY)
        _ = moveTo(p); msleep(30); click(.left, at: p)
        out("UIA_INVOKE_OK:\(describe(c))|VIA:CLICK@\(Int(p.x)),\(Int(p.y))")
    }
case "uia-setvalue":
    guard let name = b64(arg(0)), let value = b64(arg(1)) else { out("ERR_INVALID_ARGS: uia-setvalue requires <base64 name> <base64 value>"); code = 2; break }
    guard let c = findControl(name) else { out("UIA_NOT_FOUND:\(name.replacingOccurrences(of: "|", with: "/"))|\(foregroundInfo())"); code = 8; break }
    var settable: DarwinBoolean = false
    AXUIElementIsAttributeSettable(c.el, kAXValueAttribute as CFString, &settable)
    if c.password || !settable.boolValue { out("UIA_NOT_EDITABLE:\(describe(c))"); code = 9; break }
    AXUIElementSetAttributeValue(c.el, kAXValueAttribute as CFString, value as CFString)
    msleep(80)
    if axString(c.el, kAXValueAttribute) == value { out("UIA_SETVALUE_OK:\(describe(c))|VERIFIED:TRUE") }
    else { out("UIA_SETVALUE_MISMATCH:\(describe(c))|VERIFIED:FALSE"); code = 10 }
case "uia-focused-value":
    let sys = AXUIElementCreateSystemWide()
    if let f = ax(sys, kAXFocusedUIElementAttribute), CFGetTypeID(f) == AXUIElementGetTypeID(), let v = ax(f as! AXUIElement, kAXValueAttribute) as? String {
        out("UIA_FOCUSED_VALUE:\(Data(v.utf8).base64EncodedString())")
    } else { out("UIA_FOCUSED_NOVALUE|\(foregroundInfo())"); code = 11 }
case "foreground":
    out("FOREGROUND:\(foregroundInfo())|UIPI_BLOCKED:False")
default:
    out("ERR_UNKNOWN_CMD:\(cmd)"); code = 4
}
exit(code)
