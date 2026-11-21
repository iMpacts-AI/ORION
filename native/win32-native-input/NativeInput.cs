using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows;
using System.Windows.Automation;
using System.Windows.Forms;

[assembly: CompilationRelaxations(8)]
[assembly: RuntimeCompatibility(WrapNonExceptionThrows = true)]
[assembly: AssemblyVersion("0.0.0.0")]
namespace Orion.Platform.Win32;

public struct POINT
{
	public int X;

	public int Y;
}
public struct MOUSEINPUT
{
	public int dx;

	public int dy;

	public uint mouseData;

	public uint dwFlags;

	public uint time;

	public IntPtr dwExtraInfo;
}
public struct KEYBDINPUT
{
	public ushort wVk;

	public ushort wScan;

	public uint dwFlags;

	public uint time;

	public IntPtr dwExtraInfo;
}
public struct HARDWAREINPUT
{
	public uint uMsg;

	public ushort wParamL;

	public ushort wParamH;
}
[StructLayout(LayoutKind.Explicit)]
public struct INPUTUNION
{
	[FieldOffset(0)]
	public MOUSEINPUT mi;

	[FieldOffset(0)]
	public KEYBDINPUT ki;

	[FieldOffset(0)]
	public HARDWAREINPUT hi;
}
public struct INPUT
{
	public uint type;

	public INPUTUNION u;
}
public static class NativeInputEntry
{
	public const uint DESKTOP_ALL = 511u;

	public const int UOI_NAME = 2;

	public const uint INPUT_MOUSE = 0u;

	public const uint INPUT_KEYBOARD = 1u;

	public const uint MOUSEEVENTF_MOVE = 1u;

	public const uint MOUSEEVENTF_LEFTDOWN = 2u;

	public const uint MOUSEEVENTF_LEFTUP = 4u;

	public const uint MOUSEEVENTF_RIGHTDOWN = 8u;

	public const uint MOUSEEVENTF_RIGHTUP = 16u;

	public const uint MOUSEEVENTF_MIDDLEDOWN = 32u;

	public const uint MOUSEEVENTF_MIDDLEUP = 64u;

	public const uint MOUSEEVENTF_WHEEL = 2048u;

	public const uint MOUSEEVENTF_VIRTUALDESK = 16384u;

	public const uint MOUSEEVENTF_ABSOLUTE = 32768u;

	public const uint KEYEVENTF_EXTENDEDKEY = 1u;

	public const uint KEYEVENTF_KEYUP = 2u;

	public const uint KEYEVENTF_UNICODE = 4u;

	public const int SM_XVIRTUALSCREEN = 76;

	public const int SM_YVIRTUALSCREEN = 77;

	public const int SM_CXVIRTUALSCREEN = 78;

	public const int SM_CYVIRTUALSCREEN = 79;

	public const byte VK_LWIN = 91;

	public const byte VK_CONTROL = 17;

	public const byte VK_RETURN = 13;

	public static readonly IntPtr DPI_PER_MONITOR_V2 = new IntPtr(-4);

	private static readonly byte[] HeldKeys = new byte[11]
	{
		16, 17, 18, 91, 92, 160, 161, 162, 163, 164,
		165
	};

	[DllImport("user32.dll")]
	public static extern bool SetProcessDPIAware();

	[DllImport("user32.dll")]
	public static extern bool SetProcessDpiAwarenessContext(IntPtr value);

	[DllImport("user32.dll", SetLastError = true)]
	public static extern uint SendInput(uint nInputs, INPUT[] pInputs, int cbSize);

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
	public static extern int GetSystemMetrics(int nIndex);

	[DllImport("user32.dll")]
	public static extern IntPtr GetForegroundWindow();

	[DllImport("user32.dll", CharSet = CharSet.Unicode)]
	public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

	[DllImport("user32.dll")]
	public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

	[DllImport("user32.dll", SetLastError = true)]
	public static extern bool GetUserObjectInformation(IntPtr hObj, int nIndex, StringBuilder pvInfo, int nLength, out int lpnLengthNeeded);

	[DllImport("user32.dll")]
	public static extern short GetAsyncKeyState(int vKey);

	[DllImport("kernel32.dll", SetLastError = true)]
	public static extern IntPtr OpenProcess(uint access, bool inherit, uint pid);

	[DllImport("kernel32.dll")]
	public static extern IntPtr GetCurrentProcess();

	[DllImport("kernel32.dll", SetLastError = true)]
	public static extern bool CloseHandle(IntPtr h);

	[DllImport("advapi32.dll", SetLastError = true)]
	public static extern bool OpenProcessToken(IntPtr process, uint access, out IntPtr token);

	[DllImport("advapi32.dll", SetLastError = true)]
	public static extern bool GetTokenInformation(IntPtr token, int cls, out int info, int len, out int retLen);

	private static int InputSize()
	{
		return Marshal.SizeOf(typeof(INPUT));
	}

	private static INPUT MouseInput(uint flags, int dx, int dy, uint data)
	{
		INPUT result = default(INPUT);
		result.type = 0u;
		result.u.mi.dx = dx;
		result.u.mi.dy = dy;
		result.u.mi.mouseData = data;
		result.u.mi.dwFlags = flags;
		return result;
	}

