/*
 * orion-input-x11 — ORION's keyboard + mouse helper for Linux (X11).
 *
 * Speaks the same command line protocol and reply lines as the Windows helper
 * (native/win32-native-input), so ORION drives every OS the same way:
 *
 *   status | getpos | setpos X Y | click [btn] | clickat X Y [btn] [double]
 *   doubleclick | mousedown [btn] | mouseup [btn] | drag X1 Y1 X2 Y2 [btn]
 *   scroll N | typeunicode BASE64 | presskey SPEC | keydown KEY | keyup KEY
 *   releaseall | foreground
 *
 * Input goes through XTest (works on any X11 desktop; on Wayland it only
 * reaches apps running under XWayland, and `status` says so).
 * ORION_EXPECT_HWND=<window id> refuses input when another window is in front.
 *
 * Build: cc -O2 -o orion-input-x11 orion-input-x11.c -lX11 -lXtst
 * Made by iMpact Team.
 */
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/Xatom.h>
#include <X11/keysym.h>
#include <X11/XKBlib.h>
#include <X11/extensions/XTest.h>
#include <ctype.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <time.h>
#include <unistd.h>

static Display *dpy;
static Window root;

static void msleep(int ms) {
    struct timespec t = { ms / 1000, (long)(ms % 1000) * 1000000L };
    nanosleep(&t, NULL);
}

/* ------------------------------------------------------------------ pointer */
static int get_pos(int *x, int *y, unsigned *mask) {
    Window r, c; int wx, wy; unsigned m;
    if (!XQueryPointer(dpy, root, &r, &c, x, y, &wx, &wy, &m)) return 0;
    if (mask) *mask = m;
    return 1;
}
static int move_abs(int x, int y) {
    XTestFakeMotionEvent(dpy, -1, x, y, CurrentTime);
    XSync(dpy, False);
    int cx, cy;
    for (int i = 0; i < 20; i++) {
        if (get_pos(&cx, &cy, NULL) && abs(cx - x) <= 1 && abs(cy - y) <= 1) return 1;
        msleep(5);
    }
    return 0;
}
static int button_num(const char *b) {
    if (b && !strcasecmp(b, "right")) return 3;
    if (b && !strcasecmp(b, "middle")) return 2;
    return 1;
}
static const char *button_name(int n) { return n == 3 ? "right" : n == 2 ? "middle" : "left"; }
static void button(int n, int down) {
    XTestFakeButtonEvent(dpy, (unsigned)n, down ? True : False, CurrentTime);
    XSync(dpy, False);
}
static void click_at_current(int n) { button(n, 1); msleep(25); button(n, 0); }

