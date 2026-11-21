// input-probe <logfile> [x y w h]
// Opens a window at the given screen rectangle and appends one line per input event:
//   READY|HWND:<n>|X:..|Y:..|W:..|H:..          window is shown and focused
//   KEYDOWN|<Keys>|CTRL:<b>|SHIFT:<b>|ALT:<b>   KEYUP|<Keys>
//   CHAR|<U+XXXX>|<char>
//   MOUSEDOWN|<button>|<screenX>,<screenY>      MOUSEUP|<button>|<x>,<y>
//   DOUBLECLICK|<button>|<x>,<y>                WHEEL|<delta>|<x>,<y>
//   DRAG|<x1>,<y1>-><x2>,<y2>                    (mouse down + move + up)
using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

public class ProbeForm : Form
{
    private readonly StreamWriter log;
    private Point? downAt;
    private bool moved;

    public ProbeForm(string path, Rectangle r)
    {
        log = new StreamWriter(path, true) { AutoFlush = true };
        Text = "ORION Input Probe";
        StartPosition = FormStartPosition.Manual;
        FormBorderStyle = FormBorderStyle.None;
        Bounds = r;
        KeyPreview = true;
        BackColor = Color.White;
    }

    private void W(string s) { log.WriteLine(s); }
    private Point Scr(MouseEventArgs e) { return PointToScreen(e.Location); }

    protected override void OnShown(EventArgs e)
    {
        base.OnShown(e);
        Activate(); Focus();
        var o = PointToScreen(Point.Empty);
        W("READY|HWND:" + Handle.ToInt64() + "|X:" + o.X + "|Y:" + o.Y + "|W:" + ClientSize.Width + "|H:" + ClientSize.Height);
    }

    protected override bool ProcessCmdKey(ref Message msg, Keys keyData) { return false; }
    protected override bool IsInputKey(Keys keyData) { return true; }

    protected override void OnKeyDown(KeyEventArgs e)
    {
        W("KEYDOWN|" + e.KeyCode + "|CTRL:" + e.Control + "|SHIFT:" + e.Shift + "|ALT:" + e.Alt);
        e.Handled = true; e.SuppressKeyPress = false;
    }
    protected override void OnKeyUp(KeyEventArgs e) { W("KEYUP|" + e.KeyCode); }
    protected override void OnKeyPress(KeyPressEventArgs e)
    {
        W("CHAR|U+" + ((int)e.KeyChar).ToString("X4") + "|" + (char.IsControl(e.KeyChar) ? "" : e.KeyChar.ToString()));
    }
    protected override void OnMouseDown(MouseEventArgs e)
    {
        var p = Scr(e); W("MOUSEDOWN|" + e.Button + "|" + p.X + "," + p.Y);
        if (e.Button == MouseButtons.Left) { downAt = p; moved = false; }
    }
    protected override void OnMouseMove(MouseEventArgs e)
    {
        if (downAt.HasValue && e.Button == MouseButtons.Left) moved = true;
    }
    protected override void OnMouseUp(MouseEventArgs e)
    {
        var p = Scr(e); W("MOUSEUP|" + e.Button + "|" + p.X + "," + p.Y);
        if (e.Button == MouseButtons.Left && downAt.HasValue && moved && downAt.Value != p)
            W("DRAG|" + downAt.Value.X + "," + downAt.Value.Y + "->" + p.X + "," + p.Y);
        downAt = null;
    }
    protected override void OnMouseDoubleClick(MouseEventArgs e)
    {
        var p = Scr(e); W("DOUBLECLICK|" + e.Button + "|" + p.X + "," + p.Y);
    }
    protected override void OnMouseWheel(MouseEventArgs e)
    {
        var p = Scr(e); W("WHEEL|" + e.Delta + "|" + p.X + "," + p.Y);
    }

    [STAThread]
    public static int Main(string[] args)
    {
        // Fake-PowerShell mode for tests: ORION's driver calls its PowerShell
        // fallback as "<binary> -NoProfile -NonInteractive -Command ...". Record it
        // (tests assert no fallback happens after the helper refused) and exit.
        if (args.Length > 0 && args[0] == "-NoProfile")
        {
            var logPath = Environment.GetEnvironmentVariable("ORION_FAKE_PS_LOG");
            if (!string.IsNullOrEmpty(logPath)) File.AppendAllText(logPath, string.Join(" ", args) + Environment.NewLine);
            return 0;
        }
        if (args.Length < 1) { Console.Error.WriteLine("usage: input-probe <logfile> [x y w h]"); return 2; }
        var r = args.Length >= 5
            ? new Rectangle(int.Parse(args[1]), int.Parse(args[2]), int.Parse(args[3]), int.Parse(args[4]))
            : new Rectangle(100, 100, 800, 500);
        Application.EnableVisualStyles();
        Application.Run(new ProbeForm(args[0], r));
        return 0;
    }
}