	private static INPUT KeyInput(ushort vk, ushort scan, uint flags)
	{
		INPUT result = default(INPUT);
		result.type = 1u;
		result.u.ki.wVk = vk;
		result.u.ki.wScan = scan;
		result.u.ki.dwFlags = flags;
		return result;
	}

	private static bool IsExtendedVk(byte vk)
	{
		switch (vk)
		{
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 38:
		case 39:
		case 40:
		case 45:
		case 46:
		case 91:
		case 92:
		case 163:
		case 165:
			return true;
		default:
			return false;
		}
	}

	private static uint Send(params INPUT[] inputs)
	{
		return SendInput((uint)inputs.Length, inputs, InputSize());
	}

	private static void KeyDown(byte vk)
	{
		Send(KeyInput(vk, 0, IsExtendedVk(vk) ? 1u : 0u));
	}

	private static void KeyUp(byte vk)
	{
		Send(KeyInput(vk, 0, 2u | (IsExtendedVk(vk) ? 1u : 0u)));
	}

	private static void Tap(byte vk)
	{
		KeyDown(vk);
		Thread.Sleep(10);
		KeyUp(vk);
	}

	private static void MouseButton(string button, bool down)
	{
		uint flags = ((button == "right") ? (down ? 8u : 16u) : ((!(button == "middle")) ? (down ? 2u : 4u) : (down ? 32u : 64u)));
		Send(MouseInput(flags, 0, 0, 0u));
	}

	private static void ClickButton(string button)
	{
		MouseButton(button, down: true);
		Thread.Sleep(25);
		MouseButton(button, down: false);
	}

	private static bool MoveAbsolute(int x, int y)
	{
		int systemMetrics = GetSystemMetrics(76);
		int systemMetrics2 = GetSystemMetrics(77);
		int num = Math.Max(1, GetSystemMetrics(78));
		int num2 = Math.Max(1, GetSystemMetrics(79));
		int dx = (int)Math.Round((double)(x - systemMetrics) * 65535.0 / (double)Math.Max(1, num - 1));
		int dy = (int)Math.Round((double)(y - systemMetrics2) * 65535.0 / (double)Math.Max(1, num2 - 1));
		Send(MouseInput(49153u, dx, dy, 0u));
		if (GetCursorPos(out var lpPoint) && Math.Abs(lpPoint.X - x) <= 2 && Math.Abs(lpPoint.Y - y) <= 2)
		{
			return true;
		}
		SetCursorPos(x, y);
		if (GetCursorPos(out lpPoint) && Math.Abs(lpPoint.X - x) <= 2)
		{
			return Math.Abs(lpPoint.Y - y) <= 2;
		}
		return false;
	}

	private static int TypeUnicode(string text)
	{
		int num = 0;
		string text2 = text.Replace("\r\n", "\n").Replace('\r', '\n');
		for (int i = 0; i < text2.Length; i++)
		{
			char c = text2[i];
			switch (c)
			{
			case '\n':
				Tap(13);
				num++;
				continue;
			case '\t':
				Tap(9);
				num++;
				continue;
			}
			if (char.IsHighSurrogate(c) && i + 1 < text2.Length && char.IsLowSurrogate(text2[i + 1]))
			{
				char scan = text2[i + 1];
				uint num2 = Send(KeyInput(0, c, 4u), KeyInput(0, scan, 4u), KeyInput(0, c, 6u), KeyInput(0, scan, 6u));
				if (num2 == 4)
				{
					num += 2;
				}
				i++;
				Thread.Sleep(8);
			}
			else
			{
				INPUT iNPUT = KeyInput(0, c, 4u);
				INPUT iNPUT2 = KeyInput(0, c, 6u);
				if (Send(iNPUT, iNPUT2) == 2)
				{
					num++;
				}
				Thread.Sleep(2);
			}
		}
		return num;
	}

	private static string FromB64(string b64)
	{
		return Encoding.UTF8.GetString(Convert.FromBase64String(b64));
	}

	private static int Elevation(IntPtr process)
	{
		if (!OpenProcessToken(process, 8u, out var token))
		{
			return -1;
		}
		try
		{
			int info;
			int retLen;
			return (!GetTokenInformation(token, 20, out info, 4, out retLen)) ? (-1) : ((info != 0) ? 1 : 0);
		}
		finally
		{
			CloseHandle(token);
		}
	}

	private static bool ForegroundBlockedByUipi()
	{
		GetWindowThreadProcessId(GetForegroundWindow(), out var lpdwProcessId);
		if (lpdwProcessId == 0)
		{
			return false;
		}
		int num = Elevation(GetCurrentProcess());
		IntPtr intPtr = OpenProcess(4096u, inherit: false, lpdwProcessId);
		if (intPtr == IntPtr.Zero)
		{
			return num != 1;
		}
		try
		{
			return Elevation(intPtr) == 1 && num != 1;
		}
		finally
		{
			CloseHandle(intPtr);
		}
	}

