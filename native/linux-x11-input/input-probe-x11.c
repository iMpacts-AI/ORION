/*
 * input-probe-x11 <logfile> [x y w h]
 * X11 test window for ORION's input helper. Logs every event it receives in
 * the same format as the Windows probe (native/input-probe), so
 * tests/input/helper-e2e.mjs runs unchanged against both:
 *   READY|HWND:<id>|X:|Y:|W:|H:    KEYDOWN|<name>|CTRL:|SHIFT:|ALT:   KEYUP|<name>
 *   CHAR|U+XXXX|<c>                MOUSEDOWN|Left|x,y   MOUSEUP|Left|x,y
 *   DOUBLECLICK|Left|x,y           WHEEL|<delta>|x,y    DRAG|x1,y1->x2,y2
 * Key names follow .NET's Keys enum (A, D1, Return, Back, PageUp, Next, ...).
 * Build: cc -O2 -o input-probe-x11 input-probe-x11.c -lX11
 * Made by iMpact Team.
 */
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/keysym.h>
#include <locale.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/time.h>

static FILE *logf;
static void W(const char *fmt, ...) __attribute__((format(printf, 1, 2)));
#include <stdarg.h>
static void W(const char *fmt, ...) {
    va_list ap; va_start(ap, fmt); vfprintf(logf, fmt, ap); va_end(ap);
    fputc('\n', logf); fflush(logf);
}
static long now_ms(void) { struct timeval t; gettimeofday(&t, NULL); return t.tv_sec * 1000L + t.tv_usec / 1000; }

static const char *key_name(KeySym k, char *buf) {
    if (k >= XK_a && k <= XK_z) { buf[0] = (char)('A' + (k - XK_a)); buf[1] = 0; return buf; }
    if (k >= XK_A && k <= XK_Z) { buf[0] = (char)k; buf[1] = 0; return buf; }
    if (k >= XK_0 && k <= XK_9) { sprintf(buf, "D%c", (char)k); return buf; }
    if (k >= XK_F1 && k <= XK_F24) { sprintf(buf, "F%lu", (unsigned long)(k - XK_F1 + 1)); return buf; }
    switch (k) {
    case XK_Return: return "Return"; case XK_Tab: case XK_ISO_Left_Tab: return "Tab"; case XK_Escape: return "Escape";
    case XK_BackSpace: return "Back"; case XK_Delete: return "Delete"; case XK_Insert: return "Insert";
    case XK_Home: return "Home"; case XK_End: return "End"; case XK_Prior: return "PageUp"; case XK_Next: return "Next";
    case XK_Up: return "Up"; case XK_Down: return "Down"; case XK_Left: return "Left"; case XK_Right: return "Right";
    case XK_space: return "Space"; case XK_equal: case XK_plus: return "Oemplus"; case XK_minus: return "OemMinus";
    case XK_Control_L: case XK_Control_R: return "ControlKey"; case XK_Shift_L: case XK_Shift_R: return "ShiftKey";
    case XK_Alt_L: case XK_Alt_R: return "Menu"; case XK_Super_L: case XK_Super_R: return "LWin";
    }
    sprintf(buf, "Keysym0x%lx", (unsigned long)k); return buf;
}
static const char *btn(unsigned b) { return b == 1 ? "Left" : b == 2 ? "Middle" : b == 3 ? "Right" : "Other"; }
static const char *tf(int v) { return v ? "True" : "False"; }

