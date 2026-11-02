# ==============================================================================
# ORION installer — Windows (PowerShell 5.1+ / 7+)
#
#   irm https://raw.githubusercontent.com/iMpacts-AI/ORION/main/install.ps1 | iex
#
# Installs the packaged ORION CLI from the latest GitHub release, verifies its
# SHA-256 checksum, and adds the `orion` command for the current user (no admin).
#
# Options (environment variables):
#   ORION_VERSION      release tag to install        (default: latest)
#   ORION_INSTALL_DIR  where ORION is installed      (default: %LOCALAPPDATA%\orion-cli)
#   ORION_NO_PATH=1    don't add ORION to the user PATH
# ==============================================================================
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Repo = 'iMpacts-AI/ORION'
$MinNodeMajor = 18
$InstallRoot = if ($env:ORION_INSTALL_DIR) { $env:ORION_INSTALL_DIR } else { Join-Path $env:LOCALAPPDATA 'orion-cli' }
$AppDir = Join-Path $InstallRoot 'app'
$BinDir = Join-Path $InstallRoot 'bin'
$BaseUrl = if ($env:ORION_VERSION) { "https://github.com/$Repo/releases/download/$($env:ORION_VERSION)" } else { "https://github.com/$Repo/releases/latest/download" }

function Info($m) { Write-Host "[*] $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "[OK] $m" -ForegroundColor Green }
function Fail($m) { Write-Host "[X] $m" -ForegroundColor Red; throw $m }

Write-Host ''
Write-Host '  ORION - You tell it. ORION does it.' -ForegroundColor White
Write-Host '  ------------------------------------' -ForegroundColor DarkGray

# --- Node.js ---------------------------------------------------------------
function Get-NodeMajor {
  $n = Get-Command node -ErrorAction SilentlyContinue
  if (-not $n) { return 0 }
  return [int](& node -p "process.versions.node.split('.')[0]")
}
if ((Get-NodeMajor) -lt $MinNodeMajor) {
  Info "Node.js $MinNodeMajor+ not found - installing Node.js LTS..."
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Fail "Please install Node.js LTS from https://nodejs.org and run this command again."
  }
  winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements --silent | Out-Null
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
  if ((Get-NodeMajor) -lt $MinNodeMajor) { Fail "Node.js install did not complete. Install it from https://nodejs.org and retry." }
}
$NodeExe = (Get-Command node).Source
Ok "Node.js $(& node -v)"

# --- Download + verify --------------------------------------------------------
$Tmp = Join-Path $env:TEMP ("orion-install-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $Tmp | Out-Null
try {
  Info 'Downloading ORION...'
  $Zip = Join-Path $Tmp 'orion-cli.zip'
  Invoke-WebRequest "$BaseUrl/orion-cli.zip" -OutFile $Zip -UseBasicParsing
  $Sums = (Invoke-WebRequest "$BaseUrl/SHA256SUMS.txt" -UseBasicParsing).Content
  if ($Sums -is [byte[]]) { $Sums = [Text.Encoding]::UTF8.GetString($Sums) }
  $Expected = ($Sums -split "`n" | Where-Object { $_ -match '\sorion-cli\.zip\s*$' } | ForEach-Object { ($_ -split '\s+')[0] } | Select-Object -First 1)
  $Actual = (Get-FileHash -Algorithm SHA256 $Zip).Hash.ToLower()
  if (-not $Expected -or $Expected.ToLower() -ne $Actual) { Fail 'Download failed its integrity check (SHA-256 mismatch). Nothing was installed.' }
  Ok 'Download verified (SHA-256)'

  # --- Install -------------------------------------------------------------------
  Expand-Archive -Path $Zip -DestinationPath $Tmp -Force
  if (Test-Path $AppDir) { Remove-Item -LiteralPath $AppDir -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $InstallRoot, $BinDir | Out-Null
  Move-Item -LiteralPath (Join-Path $Tmp 'orion-cli') -Destination $AppDir

  $Shim = "@echo off`r`n`"$NodeExe`" `"%~dp0..\app\orion.mjs`" %*`r`n"
  [IO.File]::WriteAllText((Join-Path $BinDir 'orion.cmd'), $Shim, [Text.Encoding]::ASCII)
} finally {
  Remove-Item -LiteralPath $Tmp -Recurse -Force -ErrorAction SilentlyContinue
}

if ($env:ORION_NO_PATH -ne '1') {
  $UserPath = [Environment]::GetEnvironmentVariable('Path', 'User')
  if (-not (($UserPath -split ';') -contains $BinDir)) {
    [Environment]::SetEnvironmentVariable('Path', ($BinDir + ';' + $UserPath).TrimEnd(';'), 'User')
  }
  $env:Path = $BinDir + ';' + $env:Path
}

$Version = (& $NodeExe (Join-Path $AppDir 'orion.mjs') --version) -replace '^ORION ', ''
Write-Host ''
Ok "ORION $Version installed. Open a new terminal and type: orion"
