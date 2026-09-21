using System;
using System.Text;
using System.Threading;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace Orion.Platform.Win32 {
    [StructLayout(LayoutKind.Sequential)]
    public struct POINT {
        public int X;
        public int Y;
    }

    public static class NativeInputEntry {
        [DllImport("user32.dll", SetLastError = true)]
        public static extern IntPtr OpenInputDesktop(uint dwFlags, bool fInherit, uint dwDesiredAccess);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool SetThreadDesktop(IntPtr hDesktop);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool CloseDesktop(IntPtr hDesktop);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool GetCursorPos(out POINT lpPoint);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool SetCursorPos(int X, int Y);

        [DllImport("user32.dll")]
        public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool GetUserObjectInformation(IntPtr hObj, int nIndex, StringBuilder pvInfo, int nLength, out int lpnLengthNeeded);

        public const uint DESKTOP_ALL = 0x01FF;
        public const int UOI_NAME = 2;

        public const uint MOUSEEVENTF_LEFTDOWN   = 0x0002;
        public const uint MOUSEEVENTF_LEFTUP     = 0x0004;
        public const uint MOUSEEVENTF_RIGHTDOWN  = 0x0008;
        public const uint MOUSEEVENTF_RIGHTUP    = 0x0010;
        public const uint MOUSEEVENTF_MIDDLEDOWN = 0x0020;
        public const uint MOUSEEVENTF_MIDDLEUP   = 0x0040;
        public const uint MOUSEEVENTF_WHEEL      = 0x0800;

        public static int Main(string[] args) {
            if (args.Length == 0) {
                Console.WriteLine("USAGE: win32-native-input <status|getpos|setpos|click|doubleclick|scroll|type|presskey> [args]");
                return 0;
            }

            string command = args[0].ToLowerInvariant();
            IntPtr hInput = OpenInputDesktop(0, false, DESKTOP_ALL);
            bool hasInputDesktop = (hInput != IntPtr.Zero);
            int exitCode = 0;

            Thread worker = new Thread(() => {
                bool attached = false;
                if (hasInputDesktop) {
                    attached = SetThreadDesktop(hInput);
                }

                switch (command) {
                    case "status": {
                        StringBuilder sb = new StringBuilder(256);
                        int needed = 0;
                        if (hasInputDesktop) {
                            GetUserObjectInformation(hInput, UOI_NAME, sb, 256, out needed);
                            Console.WriteLine("STATUS:INTERACTIVE|DESKTOP:" + sb.ToString() + "|ATTACHED:" + attached);
                        } else {
                            Console.WriteLine("STATUS:NON_INTERACTIVE|DESKTOP:NONE|ATTACHED:FALSE");
                        }
                        break;
                    }

                    case "getpos": {
                        POINT pt = new POINT();
                        bool success = GetCursorPos(out pt);
                        if (success) {
                            Console.WriteLine("POS:" + pt.X + "," + pt.Y);
                        } else {
                            int err = Marshal.GetLastWin32Error();
                            Console.WriteLine("ERR_UNAVAILABLE:GetCursorPos failed (Win32 Error: " + err + ")");
                            exitCode = 1;
                        }
                        break;
                    }

                    case "setpos": {
                        if (args.Length < 3) {
                            Console.WriteLine("ERR_INVALID_ARGS: setpos requires <x> <y>");
                            exitCode = 2;
                            return;
                        }
                        int targetX = int.Parse(args[1]);
                        int targetY = int.Parse(args[2]);
                        bool setOk = SetCursorPos(targetX, targetY);
                        POINT pt = new POINT();
                        bool getOk = GetCursorPos(out pt);
                        if (setOk && getOk) {
                            Console.WriteLine("SET_OK:" + pt.X + "," + pt.Y);
                        } else if (setOk) {
                            Console.WriteLine("SET_UNVERIFIED:" + targetX + "," + targetY);
                        } else {
                            int err = Marshal.GetLastWin32Error();
                            Console.WriteLine("SET_FAILED:" + targetX + "," + targetY + "|ERR:" + err);
                            exitCode = 3;
                        }
                        break;
                    }

                    case "click": {
                        string button = args.Length > 1 ? args[1].ToLowerInvariant() : "left";
                        uint downFlag = MOUSEEVENTF_LEFTDOWN;
                        uint upFlag = MOUSEEVENTF_LEFTUP;
                        if (button == "right") {
                            downFlag = MOUSEEVENTF_RIGHTDOWN;
                            upFlag = MOUSEEVENTF_RIGHTUP;
                        } else if (button == "middle") {
                            downFlag = MOUSEEVENTF_MIDDLEDOWN;
                            upFlag = MOUSEEVENTF_MIDDLEUP;
                        }
                        mouse_event(downFlag, 0, 0, 0, 0);
                        Thread.Sleep(25);
                        mouse_event(upFlag, 0, 0, 0, 0);
                        Console.WriteLine("CLICK_OK:" + button);
                        break;
                    }

                    case "doubleclick": {
                        mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
                        Thread.Sleep(20);
                        mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
                        Thread.Sleep(50);
                        mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
                        Thread.Sleep(20);
                        mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
                        Console.WriteLine("DOUBLECLICK_OK:left");
                        break;
                    }

                    case "scroll": {
                        int amount = args.Length > 1 ? int.Parse(args[1]) : -3;
                        uint clicks = (uint)(amount * 120);
                        mouse_event(MOUSEEVENTF_WHEEL, 0, 0, clicks, 0);
                        Console.WriteLine("SCROLL_OK:" + amount);
                        break;
                    }

                    case "type": {
                        if (args.Length > 1) {
                            string text = string.Join(" ", args, 1, args.Length - 1);
                            SendKeys.SendWait(text);
                            Console.WriteLine("TYPE_OK:" + text.Length);
                        }
                        break;
                    }

                    case "presskey": {
                        if (args.Length > 1) {
                            string key = args[1];
                            SendKeys.SendWait(key);
                            Console.WriteLine("KEY_OK:" + key);
                        }
                        break;
                    }

                    default:
                        Console.WriteLine("ERR_UNKNOWN_CMD:" + command);
                        exitCode = 4;
                        break;
                }
            });

            worker.Start();
            worker.Join(4000);

            if (hInput != IntPtr.Zero) {
                CloseDesktop(hInput);
            }

            return exitCode;
        }
    }
}