static void log_chars(const char *s, int n) {
    /* UTF-8 -> UTF-16 units, one CHAR line each (same as WinForms KeyPress) */
    for (int i = 0; i < n;) {
        unsigned char c = (unsigned char)s[i]; unsigned cp; int len;
        if (c < 0x80) { cp = c; len = 1; }
        else if ((c >> 5) == 6) { cp = ((c & 0x1fu) << 6) | (s[i + 1] & 0x3fu); len = 2; }
        else if ((c >> 4) == 14) { cp = ((c & 0x0fu) << 12) | ((s[i + 1] & 0x3fu) << 6) | (s[i + 2] & 0x3fu); len = 3; }
        else { cp = ((c & 0x07u) << 18) | ((s[i + 1] & 0x3fu) << 12) | ((s[i + 2] & 0x3fu) << 6) | (s[i + 3] & 0x3fu); len = 4; }
        if (cp > 0xffff) {
            unsigned v = cp - 0x10000;
            W("CHAR|U+%04X|", 0xd800 + (v >> 10));
            W("CHAR|U+%04X|", 0xdc00 + (v & 0x3ff));
        } else if (cp < 0x20 || cp == 0x7f) {
            W("CHAR|U+%04X|", cp);
        } else {
            W("CHAR|U+%04X|%.*s", cp, len, s + i);
        }
        i += len;
    }
}

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: input-probe-x11 <logfile> [x y w h]\n"); return 2; }
    setlocale(LC_ALL, "");
    if (!XSupportsLocale()) setlocale(LC_ALL, "C.UTF-8");
    XSetLocaleModifiers("");
    logf = fopen(argv[1], "a");
    if (!logf) { perror("log"); return 1; }
    int X = 100, Y = 100, Wd = 800, H = 500;
    if (argc >= 6) { X = atoi(argv[2]); Y = atoi(argv[3]); Wd = atoi(argv[4]); H = atoi(argv[5]); }

    Display *d = XOpenDisplay(NULL);
    if (!d) { fprintf(stderr, "cannot open display\n"); return 1; }
    int scr = DefaultScreen(d);
    XSetWindowAttributes a; memset(&a, 0, sizeof a);
    a.background_pixel = WhitePixel(d, scr);
    a.event_mask = KeyPressMask | KeyReleaseMask | ButtonPressMask | ButtonReleaseMask | PointerMotionMask |
                   ButtonMotionMask | StructureNotifyMask | FocusChangeMask | ExposureMask;
    Window w = XCreateWindow(d, RootWindow(d, scr), X, Y, (unsigned)Wd, (unsigned)H, 0, CopyFromParent, InputOutput,
                             CopyFromParent, CWBackPixel | CWEventMask, &a);
    XStoreName(d, w, "ORION Input Probe");
    XSizeHints sh; memset(&sh, 0, sizeof sh);
    sh.flags = PPosition | USPosition | PSize; sh.x = X; sh.y = Y; sh.width = Wd; sh.height = H;
    XSetWMNormalHints(d, w, &sh);
    XMapRaised(d, w);

    XIM im = XOpenIM(d, NULL, NULL, NULL);
    XIC ic = im ? XCreateIC(im, XNInputStyle, XIMPreeditNothing | XIMStatusNothing, XNClientWindow, w, XNFocusWindow, w, NULL) : NULL;

    int ready = 0, down = 0, moved = 0, dx0 = 0, dy0 = 0;
    long last_t = 0; unsigned last_b = 0; int last_x = -1000, last_y = -1000;
    for (;;) {
        XEvent e; XNextEvent(d, &e);
        if (XFilterEvent(&e, None)) continue;
        switch (e.type) {
        case MapNotify:
        case Expose:
            if (!ready) {
                XSetInputFocus(d, w, RevertToParent, CurrentTime);
                XSync(d, False);
                Window child; int ox, oy;
                XTranslateCoordinates(d, w, RootWindow(d, scr), 0, 0, &ox, &oy, &child);
                W("READY|HWND:%lu|X:%d|Y:%d|W:%d|H:%d", (unsigned long)w, ox, oy, Wd, H);
                ready = 1;
            }
            break;
        case KeyPress: {
            KeySym ks = XLookupKeysym(&e.xkey, 0);
            char nb[32];
            unsigned st = e.xkey.state;
            int isCtrl = ks == XK_Control_L || ks == XK_Control_R, isShift = ks == XK_Shift_L || ks == XK_Shift_R;
            W("KEYDOWN|%s|CTRL:%s|SHIFT:%s|ALT:%s", key_name(ks, nb), tf((st & ControlMask) || isCtrl),
              tf((st & ShiftMask) || isShift), tf(st & Mod1Mask));
            char buf[64]; KeySym out; Status s; int n;
            if (ic) n = Xutf8LookupString(ic, &e.xkey, buf, sizeof buf, &out, &s);
            else n = XLookupString(&e.xkey, buf, sizeof buf, &out, NULL);
            /* Windows sends no printable character for Ctrl+<key> (only control
             * codes for Ctrl+letter); X11 hands apps both. Follow Windows. */
            if (n > 0 && (st & ControlMask) && (unsigned char)buf[0] >= 0x20) n = 0;
            if (n > 0) log_chars(buf, n);
            break;
        }
        case KeyRelease: {
            /* skip auto-repeat pairs */
            if (XEventsQueued(d, QueuedAfterReading)) {
                XEvent nx; XPeekEvent(d, &nx);
                if (nx.type == KeyPress && nx.xkey.time == e.xkey.time && nx.xkey.keycode == e.xkey.keycode) break;
            }
            char nb[32];
            W("KEYUP|%s", key_name(XLookupKeysym(&e.xkey, 0), nb));
            break;
        }
        case ButtonPress: {
            unsigned b = e.xbutton.button; int x = e.xbutton.x_root, y = e.xbutton.y_root;
            if (b == 4 || b == 5) { W("WHEEL|%d|%d,%d", b == 4 ? 120 : -120, x, y); break; }
            if (b > 5) break;
            W("MOUSEDOWN|%s|%d,%d", btn(b), x, y);
            long t = now_ms();
            if (b == last_b && t - last_t < 500 && abs(x - last_x) <= 4 && abs(y - last_y) <= 4) {
                W("DOUBLECLICK|%s|%d,%d", btn(b), x, y); last_t = 0;
            } else { last_t = t; last_b = b; last_x = x; last_y = y; }
            if (b == 1) { down = 1; moved = 0; dx0 = x; dy0 = y; }
            break;
        }
        case MotionNotify:
            if (down && (e.xmotion.state & Button1Mask)) moved = 1;
            break;
        case ButtonRelease: {
            unsigned b = e.xbutton.button; int x = e.xbutton.x_root, y = e.xbutton.y_root;
            if (b >= 4) break;
            W("MOUSEUP|%s|%d,%d", btn(b), x, y);
            if (b == 1 && down && moved && (x != dx0 || y != dy0)) W("DRAG|%d,%d->%d,%d", dx0, dy0, x, y);
            if (b == 1) down = 0;
            break;
        }
        case FocusIn:
            if (ic) XSetICFocus(ic);
            break;
        }
    }
}