	private static int ReleaseAll()
	{
		int num = 0;
		byte[] heldKeys = HeldKeys;
		foreach (byte b in heldKeys)
		{
			if (((uint)GetAsyncKeyState(b) & 0x8000u) != 0)
			{
				KeyUp(b);
				num++;
			}
		}
		if (((uint)GetAsyncKeyState(1) & 0x8000u) != 0)
		{
			MouseButton("left", down: false);
			num++;
		}
		if (((uint)GetAsyncKeyState(2) & 0x8000u) != 0)
		{
			MouseButton("right", down: false);
			num++;
		}
		if (((uint)GetAsyncKeyState(4) & 0x8000u) != 0)
		{
			MouseButton("middle", down: false);
			num++;
		}
		return num;
	}

	private static string ForegroundInfo()
	{
		IntPtr foregroundWindow = GetForegroundWindow();
		StringBuilder stringBuilder = new StringBuilder(512);
		GetWindowText(foregroundWindow, stringBuilder, 512);
		GetWindowThreadProcessId(foregroundWindow, out var lpdwProcessId);
		string text = "";
		try
		{
			text = Process.GetProcessById((int)lpdwProcessId).ProcessName;
		}
		catch
		{
		}
		return "HWND:" + foregroundWindow.ToInt64() + "|PID:" + lpdwProcessId + "|PROCESS:" + text + "|TITLE:" + stringBuilder.ToString().Replace("|", "/");
	}

	private static bool IsInteractive(ControlType t)
	{
		if (t != ControlType.Button && t != ControlType.Edit && t != ControlType.Hyperlink && t != ControlType.CheckBox && t != ControlType.RadioButton && t != ControlType.ComboBox && t != ControlType.MenuItem && t != ControlType.ListItem && t != ControlType.TabItem && t != ControlType.Document && t != ControlType.SplitButton)
		{
			return t == ControlType.TreeItem;
		}
		return true;
	}

	private static string JsonEsc(string s)
	{
		if (s == null)
		{
			return "";
		}
		StringBuilder stringBuilder = new StringBuilder(s.Length + 8);
		foreach (char c in s)
		{
			if (c == '"' || c == '\\')
			{
				stringBuilder.Append('\\').Append(c);
			}
			else if (c < ' ')
			{
				stringBuilder.Append(' ');
			}
			else
			{
				stringBuilder.Append(c);
			}
		}
		return stringBuilder.ToString();
	}

	private static AutomationElement FindByName(string name, int timeoutMs)
	{
		AutomationElement val = AutomationElement.FromHandle(GetForegroundWindow());
		if (val == (AutomationElement)null)
		{
			return null;
		}
		DateTime dateTime = DateTime.UtcNow.AddMilliseconds(timeoutMs);
		string text = name.Trim().ToLowerInvariant();
		do
		{
			AutomationElementCollection val2 = val.FindAll((TreeScope)4, Condition.TrueCondition);
			AutomationElement val3 = null;
			foreach (AutomationElement item in val2)
			{
				AutomationElement val4 = item;
				string text2;
				try
				{
					AutomationElement.AutomationElementInformation current = val4.Current;
					text2 = (current.Name ?? "").Trim().ToLowerInvariant();
				}
				catch
				{
					continue;
				}
				if (text2.Length == 0)
				{
					continue;
				}
				bool flag = true;
				try
				{
					AutomationElement.AutomationElementInformation current2 = val4.Current;
					int num;
					if (current2.IsEnabled)
					{
						AutomationElement.AutomationElementInformation current3 = val4.Current;
						num = ((!current3.IsOffscreen) ? 1 : 0);
					}
					else
					{
						num = 0;
					}
					flag = (byte)num != 0;
				}
				catch
				{
				}
				if (flag)
				{
					if (text2 == text)
					{
						return val4;
					}
					if (val3 == (AutomationElement)null && text2.Contains(text))
					{
						val3 = val4;
					}
				}
			}
			if (val3 != (AutomationElement)null)
			{
				return val3;
			}
			Thread.Sleep(150);
		}
		while (DateTime.UtcNow < dateTime);
		return null;
	}

	private static string Describe(AutomationElement el)
	{
		try
		{
			AutomationElement.AutomationElementInformation current = el.Current;
			string text = (current.Name ?? "").Replace("|", "/");
			AutomationElement.AutomationElementInformation current2 = el.Current;
			return "NAME:" + text + "|TYPE:" + ((AutomationIdentifier)current2.ControlType).ProgrammaticName.Replace("ControlType.", "");
		}
		catch
		{
			return "NAME:?|TYPE:?";
		}
	}

	private static string FocusedValue()
	{
		AutomationElement focusedElement = AutomationElement.FocusedElement;
		if (focusedElement == (AutomationElement)null)
		{
			return null;
		}
		object obj = default(object);
		if (focusedElement.TryGetCurrentPattern(ValuePattern.Pattern, out obj))
		{
			ValuePattern.ValuePatternInformation current = ((ValuePattern)obj).Current;
			return current.Value ?? "";
		}
		if (focusedElement.TryGetCurrentPattern(TextPattern.Pattern, out obj))
		{
			return ((TextPattern)obj).DocumentRange.GetText(20000) ?? "";
		}
		return null;
	}