/* ------------------------------------------------------------------ windows */
static Window active_window(void) {
    Atom a = XInternAtom(dpy, "_NET_ACTIVE_WINDOW", True);
    if (a != None) {
        Atom type; int fmt; unsigned long n, after; unsigned char *data = NULL;
        if (XGetWindowProperty(dpy, root, a, 0, 1, False, XA_WINDOW, &type, &fmt, &n, &after, &data) == Success && data) {
            Window w = n ? *(Window *)data : None;
            XFree(data);
            if (w) return w;
        }
    }
    Window f; int rev;
    XGetInputFocus(dpy, &f, &rev);
    if (f == PointerRoot || f == None) return None;
    return f;
}
static long window_pid(Window w) {
    Atom a = XInternAtom(dpy, "_NET_WM_PID", True);
    if (a == None || !w) return 0;
    Atom type; int fmt; unsigned long n, after; unsigned char *data = NULL; long pid = 0;
    if (XGetWindowProperty(dpy, w, a, 0, 1, False, XA_CARDINAL, &type, &fmt, &n, &after, &data) == Success && data) {
        if (n) pid = (long)*(unsigned long *)data;
        XFree(data);
    }
    return pid;
}
static void window_title(Window w, char *out, size_t len) {
    out[0] = 0;
    if (!w) return;
    Atom net = XInternAtom(dpy, "_NET_WM_NAME", True), utf8 = XInternAtom(dpy, "UTF8_STRING", True);
    Atom type; int fmt; unsigned long n, after; unsigned char *data = NULL;
    if (net != None && XGetWindowProperty(dpy, w, net, 0, 256, False, utf8, &type, &fmt, &n, &after, &data) == Success && data) {
        snprintf(out, len, "%s", (char *)data); XFree(data);
    } else {
        char *name = NULL;
        if (XFetchName(dpy, w, &name) && name) { snprintf(out, len, "%s", name); XFree(name); }
    }
    for (char *p = out; *p; p++) if (*p == '|' || *p == '\n') *p = '/';
}
static void process_name(long pid, char *out, size_t len) {
    out[0] = 0;
    if (pid <= 0) return;
    char path[64]; snprintf(path, sizeof path, "/proc/%ld/comm", pid);
    FILE *f = fopen(path, "r");
    if (!f) return;
    if (fgets(out, (int)len, f)) out[strcspn(out, "\n")] = 0;
    fclose(f);
}
static void foreground_info(char *out, size_t len) {
    Window w = active_window();
    long pid = window_pid(w);
    char title[256], proc[64];
    window_title(w, title, sizeof title);
    process_name(pid, proc, sizeof proc);
    snprintf(out, len, "HWND:%lu|PID:%ld|PROCESS:%s|TITLE:%s", (unsigned long)w, pid, proc, title);
}

/* ------------------------------------------------------------------ keyboard */
static KeySym name_to_keysym(const char *raw) {
    char t[64]; size_t n = strlen(raw);
    if (n >= sizeof t) return NoSymbol;
    /* lower-case, strip {braces} */
    size_t j = 0;
    for (size_t i = 0; i < n; i++) t[j++] = (char)tolower((unsigned char)raw[i]);
    t[j] = 0;
    char *s = t;
    if (s[0] == '{' && j > 2 && s[j - 1] == '}') { s[j - 1] = 0; s++; }
    while (*s == ' ') s++;
    size_t L = strlen(s);
    while (L && s[L - 1] == ' ') s[--L] = 0;
    if (L == 1) {
        unsigned char c = (unsigned char)s[0];
        if (isalnum(c)) return (KeySym)c;              /* XK_a.. / XK_0.. */
        switch (c) {
        case ' ': return XK_space; case '+': case '=': return XK_equal; case '-': return XK_minus;
        case ',': return XK_comma; case '.': return XK_period; case '/': return XK_slash;
        case ';': return XK_semicolon; case '[': return XK_bracketleft; case ']': return XK_bracketright;
        case '\\': return XK_backslash; case '\'': return XK_apostrophe; case '`': return XK_grave;
        }
        return NoSymbol;
    }
    static const struct { const char *n; KeySym k; } T[] = {
        {"enter", XK_Return}, {"return", XK_Return}, {"tab", XK_Tab}, {"esc", XK_Escape}, {"escape", XK_Escape},
        {"space", XK_space}, {"spacebar", XK_space}, {"backspace", XK_BackSpace}, {"back", XK_BackSpace},
        {"bksp", XK_BackSpace}, {"bs", XK_BackSpace}, {"delete", XK_Delete}, {"del", XK_Delete},
        {"insert", XK_Insert}, {"ins", XK_Insert}, {"home", XK_Home}, {"end", XK_End},
        {"pageup", XK_Prior}, {"pgup", XK_Prior}, {"pagedown", XK_Next}, {"pgdn", XK_Next},
        {"up", XK_Up}, {"down", XK_Down}, {"left", XK_Left}, {"right", XK_Right},
        {"capslock", XK_Caps_Lock}, {"numlock", XK_Num_Lock}, {"scrolllock", XK_Scroll_Lock},
        {"printscreen", XK_Print}, {"prtsc", XK_Print}, {"pause", XK_Pause}, {"break", XK_Pause},
        {"apps", XK_Menu}, {"contextmenu", XK_Menu}, {"menukey", XK_Menu},
        {"plus", XK_equal}, {"minus", XK_minus},
        {"ctrl", XK_Control_L}, {"control", XK_Control_L}, {"lctrl", XK_Control_L}, {"rctrl", XK_Control_R},
        {"shift", XK_Shift_L}, {"lshift", XK_Shift_L}, {"rshift", XK_Shift_R},
        {"alt", XK_Alt_L}, {"lalt", XK_Alt_L}, {"ralt", XK_Alt_R}, {"menu", XK_Alt_L},
        {"win", XK_Super_L}, {"windows", XK_Super_L}, {"lwin", XK_Super_L}, {"rwin", XK_Super_R},
        {"super", XK_Super_L}, {"meta", XK_Super_L},
    };
    for (size_t i = 0; i < sizeof T / sizeof T[0]; i++) if (!strcmp(s, T[i].n)) return T[i].k;
    if (s[0] == 'f' && L <= 3) {
        int fn = atoi(s + 1);
        if (fn >= 1 && fn <= 24) return XK_F1 + (KeySym)(fn - 1);
    }
    return NoSymbol;
}
/* Modifier keysym for a chord token, or NoSymbol. cmd/command map to Ctrl,
 * option to Alt: models trained on macOS shortcuts mean the same action. */
