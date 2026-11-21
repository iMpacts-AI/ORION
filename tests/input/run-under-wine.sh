#!/usr/bin/env bash
# =============================================================================
# Runs ORION's keyboard + mouse end-to-end tests on Linux, with the real Windows
# helper running under Wine on a virtual X screen (Xvfb).
#
#   tests/input/run-under-wine.sh [orion.mjs]
#
# Needs: Xvfb, wine (wine64), dotnet SDK 8+, node 18+, curl, xz.
#   sudo apt-get install -y xvfb wine64 wine dotnet-sdk-8.0
# If orion.mjs is given, the patched JS layer is tested too (tools/hotfix patch
# is applied to a copy first).
#
# Wine is a stand-in for Windows: good at catching logic bugs (wrong keys, text
# typed as key names, missing refusals); the Windows CI job is the final word.
# =============================================================================
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="${ORION_WINE_WORK:-${TMPDIR:-/tmp}/orion-wine}"
ORION_MJS="${1:-}"
DISPLAY_NUM="${ORION_WINE_DISPLAY:-:97}"
MONO_VER="8.1.0"   # wine-mono matching Wine 9.x
mkdir -p "$WORK"

# Wine is sensitive to some host environment variables (it aborted with
# "free(): invalid pointer" in a sandbox), so always run it with a clean env.
cat > "$WORK/wine" <<EOF
#!/bin/sh
exec env -i HOME="\$HOME" PATH=/usr/bin:/bin DISPLAY=$DISPLAY_NUM WINEPREFIX="$WORK/prefix" WINEDEBUG=-all \\
  ORION_EXPECT_HWND="\${ORION_EXPECT_HWND:-}" "\$(command -v wine64 || echo /usr/lib/wine/wine64)" "\$@"
EOF
chmod +x "$WORK/wine"

echo "== building helper and probe"
dotnet build "$ROOT/native/win32-native-input" -c Release -o "$WORK/helper" -nologo -v q
dotnet build "$ROOT/native/input-probe" -c Release -o "$WORK/probe" -nologo -v q

echo "== virtual screen $DISPLAY_NUM"
if ! xdpyinfo -display "$DISPLAY_NUM" >/dev/null 2>&1; then
  Xvfb "$DISPLAY_NUM" -screen 0 1280x800x24 >/dev/null 2>&1 &
  sleep 2
fi

if [ ! -d "$WORK/mono/wine-mono-$MONO_VER" ]; then
  echo "== wine-mono $MONO_VER"
  mkdir -p "$WORK/mono"
  curl -fsSL "https://github.com/wine-mono/wine-mono/releases/download/wine-mono-$MONO_VER/wine-mono-$MONO_VER-x86.tar.xz" | tar -xJ -C "$WORK/mono"
fi
if [ ! -f "$WORK/prefix/system.reg" ]; then
  echo "== wine prefix"
  # Wine looks for mono in /usr/share/wine/mono or next to the prefix's data dir
  if [ ! -d /usr/share/wine/mono/wine-mono-$MONO_VER ]; then
    (sudo mkdir -p /usr/share/wine/mono && sudo cp -r "$WORK/mono/wine-mono-$MONO_VER" /usr/share/wine/mono/) 2>/dev/null \
      || { mkdir -p /usr/share/wine/mono && cp -r "$WORK/mono/wine-mono-$MONO_VER" /usr/share/wine/mono/; }
  fi
  "$WORK/wine" wineboot -i >/dev/null 2>&1 || true
  # One virtual desktop so focus and cursor behave like a single Windows session
  "$WORK/wine" reg add 'HKCU\Software\Wine\Explorer' /v Desktop /d Default /f >/dev/null 2>&1
  "$WORK/wine" reg add 'HKCU\Software\Wine\Explorer\Desktops' /v Default /d 1280x800 /f >/dev/null 2>&1
fi

LOG="$WORK/probe.log"
LOG_ARG="Z:$(echo "$LOG" | sed 's#/#\\#g')"
printf '#!/bin/sh\nexec "%s" "%s" "$@"\n' "$WORK/wine" "$WORK/helper/win32-native-input.exe" > "$WORK/helper.sh"
chmod +x "$WORK/helper.sh"
kill_wine() { env -i HOME="$HOME" PATH=/usr/bin:/bin WINEPREFIX="$WORK/prefix" wineserver -k 2>/dev/null || true; sleep 1; }

status=0
echo "== helper end-to-end"
kill_wine
node "$ROOT/tests/input/helper-e2e.mjs" --helper "$WORK/helper/win32-native-input.exe" --probe "$WORK/probe/input-probe.exe" \
  --log "$LOG" --log-arg "$LOG_ARG" --runner "$WORK/wine" || status=1

if [ -n "$ORION_MJS" ]; then
  echo "== JS layer end-to-end ($ORION_MJS, patched)"
  node "$ROOT/tools/hotfix/patch-input-v1.2.0.mjs" "$ORION_MJS" "$WORK/orion.patched.mjs"
  kill_wine
  node "$ROOT/tests/input/js-driver-e2e.mjs" --orion "$WORK/orion.patched.mjs" --helper "$WORK/helper.sh" \
    --probe "$WORK/probe/input-probe.exe" --log "$LOG" --log-arg "$LOG_ARG" --runner "$WORK/wine" || status=1
fi
kill_wine
exit $status