	public static string EscapeSendKeysLiteral(string input)
	{
		if (string.IsNullOrEmpty(input))
		{
			return string.Empty;
		}
		StringBuilder stringBuilder = new StringBuilder(input.Length * 2);
		foreach (char c in input)
		{
			switch (c)
			{
			case '{':
				stringBuilder.Append("{{}");
				break;
			case '}':
				stringBuilder.Append("{}}");
				break;
			case '+':
				stringBuilder.Append("{+}");
				break;
			case '^':
				stringBuilder.Append("{^}");
				break;
			case '%':
				stringBuilder.Append("{%}");
				break;
			case '~':
				stringBuilder.Append("{~}");
				break;
			case '(':
				stringBuilder.Append("{(}");
				break;
			case ')':
				stringBuilder.Append("{)}");
				break;
			case '[':
				stringBuilder.Append("{[}");
				break;
			case ']':
				stringBuilder.Append("{]}");
				break;
			case '\n':
				stringBuilder.Append("{ENTER}");
				break;
			case '\t':
				stringBuilder.Append("{TAB}");
				break;
			default:
				stringBuilder.Append(c);
				break;
			case '\r':
				break;
			}
		}
		return stringBuilder.ToString();
	}

	public static byte ResolveVirtualKey(string rawKey)
	{
		if (string.IsNullOrEmpty(rawKey))
		{
			return 0;
		}
		string text = rawKey.Trim().ToLowerInvariant();
		if (text.StartsWith("{") && text.EndsWith("}") && text.Length > 2)
		{
			text = text.Substring(1, text.Length - 2).Trim();
		}
		if (text.Length == 1)
		{
			char c = text[0];
			if (c >= 'a' && c <= 'z')
			{
				return (byte)(65 + (c - 97));
			}
			if (c >= '0' && c <= '9')
			{
				return (byte)(48 + (c - 48));
			}
			switch (c)
			{
			case ' ':
				return 32;
			case '+':
			case '=':
				return 187;
			case '-':
				return 189;
			case ',':
				return 188;
			case '.':
				return 190;
			case '/':
				return 191;
			case ';':
				return 186;
			case '[':
				return 219;
			case '\\':
				return 220;
			case ']':
				return 221;
			}
		}
		switch (text)
		{
		case "ctrl":
		case "control":
		case "lctrl":
			return 17;
		case "rctrl":
			return 163;
		case "shift":
		case "lshift":
			return 16;
		case "rshift":
			return 161;
		case "alt":
		case "menu":
		case "lalt":
			return 18;
		case "ralt":
			return 165;
		case "win":
		case "windows":
		case "lwin":
		case "meta":
		case "super":
			return 91;
		case "rwin":
			return 92;
		case "enter":
		case "return":
			return 13;
		case "tab":
			return 9;
		case "esc":
		case "escape":
			return 27;
		case "space":
		case "spacebar":
			return 32;
		case "backspace":
		case "back":
		case "bksp":
			return 8;
		case "delete":
		case "del":
			return 46;
		case "insert":
		case "ins":
			return 45;
		case "home":
			return 36;
		case "end":
			return 35;
		case "pageup":
		case "pgup":
			return 33;
		case "pagedown":
		case "pgdn":
			return 34;
		case "up":
			return 38;
		case "down":
			return 40;
		case "left":
			return 37;
		case "right":
			return 39;
		case "capslock":
			return 20;
		case "printscreen":
		case "prtsc":
			return 44;
		case "plus":
			return 187;
		case "minus":
			return 189;
		case "f1":
			return 112;
		case "f2":
			return 113;
		case "f3":
			return 114;
		case "f4":
			return 115;
		case "f5":
			return 116;
		case "f6":
			return 117;
		case "f7":
			return 118;
		case "f8":
			return 119;
		case "f9":
			return 120;
		case "f10":
			return 121;
		case "f11":
			return 122;
		case "f12":
			return 123;
		default:
			return 0;
		}
	}