static KeySym modifier_keysym(const char *t) {
    static const struct { const char *n; KeySym k; } M[] = {
        {"ctrl", XK_Control_L}, {"control", XK_Control_L}, {"lctrl", XK_Control_L}, {"cmd", XK_Control_L},
        {"command", XK_Control_L}, {"rctrl", XK_Control_R}, {"shift", XK_Shift_L}, {"lshift", XK_Shift_L},
        {"rshift", XK_Shift_R}, {"alt", XK_Alt_L}, {"lalt", XK_Alt_L}, {"option", XK_Alt_L}, {"opt", XK_Alt_L},
        {"ralt", XK_Alt_R}, {"altgr", XK_ISO_Level3_Shift}, {"win", XK_Super_L}, {"windows", XK_Super_L},
        {"lwin", XK_Super_L}, {"rwin", XK_Super_R}, {"meta", XK_Super_L}, {"super", XK_Super_L},
    };
    char b[32]; size_t j = 0;
    for (; *t == ' '; t++) {}
    for (; *t && j < sizeof b - 1; t++) b[j++] = (char)tolower((unsigned char)*t);
    while (j && b[j - 1] == ' ') j--;
    b[j] = 0;
    for (size_t i = 0; i < sizeof M / sizeof M[0]; i++) if (!strcmp(b, M[i].n)) return M[i].k;
    return NoSymbol;
}

static void key_event(KeySym ks, int down) {
    KeyCode kc = XKeysymToKeycode(dpy, ks);
    if (!kc) return;
    XTestFakeKeyEvent(dpy, kc, down ? True : False, CurrentTime);
    XSync(dpy, False);
}

/* Type one Unicode code point. Uses the existing keymap when the symbol is on
 * a key (with Shift if needed); otherwise borrows an unused keycode for it. */
static KeyCode scratch = 0;
static KeyCode find_scratch(void) {
    int minkc, maxkc, per;
    XDisplayKeycodes(dpy, &minkc, &maxkc);
    KeySym *map = XGetKeyboardMapping(dpy, (KeyCode)minkc, maxkc - minkc + 1, &per);
    KeyCode found = 0;
    for (int kc = maxkc; kc >= minkc && !found; kc--) {
        int empty = 1;
        for (int i = 0; i < per; i++) if (map[(kc - minkc) * per + i] != NoSymbol) { empty = 0; break; }
        if (empty) found = (KeyCode)kc;
    }
    XFree(map);
    return found;
}
static int type_codepoint(uint32_t cp) {
    if (cp == '\n' || cp == '\r') { key_event(XK_Return, 1); key_event(XK_Return, 0); return 1; }
    if (cp == '\t') { key_event(XK_Tab, 1); key_event(XK_Tab, 0); return 1; }
    KeySym ks = (cp >= 0x20 && cp <= 0x7e) || (cp >= 0xa0 && cp <= 0xff) ? (KeySym)cp : (KeySym)(0x01000000u | cp);
    KeyCode kc = XKeysymToKeycode(dpy, ks);
    if (kc) {
        int shift = -1;
        if (XkbKeycodeToKeysym(dpy, kc, 0, 0) == ks) shift = 0;
        else if (XkbKeycodeToKeysym(dpy, kc, 0, 1) == ks) shift = 1;
        if (shift >= 0) {
            if (shift) key_event(XK_Shift_L, 1);
            XTestFakeKeyEvent(dpy, kc, True, CurrentTime);
            XTestFakeKeyEvent(dpy, kc, False, CurrentTime);
            if (shift) key_event(XK_Shift_L, 0);
            XSync(dpy, False);
            msleep(2);
            return 1;
        }
    }
    if (!scratch) scratch = find_scratch();
    if (!scratch) return 0;
    KeySym syms[2] = { ks, ks };
    XChangeKeyboardMapping(dpy, scratch, 2, syms, 1);
    XSync(dpy, False);
    msleep(15);                       /* let clients see the new mapping */
    XTestFakeKeyEvent(dpy, scratch, True, CurrentTime);
    XTestFakeKeyEvent(dpy, scratch, False, CurrentTime);
    XSync(dpy, False);
    msleep(15);
    KeySym none[2] = { NoSymbol, NoSymbol };
    XChangeKeyboardMapping(dpy, scratch, 2, none, 1);
    XSync(dpy, False);
    return 1;
}
/* UTF-8 -> code points; returns count typed (UTF-16 units, like Windows). */
static int type_utf8(const unsigned char *s, size_t n, int *total_units) {
    int typed = 0; *total_units = 0;
    for (size_t i = 0; i < n;) {
        uint32_t cp; int len;
        unsigned char c = s[i];
        if (c < 0x80) { cp = c; len = 1; }
        else if ((c >> 5) == 6 && i + 1 < n) { cp = ((c & 0x1fu) << 6) | (s[i + 1] & 0x3fu); len = 2; }
        else if ((c >> 4) == 14 && i + 2 < n) { cp = ((c & 0x0fu) << 12) | ((s[i + 1] & 0x3fu) << 6) | (s[i + 2] & 0x3fu); len = 3; }
        else if ((c >> 3) == 30 && i + 3 < n) { cp = ((c & 0x07u) << 18) | ((s[i + 1] & 0x3fu) << 12) | ((s[i + 2] & 0x3fu) << 6) | (s[i + 3] & 0x3fu); len = 4; }
        else { i++; continue; }
        i += (size_t)len;
        if (cp == '\r' && i < n && s[i] == '\n') continue;   /* CRLF -> one Enter */
        int units = cp > 0xffff ? 2 : 1;
        *total_units += units;
        if (type_codepoint(cp)) typed += units;
    }
    return typed;
}
static size_t b64decode(const char *in, unsigned char *out, size_t cap) {
    static int T[256]; static int init = 0;
    if (!init) {
        for (int i = 0; i < 256; i++) T[i] = -1;
        const char *a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (int i = 0; i < 64; i++) T[(unsigned char)a[i]] = i;
        init = 1;
    }
    size_t o = 0; int val = 0, bits = -8;
    for (const unsigned char *p = (const unsigned char *)in; *p; p++) {
        if (T[*p] < 0) continue;
        val = (val << 6) | T[*p]; bits += 6;
        if (bits >= 0) { if (o < cap) out[o++] = (unsigned char)((val >> bits) & 0xff); bits -= 8; }
    }
    return o;
}