	[STAThread]
	public static int Main(string[] args)
	{
		bool perMonitor = false;
		try
		{
			perMonitor = SetProcessDpiAwarenessContext(DPI_PER_MONITOR_V2);
		}
		catch
		{
		}
		if (!perMonitor)
		{
			try
			{
				SetProcessDPIAware();
			}
			catch
			{
			}
		}
		if (args.Length == 0)
		{
			Console.WriteLine("USAGE: win32-native-input <status|getpos|setpos|click|clickat|doubleclick|scroll|type|typeliteral|typeunicode|paste|submit|presskey|keydown|keyup|winhotkey|releaseall|foreground|uia-list|uia-invoke|uia-setvalue|uia-focused-value|screenshot> [args]");
			return 0;
		}
		string command = args[0].ToLowerInvariant();
		IntPtr hInput = OpenInputDesktop(0u, fInherit: false, 511u);
		bool hasInputDesktop = hInput != IntPtr.Zero;
		int exitCode = 0;
		int num = 4000;
		if ((command == "typeunicode" || command == "paste" || command == "uia-setvalue") && args.Length > 1)
		{
			int num2 = (int)((double)args[args.Length - 1].Length * 0.75);
			num = Math.Max(4000, 2000 + num2 * 8);
		}
		if (command == "uia-invoke" || command == "uia-setvalue")
		{
			num = Math.Max(num, 8000);
		}
		Thread thread = new Thread((ThreadStart)delegate
		{
			try
			{
				bool flag = false;
				if (hasInputDesktop)
				{
					flag = SetThreadDesktop(hInput);
				}
				string environmentVariable = Environment.GetEnvironmentVariable("ORION_EXPECT_HWND");
				if (!string.IsNullOrEmpty(environmentVariable) && environmentVariable != "0" && (command == "clickat" || command == "typeunicode" || command == "paste" || command == "submit" || command == "typeliteral" || command == "presskey" || command == "winhotkey" || command == "uia-invoke" || command == "uia-setvalue") && long.TryParse(environmentVariable, out var result) && GetForegroundWindow().ToInt64() != result)
				{
					Console.WriteLine("FOCUS_CHANGED:the window in front is no longer the one ORION was working in; nothing was sent|EXPECTED:" + result + "|" + ForegroundInfo());
					exitCode = 13;
				}
				else if ((command == "clickat" || command == "typeunicode" || command == "paste" || command == "submit") && ForegroundBlockedByUipi())
				{
					Console.WriteLine("UIPI_BLOCKED:foreground window runs as administrator; ORION cannot send input to it|" + ForegroundInfo());
					exitCode = 12;
				}
				else
				{
					switch (command)
					{
					case "status":
					{
						StringBuilder stringBuilder = new StringBuilder(256);
						int lpnLengthNeeded = 0;
						if (hasInputDesktop)
						{
							GetUserObjectInformation(hInput, 2, stringBuilder, 256, out lpnLengthNeeded);
							Console.WriteLine("STATUS:INTERACTIVE|DESKTOP:" + stringBuilder.ToString() + "|ATTACHED:" + flag + "|DPI:" + (perMonitor ? "PER_MONITOR_V2" : "SYSTEM"));
						}
						else
						{
							Console.WriteLine("STATUS:NON_INTERACTIVE|DESKTOP:NONE|ATTACHED:FALSE");
						}
						break;
					}
					case "getpos":
					{
						POINT lpPoint2 = default(POINT);
						if (GetCursorPos(out lpPoint2))
						{
							Console.WriteLine("POS:" + lpPoint2.X + "," + lpPoint2.Y);
						}
						else
						{
							int lastWin32Error2 = Marshal.GetLastWin32Error();
							Console.WriteLine("ERR_UNAVAILABLE:GetCursorPos failed (Win32 Error: " + lastWin32Error2 + ")");
							exitCode = 1;
						}
						break;
					}
					case "setpos":
						if (args.Length < 3)
						{
							Console.WriteLine("ERR_INVALID_ARGS: setpos requires <x> <y>");
							exitCode = 2;
						}
						else
						{
							int num6 = int.Parse(args[1]);
							int num7 = int.Parse(args[2]);
							bool flag5 = MoveAbsolute(num6, num7);
							POINT lpPoint = default(POINT);
							bool cursorPos = GetCursorPos(out lpPoint);
							if (flag5 && cursorPos)
							{
								Console.WriteLine("SET_OK:" + lpPoint.X + "," + lpPoint.Y);
							}
							else if (cursorPos)
							{
								Console.WriteLine("SET_UNVERIFIED:" + num6 + "," + num7 + "|ACTUAL:" + lpPoint.X + "," + lpPoint.Y);
							}
							else
							{
								int lastWin32Error = Marshal.GetLastWin32Error();
								Console.WriteLine("SET_FAILED:" + num6 + "," + num7 + "|ERR:" + lastWin32Error);
								exitCode = 3;
							}
						}
						break;
					case "click":
					{
						string text13 = ((args.Length > 1) ? args[1].ToLowerInvariant() : "left");
						if (text13 != "right" && text13 != "middle")
						{
							text13 = "left";
						}
						ClickButton(text13);
						Console.WriteLine("CLICK_OK:" + text13);
						break;
					}
					case "clickat":
						if (args.Length < 3)
						{
							Console.WriteLine("ERR_INVALID_ARGS: clickat requires <x> <y> [button] [double]");
							exitCode = 2;
						}
						else
						{
							int x = int.Parse(args[1]);
							int y = int.Parse(args[2]);
							string text12 = ((args.Length > 3) ? args[3].ToLowerInvariant() : "left");
							if (text12 != "right" && text12 != "middle")
							{
								text12 = "left";
							}
							bool flag6 = args.Length > 4 && args[4].ToLowerInvariant() == "double";
							if (!MoveAbsolute(x, y))
							{
								GetCursorPos(out var lpPoint3);
								Console.WriteLine("CLICKAT_FAILED:cursor not at target|ACTUAL:" + lpPoint3.X + "," + lpPoint3.Y);
								exitCode = 3;
							}
							else
							{
								Thread.Sleep(30);
								ClickButton(text12);
								if (flag6)
								{
									Thread.Sleep(60);
									ClickButton(text12);
								}
								GetCursorPos(out var lpPoint4);
								Console.WriteLine("CLICKAT_OK:" + lpPoint4.X + "," + lpPoint4.Y + "|BUTTON:" + text12 + (flag6 ? "|DOUBLE" : "") + "|" + ForegroundInfo());
							}
						}
						break;
					case "doubleclick":
						ClickButton("left");
						Thread.Sleep(50);
						ClickButton("left");
						Console.WriteLine("DOUBLECLICK_OK:left");
						break;
					case "scroll":
					{
						int num13 = ((args.Length > 1) ? int.Parse(args[1]) : (-3));
						Send(MouseInput(2048u, 0, 0, (uint)(num13 * 120)));
						Console.WriteLine("SCROLL_OK:" + num13);
						break;
					}
					case "type":
						if (args.Length > 1)
						{
							string text6 = ((args.Length == 2) ? args[1] : string.Join(" ", args, 1, args.Length - 1));
							SendKeys.SendWait(text6);
							Console.WriteLine("TYPE_OK:" + text6.Length);
						}
						break;
					case "typeliteral":
						if (args.Length > 1)
						{
							string text17 = ((args.Length == 2) ? args[1] : string.Join(" ", args, 1, args.Length - 1));
							TypeUnicode(text17);
							Console.WriteLine("TYPE_OK:" + text17.Length);
						}
						else
						{
							Console.WriteLine("TYPE_OK:0");
						}
						break;
					case "typeunicode":
						if (args.Length < 2)
						{
							Console.WriteLine("ERR_INVALID_ARGS: typeunicode requires <base64>");
							exitCode = 2;
						}
						else
						{
							string text2 = FromB64(args[1]);
							int num5 = TypeUnicode(text2);
							string text3 = text2.Replace("\r\n", "\n").Replace('\r', '\n');
							if (num5 == text3.Length)
							{
								Console.WriteLine("TYPEUNICODE_OK:" + num5 + "|" + ForegroundInfo());
							}
							else
							{
								Console.WriteLine("TYPEUNICODE_PARTIAL:" + num5 + "/" + text3.Length + "|" + ForegroundInfo());
								exitCode = 6;
							}
						}
						break;
					case "paste":
						if (args.Length < 2)
						{
							Console.WriteLine("ERR_INVALID_ARGS: paste requires <base64>");
							exitCode = 2;
						}
						else
						{
							string text4 = FromB64(args[1]);
							string text5 = null;
							bool flag2 = false;
							try
							{
								flag2 = Clipboard.ContainsText();
								if (flag2)
								{
									text5 = Clipboard.GetText();
								}
							}
							catch
							{
							}
							bool flag3 = false;
							for (int i = 0; i < 5; i++)
							{
								if (flag3)
								{
									break;
								}
								try
								{
									Clipboard.SetText((text4.Length == 0) ? " " : text4);
									flag3 = true;
								}
								catch
								{
									Thread.Sleep(60);
								}
							}
							if (!flag3)
							{
								Console.WriteLine("PASTE_FAILED:clipboard busy");
								exitCode = 7;
							}
							else
							{
								KeyDown(17);
								Thread.Sleep(15);
								Tap(86);
								Thread.Sleep(15);
								KeyUp(17);
								Thread.Sleep(Math.Min(1500, 250 + text4.Length / 20));
								bool flag4 = false;
								try
								{
									if (flag2 && text5 != null)
									{
										Clipboard.SetText(text5);
										flag4 = true;
									}
									else
									{
										Clipboard.Clear();
										flag4 = true;
									}
								}
								catch
								{
								}
								Console.WriteLine("PASTE_OK:" + text4.Length + "|RESTORED:" + flag4 + "|" + ForegroundInfo());
							}
						}
						break;
					case "submit":
						Tap(13);
						Console.WriteLine("SUBMIT_OK:enter|" + ForegroundInfo());
						break;
					case "presskey":
						if (args.Length < 2)
						{
							Console.WriteLine("ERR_INVALID_ARGS: presskey requires <key>");
							exitCode = 2;
						}
						else
						{
							string text10 = args[1];
							byte b3 = ResolveVirtualKey(text10);
							if (b3 != 0 && !text10.Contains("^") && !text10.Contains("%") && !text10.Contains("+"))
							{
								Tap(b3);
							}
							else
							{
								SendKeys.SendWait(text10);
							}
							Console.WriteLine("KEY_OK:" + text10);
						}
						break;
					case "keydown":
						if (args.Length < 2)
						{
							Console.WriteLine("ERR_INVALID_ARGS: keydown requires <key>");
							exitCode = 2;
						}
						else
						{
							byte b = ResolveVirtualKey(args[1]);
							if (b == 0)
							{
								Console.WriteLine("ERR_INVALID_KEY:" + args[1]);
								exitCode = 2;
							}
							else
							{
								KeyDown(b);
								Console.WriteLine("KEYDOWN_OK:" + args[1]);
							}
						}
						break;
					case "keyup":
						if (args.Length < 2)
						{
							Console.WriteLine("ERR_INVALID_ARGS: keyup requires <key>");
							exitCode = 2;
						}
						else
						{
							byte b4 = ResolveVirtualKey(args[1]);
							if (b4 == 0)
							{
								Console.WriteLine("ERR_INVALID_KEY:" + args[1]);
								exitCode = 2;
							}
							else
							{
								KeyUp(b4);
								Console.WriteLine("KEYUP_OK:" + args[1]);
							}
						}
						break;
					case "winhotkey":
					{
						List<byte> list = new List<byte>();
						for (int j = 1; j < args.Length; j++)
						{
							string text9 = args[j];
							if (!string.IsNullOrWhiteSpace(text9))
							{
								switch (text9.Trim().ToLowerInvariant())
								{
								default:
								{
									byte b2 = ResolveVirtualKey(text9);
									if (b2 == 0)
									{
										Console.WriteLine("ERR_INVALID_KEY:" + text9);
										exitCode = 2;
										return;
									}
									list.Add(b2);
									break;
								}
								case "win":
								case "windows":
								case "lwin":
								case "rwin":
									break;
								}
							}
						}
						KeyDown(91);
						try
						{
							Thread.Sleep(15);
							for (int k = 0; k < list.Count; k++)
							{
								KeyDown(list[k]);
								Thread.Sleep(15);
							}
							Thread.Sleep(20);
							for (int num12 = list.Count - 1; num12 >= 0; num12--)
							{
								KeyUp(list[num12]);
							}
						}
						finally
						{
							Thread.Sleep(15);
							KeyUp(91);
						}
						Console.WriteLine("WINHOTKEY_OK:" + ((args.Length > 1) ? string.Join("+", args, 1, args.Length - 1) : "win"));
						break;
					}
					case "foreground":
						Console.WriteLine("FOREGROUND:" + ForegroundInfo() + "|UIPI_BLOCKED:" + ForegroundBlockedByUipi());
						break;
					case "releaseall":
						Console.WriteLine("RELEASEALL_OK:" + ReleaseAll());
						break;
					case "uia-list":
					{
						int num10 = ((args.Length > 1) ? int.Parse(args[1]) : 60);
						AutomationElement val4 = AutomationElement.FromHandle(GetForegroundWindow());
						if (val4 == (AutomationElement)null)
						{
							Console.WriteLine("UIA_LIST_EMPTY");
							exitCode = 8;
						}
						else
						{
							int num11 = 0;
							foreach (AutomationElement item in val4.FindAll((TreeScope)4, Condition.TrueCondition))
							{
								AutomationElement val5 = item;
								if (num11 >= num10)
								{
									break;
								}
								try
								{
									AutomationElement.AutomationElementInformation current2 = val5.Current;
									if (IsInteractive(current2.ControlType) && !current2.IsOffscreen && current2.IsEnabled)
									{
										string text8 = current2.Name ?? "";
										if (text8.Trim().Length != 0 || current2.ControlType == ControlType.Edit)
										{
											Rect boundingRectangle2 = current2.BoundingRectangle;
											if (!boundingRectangle2.IsEmpty && !(boundingRectangle2.Width < 2.0) && !(boundingRectangle2.Height < 2.0))
											{
												Console.WriteLine("{\"id\":" + num11 + ",\"name\":\"" + JsonEsc(text8) + "\",\"role\":\"" + ((AutomationIdentifier)current2.ControlType).ProgrammaticName.Replace("ControlType.", "") + "\",\"x\":" + (int)(boundingRectangle2.X + boundingRectangle2.Width / 2.0) + ",\"y\":" + (int)(boundingRectangle2.Y + boundingRectangle2.Height / 2.0) + ",\"w\":" + (int)boundingRectangle2.Width + ",\"h\":" + (int)boundingRectangle2.Height + ",\"password\":" + (current2.IsPassword ? "true" : "false") + "}");
												num11++;
											}
										}
									}
								}
								catch
								{
								}
							}
							Console.WriteLine("UIA_LIST_OK:" + num11 + "|" + ForegroundInfo());
						}
						break;
					}
					case "uia-invoke":
						if (args.Length < 2)
						{
							Console.WriteLine("ERR_INVALID_ARGS: uia-invoke requires <base64 name>");
							exitCode = 2;
						}
						else
						{
							string text7 = FromB64(args[1]);
							AutomationElement val3 = FindByName(text7, 3000);
							object obj6 = default(object);
							if (val3 == (AutomationElement)null)
							{
								Console.WriteLine("UIA_NOT_FOUND:" + text7.Replace("|", "/") + "|" + ForegroundInfo());
								exitCode = 8;
							}
							else if (val3.TryGetCurrentPattern(InvokePattern.Pattern, out obj6))
							{
								((InvokePattern)obj6).Invoke();
								Console.WriteLine("UIA_INVOKE_OK:" + Describe(val3) + "|VIA:INVOKE");
							}
							else if (val3.TryGetCurrentPattern(TogglePattern.Pattern, out obj6))
							{
								((TogglePattern)obj6).Toggle();
								Console.WriteLine("UIA_INVOKE_OK:" + Describe(val3) + "|VIA:TOGGLE");
							}
							else if (val3.TryGetCurrentPattern(SelectionItemPattern.Pattern, out obj6))
							{
								((SelectionItemPattern)obj6).Select();
								Console.WriteLine("UIA_INVOKE_OK:" + Describe(val3) + "|VIA:SELECT");
							}
							else
							{
								AutomationElement.AutomationElementInformation current = val3.Current;
								Rect boundingRectangle = current.BoundingRectangle;
								if (boundingRectangle.IsEmpty)
								{
									Console.WriteLine("UIA_NO_PATTERN:" + Describe(val3));
									exitCode = 9;
								}
								else
								{
									int num8 = (int)(boundingRectangle.X + boundingRectangle.Width / 2.0);
									int num9 = (int)(boundingRectangle.Y + boundingRectangle.Height / 2.0);
									MoveAbsolute(num8, num9);
									Thread.Sleep(30);
									ClickButton("left");
									Console.WriteLine("UIA_INVOKE_OK:" + Describe(val3) + "|VIA:CLICK@" + num8 + "," + num9);
								}
							}
						}
						break;
					case "uia-setvalue":
						if (args.Length < 3)
						{
							Console.WriteLine("ERR_INVALID_ARGS: uia-setvalue requires <base64 name> <base64 value>");
							exitCode = 2;
						}
						else
						{
							string text14 = FromB64(args[1]);
							string text15 = FromB64(args[2]);
							AutomationElement val6 = FindByName(text14, 3000);
							if (val6 == (AutomationElement)null)
							{
								Console.WriteLine("UIA_NOT_FOUND:" + text14.Replace("|", "/") + "|" + ForegroundInfo());
								exitCode = 8;
							}
							else
							{
								object obj9 = default(object);
								if (val6.TryGetCurrentPattern(ValuePattern.Pattern, out obj9))
								{
									ValuePattern.ValuePatternInformation current3 = ((ValuePattern)obj9).Current;
									if (!current3.IsReadOnly)
									{
										((ValuePattern)obj9).SetValue(text15);
										Thread.Sleep(80);
										current3 = ((ValuePattern)obj9).Current;
										string text16 = current3.Value ?? "";
										if (text16 == text15)
										{
											Console.WriteLine("UIA_SETVALUE_OK:" + Describe(val6) + "|VERIFIED:TRUE");
										}
										else
										{
											Console.WriteLine("UIA_SETVALUE_MISMATCH:" + Describe(val6) + "|VERIFIED:FALSE");
											exitCode = 10;
										}
										break;
									}
								}
								Console.WriteLine("UIA_NOT_EDITABLE:" + Describe(val6));
								exitCode = 9;
							}
						}
						break;
					case "uia-focused-value":
					{
						string text11 = null;
						try
						{
							text11 = FocusedValue();
						}
						catch
						{
						}
						if (text11 == null)
						{
							Console.WriteLine("UIA_FOCUSED_NOVALUE|" + ForegroundInfo());
							exitCode = 11;
						}
						else
						{
							Console.WriteLine("UIA_FOCUSED_VALUE:" + Convert.ToBase64String(Encoding.UTF8.GetBytes(text11)));
						}
						break;
					}
					case "screenshot":
						if (args.Length < 2)
						{
							Console.WriteLine("ERR_INVALID_ARGS: screenshot requires <outputPath>");
							exitCode = 2;
						}
						else
						{
							string text = args[1];
							Rectangle rectangle = ((args.Length > 2 && args[2].ToLowerInvariant() == "virtual") ? SystemInformation.VirtualScreen : ((Screen.PrimaryScreen != null) ? Screen.PrimaryScreen.Bounds : new Rectangle(0, 0, 1920, 1080)));
							int num3 = ((rectangle.Width > 0) ? rectangle.Width : 1920);
							int num4 = ((rectangle.Height > 0) ? rectangle.Height : 1080);
							Bitmap val = new Bitmap(num3, num4);
							try
							{
								try
								{
									Graphics val2 = Graphics.FromImage((Image)(object)val);
									try
									{
										val2.CopyFromScreen(rectangle.Location, System.Drawing.Point.Empty, rectangle.Size);
									}
									finally
									{
										((IDisposable)val2)?.Dispose();
									}
								}
								catch (Exception ex)
								{
									Console.WriteLine("ERR_SCREENSHOT_FAILED:" + ex.Message);
									exitCode = 5;
									break;
								}
								((Image)val).Save(text, ImageFormat.Png);
							}
							finally
							{
								((IDisposable)val)?.Dispose();
							}
							Console.WriteLine("SCREENSHOT_OK:" + num3 + "x" + num4 + "|ATTACHED:" + flag + "|ORIGIN:" + rectangle.X + "," + rectangle.Y);
						}
						break;
					default:
						Console.WriteLine("ERR_UNKNOWN_CMD:" + command);
						exitCode = 4;
						break;
					}
				}
			}
			catch (Exception ex2)
			{
				Console.WriteLine("ERR_EXCEPTION:" + ex2.Message);
				exitCode = 1;
			}
		});
		thread.SetApartmentState(ApartmentState.STA);
		thread.Start();
		if (!thread.Join(num))
		{
			Console.WriteLine("ERR_TIMEOUT:Worker thread exceeded " + num + "ms");
			exitCode = 1;
		}
		if (hInput != IntPtr.Zero)
		{
			CloseDesktop(hInput);
		}
		return exitCode;
	}
}