/* Same grammar as the Windows helper's ParseChord: "ctrl+s", "Ctrl + Shift + K",
 * "cmd+c", "^s", "^space", "^{SPACE}", "%{F4}", "+{TAB}", "enter", "{ENTER}".
 * A single non-alphanumeric character is typed as that character.
 * Returns 0 = invalid (nothing sent), 1 = chord, 2 = literal character. */
static int parse_chord(const char *spec, KeySym *mods, int *nmods, KeySym *key, uint32_t *literal, char *err, size_t errlen) {
    *nmods = 0; *key = NoSymbol; *literal = 0;
    char s[128];
    snprintf(s, sizeof s, "%s", spec);
    size_t L = strlen(s);
    if (L == 0) { snprintf(err, errlen, "empty key"); return 0; }
    /* trim */
    char *b = s; while (*b == ' ' && b[1]) b++;
    L = strlen(b); while (L > 1 && b[L - 1] == ' ') b[--L] = 0;
    if (L == 1) {
        unsigned char c = (unsigned char)b[0];
        if (c == ' ') { *key = XK_space; return 1; }
        if (isalnum(c)) { *key = (KeySym)tolower(c); return 1; }
        *literal = c; return 2;
    }
    /* "mod+mod+key" */
    char *plus = strchr(b, '+');
    if (plus && plus != b) {
        char first[32]; size_t fl = (size_t)(plus - b);
        if (fl < sizeof first) {
            memcpy(first, b, fl); first[fl] = 0;
            if (modifier_keysym(first) != NoSymbol) {
                char *rest = b;
                for (;;) {
                    char *p = strchr(rest, '+');
                    if (!p || p == rest) break;
                    char tok[32]; size_t tl = (size_t)(p - rest);
                    if (tl >= sizeof tok) break;
                    memcpy(tok, rest, tl); tok[tl] = 0;
                    KeySym m = modifier_keysym(tok);
                    if (m == NoSymbol) break;
                    int dup = 0;
                    for (int i = 0; i < *nmods; i++) if (mods[i] == m) dup = 1;
                    if (!dup && *nmods < 6) mods[(*nmods)++] = m;
                    rest = p + 1;
                }
                char last[64]; snprintf(last, sizeof last, "%s", rest);
                char *lt = last; while (*lt == ' ') lt++;
                size_t ll = strlen(lt); while (ll && lt[ll - 1] == ' ') lt[--ll] = 0;
                if (ll == 0 && L >= 2 && b[L - 1] == '+' && b[L - 2] == '+') { lt = "+"; ll = 1; }
                if (ll == 0) { snprintf(err, errlen, "shortcut has no key after the modifiers"); *nmods = 0; return 0; }
                KeySym k = modifier_keysym(lt);
                if (k == NoSymbol) k = name_to_keysym(lt);
                if (k == NoSymbol) { snprintf(err, errlen, "unknown key '%s'", lt); *nmods = 0; return 0; }
                *key = k; return 1;
            }
        }
    }
    /* SendKeys prefixes ^ % + */
    size_t p = 0;
    while (p < L - 1 && (b[p] == '^' || b[p] == '%' || b[p] == '+')) {
        KeySym m = b[p] == '^' ? XK_Control_L : b[p] == '%' ? XK_Alt_L : XK_Shift_L;
        int dup = 0;
        for (int i = 0; i < *nmods; i++) if (mods[i] == m) dup = 1;
        if (!dup) mods[(*nmods)++] = m;
        p++;
    }
    const char *kp = b + p;
    size_t kl = strlen(kp);
    if (kl == 3 && kp[0] == '{' && kp[2] == '}' && !isalnum((unsigned char)kp[1])) {
        if (*nmods == 0) { *literal = (unsigned char)kp[1]; return 2; }
        char one[2] = { kp[1], 0 };
        *key = name_to_keysym(one);
    } else {
        *key = name_to_keysym(kp);
    }
    if (*key == NoSymbol) { snprintf(err, errlen, "unknown key '%s'", kp); *nmods = 0; return 0; }
    return 1;
}
static void send_chord(KeySym *mods, int nmods, KeySym key) {
    for (int i = 0; i < nmods; i++) { key_event(mods[i], 1); msleep(10); }
    key_event(key, 1); msleep(10); key_event(key, 0);
    for (int i = nmods - 1; i >= 0; i--) { msleep(10); key_event(mods[i], 0); }
}
static int release_all(void) {
    static const KeySym held[] = { XK_Control_L, XK_Control_R, XK_Shift_L, XK_Shift_R, XK_Alt_L, XK_Alt_R,
                                   XK_Super_L, XK_Super_R, XK_ISO_Level3_Shift };
    char keys[32]; int n = 0;
    XQueryKeymap(dpy, keys);
    for (size_t i = 0; i < sizeof held / sizeof held[0]; i++) {
        KeyCode kc = XKeysymToKeycode(dpy, held[i]);
        if (kc && (keys[kc / 8] & (1 << (kc % 8)))) { XTestFakeKeyEvent(dpy, kc, False, CurrentTime); n++; }
    }
    int x, y; unsigned m = 0;
    get_pos(&x, &y, &m);
    if (m & Button1Mask) { button(1, 0); n++; }
    if (m & Button2Mask) { button(2, 0); n++; }
    if (m & Button3Mask) { button(3, 0); n++; }
    XSync(dpy, False);
    return n;
}

static int is_input_cmd(const char *c) {
    static const char *L[] = { "clickat", "click", "doubleclick", "mousedown", "drag", "scroll", "typeunicode",
                               "presskey", "keydown", "submit", NULL };
    for (int i = 0; L[i]; i++) if (!strcmp(c, L[i])) return 1;
    return 0;
}

int main(int argc, char **argv) {
    if (argc < 2) {
        puts("USAGE: orion-input-x11 <status|getpos|setpos|click|clickat|doubleclick|mousedown|mouseup|drag|scroll|"
             "typeunicode|presskey|keydown|keyup|submit|releaseall|foreground> [args]");
        return 0;
    }
    char cmd[32]; snprintf(cmd, sizeof cmd, "%s", argv[1]);
    for (char *p = cmd; *p; p++) *p = (char)tolower((unsigned char)*p);

    dpy = XOpenDisplay(NULL);
    if (!dpy) { printf("STATUS:NON_INTERACTIVE|DESKTOP:NONE|ERR:cannot open X display '%s'\n", getenv("DISPLAY") ? getenv("DISPLAY") : ""); return 1; }
    root = DefaultRootWindow(dpy);
    int ev, er, maj, min;
    if (!XTestQueryExtension(dpy, &ev, &er, &maj, &min)) { puts("ERR_UNAVAILABLE:XTest extension missing on this X server"); return 1; }

    char fg[512];
    const char *expect = getenv("ORION_EXPECT_HWND");
    if (expect && *expect && strcmp(expect, "0") && is_input_cmd(cmd)) {
        unsigned long want = strtoul(expect, NULL, 10);
        Window w = active_window();
        if ((unsigned long)w != want) {
            foreground_info(fg, sizeof fg);
            printf("FOCUS_CHANGED:the window in front is no longer the one ORION was working in; nothing was sent|EXPECTED:%lu|%s\n", want, fg);
            return 13;
        }
    }

    int code = 0;
    if (!strcmp(cmd, "status")) {
        const char *st = getenv("XDG_SESSION_TYPE"), *wl = getenv("WAYLAND_DISPLAY");
        int wayland = (st && !strcmp(st, "wayland")) || (wl && *wl);
        int sw = DisplayWidth(dpy, DefaultScreen(dpy)), sh = DisplayHeight(dpy, DefaultScreen(dpy));
        printf("STATUS:%s|DESKTOP:X11|DISPLAY:%s|SCREEN:%dx%d|XTEST:%d.%d%s\n", wayland ? "LIMITED" : "INTERACTIVE",
               DisplayString(dpy), sw, sh, maj, min,
               wayland ? "|SESSION:wayland (input only reaches XWayland apps)" : "|SESSION:x11");
    } else if (!strcmp(cmd, "getpos")) {
        int x, y;
        if (get_pos(&x, &y, NULL)) printf("POS:%d,%d\n", x, y); else { puts("ERR_UNAVAILABLE:XQueryPointer failed"); code = 1; }
    } else if (!strcmp(cmd, "setpos")) {
        if (argc < 4) { puts("ERR_INVALID_ARGS: setpos requires <x> <y>"); code = 2; }
        else {
            int x = atoi(argv[2]), y = atoi(argv[3]), cx, cy;
            int ok = move_abs(x, y); get_pos(&cx, &cy, NULL);
            if (ok) printf("SET_OK:%d,%d\n", cx, cy); else printf("SET_UNVERIFIED:%d,%d|ACTUAL:%d,%d\n", x, y, cx, cy);
        }
    } else if (!strcmp(cmd, "click")) {
        int b = button_num(argc > 2 ? argv[2] : "left");
        click_at_current(b); printf("CLICK_OK:%s\n", button_name(b));
    } else if (!strcmp(cmd, "clickat")) {
        if (argc < 4) { puts("ERR_INVALID_ARGS: clickat requires <x> <y> [button] [double]"); code = 2; }
        else {
            int x = atoi(argv[2]), y = atoi(argv[3]), b = button_num(argc > 4 ? argv[4] : "left");
            int dbl = argc > 5 && !strcasecmp(argv[5], "double");
            if (!move_abs(x, y)) { int cx, cy; get_pos(&cx, &cy, NULL); printf("CLICKAT_FAILED:cursor not at target|ACTUAL:%d,%d\n", cx, cy); code = 3; }
            else {
                msleep(30); click_at_current(b);
                if (dbl) { msleep(60); click_at_current(b); }
                int cx, cy; get_pos(&cx, &cy, NULL); foreground_info(fg, sizeof fg);
                printf("CLICKAT_OK:%d,%d|BUTTON:%s%s|%s\n", cx, cy, button_name(b), dbl ? "|DOUBLE" : "", fg);
            }
        }
    } else if (!strcmp(cmd, "doubleclick")) {
        click_at_current(1); msleep(50); click_at_current(1); puts("DOUBLECLICK_OK:left");
    } else if (!strcmp(cmd, "mousedown") || !strcmp(cmd, "mouseup")) {
        int b = button_num(argc > 2 ? argv[2] : "left"), down = !strcmp(cmd, "mousedown");
        button(b, down); printf("%s%s\n", down ? "MOUSEDOWN_OK:" : "MOUSEUP_OK:", button_name(b));
    } else if (!strcmp(cmd, "drag")) {
        if (argc < 6) { puts("ERR_INVALID_ARGS: drag requires <x1> <y1> <x2> <y2> [button]"); code = 2; }
        else {
            int x1 = atoi(argv[2]), y1 = atoi(argv[3]), x2 = atoi(argv[4]), y2 = atoi(argv[5]);
            int b = button_num(argc > 6 ? argv[6] : "left");
            if (!move_abs(x1, y1)) { int cx, cy; get_pos(&cx, &cy, NULL); printf("DRAG_FAILED:cursor not at start|ACTUAL:%d,%d\n", cx, cy); code = 3; }
            else {
                msleep(30); button(b, 1);
                int dx = x2 - x1, dy = y2 - y1;
                int dist = abs(dx) > abs(dy) ? abs(dx) : abs(dy);
                int steps = dist / 20; if (steps < 4) steps = 4; if (steps > 25) steps = 25;
                for (int i = 1; i <= steps; i++) { move_abs(x1 + dx * i / steps, y1 + dy * i / steps); msleep(12); }
                msleep(30); button(b, 0);
                int cx, cy; get_pos(&cx, &cy, NULL);
                int ok = abs(cx - x2) <= 2 && abs(cy - y2) <= 2;
                printf("%s%d,%d|FROM:%d,%d|BUTTON:%s\n", ok ? "DRAG_OK:" : "DRAG_UNVERIFIED:", cx, cy, x1, y1, button_name(b));
                if (!ok) code = 3;
            }
        }
    } else if (!strcmp(cmd, "scroll")) {
        int n = argc > 2 ? atoi(argv[2]) : -3;
        int b = n > 0 ? 4 : 5;                 /* 4 = wheel up, 5 = wheel down */
        for (int i = 0; i < abs(n); i++) { button(b, 1); button(b, 0); msleep(10); }
        printf("SCROLL_OK:%d\n", n);
    } else if (!strcmp(cmd, "typeunicode")) {
        if (argc < 3) { puts("ERR_INVALID_ARGS: typeunicode requires <base64>"); code = 2; }
        else {
            size_t cap = strlen(argv[2]) + 4;
            unsigned char *buf = malloc(cap);
            size_t n = b64decode(argv[2], buf, cap);
            int total = 0, typed = type_utf8(buf, n, &total);
            free(buf);
            foreground_info(fg, sizeof fg);
            if (typed == total) printf("TYPEUNICODE_OK:%d|%s\n", typed, fg);
            else { printf("TYPEUNICODE_PARTIAL:%d/%d|%s\n", typed, total, fg); code = 6; }
        }
    } else if (!strcmp(cmd, "submit")) {
        key_event(XK_Return, 1); key_event(XK_Return, 0); foreground_info(fg, sizeof fg); printf("SUBMIT_OK:enter|%s\n", fg);
    } else if (!strcmp(cmd, "presskey")) {
        if (argc < 3) { puts("ERR_INVALID_ARGS: presskey requires <key>"); code = 2; }
        else {
            KeySym mods[6], key; int nm; uint32_t lit; char err[128] = "";
            int r = parse_chord(argv[2], mods, &nm, &key, &lit, err, sizeof err);
            if (r == 0) { printf("ERR_INVALID_KEY:%s|%s\n", argv[2], err); code = 2; }
            else if (r == 2) { type_codepoint(lit); printf("KEY_OK:%s|CHAR\n", argv[2]); }
            else {
                send_chord(mods, nm, key);
                printf("KEY_OK:%s|KEYSYM:0x%lx|MODS:", argv[2], (unsigned long)key);
                for (int i = 0; i < nm; i++) printf("%s0x%lx", i ? "," : "", (unsigned long)mods[i]);
                puts("");
            }
        }
    } else if (!strcmp(cmd, "keydown") || !strcmp(cmd, "keyup")) {
        int down = !strcmp(cmd, "keydown");
        KeySym k = argc > 2 ? modifier_keysym(argv[2]) : NoSymbol;
        if (k == NoSymbol && argc > 2) k = name_to_keysym(argv[2]);
        if (k == NoSymbol) { printf("ERR_INVALID_KEY:%s\n", argc > 2 ? argv[2] : ""); code = 2; }
        else { key_event(k, down); printf("%s%s\n", down ? "KEYDOWN_OK:" : "KEYUP_OK:", argv[2]); }
    } else if (!strcmp(cmd, "releaseall")) {
        printf("RELEASEALL_OK:%d\n", release_all());
    } else if (!strcmp(cmd, "foreground")) {
        foreground_info(fg, sizeof fg); printf("FOREGROUND:%s|UIPI_BLOCKED:False\n", fg);
    } else {
        printf("ERR_UNKNOWN_CMD:%s\n", cmd); code = 4;
    }
    XSync(dpy, False);
    XCloseDisplay(dpy);
    return code;
}
