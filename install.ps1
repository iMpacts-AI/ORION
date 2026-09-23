# ==============================================================================
# ORION AI Command System — Universal 1-Line Remote & Local Installer
# Can be run via:
#   irm https://raw.githubusercontent.com/iMpacts-AI/ORION/main/install.ps1 | iex
# ==============================================================================

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = "Stop"

Write-Host @"
`e[36m   ___  ____  ___ ___  _  _ 
  / _ \|  _ \|_ _/ _ \| \| |
 | | | | |_) || | | | | .` |
 | |_| |  _ < | | |_| | |\ |
  \___/|_| \_\___\___/|_| \_|`e[0m
 `e[90m┌─────────────────────────────────────────────────────────────┐`e[0m
 `e[90m│`e[0m `e[1mORION AI Command System`e[0m — Global Desktop Installer         `e[90m│`e[0m
 `e[90m│`e[0m https://github.com/iMpacts-AI/ORION                         `e[90m│`e[0m
 `e[90m└─────────────────────────────────────────────────────────────┘`e[0m
"@

# 1. Verify Node.js Environment
Write-Host "`n[*] Checking system prerequisites..." -ForegroundColor Cyan
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "[!] Node.js not detected on this machine." -ForegroundColor Yellow
    $winget = Get-Command winget -ErrorAction SilentlyContinue
    if ($winget) {
        Write-Host "[+] Attempting automated Node.js installation via winget..." -ForegroundColor Cyan
        try {
            winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements --silent
            Write-Host "[✓] Node.js installed. Please restart your terminal and re-run this command." -ForegroundColor Green
            exit 0
        } catch {
            Write-Host "[!] Winget installation could not complete automatically." -ForegroundColor Red
        }
    }
    Write-Host "`n[X] Please install Node.js (v18+ or v22 LTS) from: https://nodejs.org/" -ForegroundColor Red
    Write-Host "[X] Then re-run this installer.`n" -ForegroundColor Red
    exit 1
} else {
    $nodeVersion = & node -v
    Write-Host "[✓] Node.js runtime detected: $nodeVersion" -ForegroundColor Green
}

# 2. Determine Installation Target Directory
$currentDir = Get-Location
$isOrionRepo = (Test-Path "$currentDir\package.json") -and (Test-Path "$currentDir\bin\orion.js")

if ($isOrionRepo) {
    $installDir = $currentDir.Path
    Write-Host "[+] Installing directly from local repository: $installDir" -ForegroundColor Cyan
} else {
    $installDir = Join-Path $env:USERPROFILE "ORION"
    Write-Host "[+] Target installation path: $installDir" -ForegroundColor Cyan

    if (-not (Test-Path $installDir)) {
        New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    }

$ProgressPreference = "SilentlyContinue"

    $gitCmd = Get-Command git -ErrorAction SilentlyContinue
    if ($gitCmd) {
        Write-Host "[+] Cloning latest ORION from GitHub (shallow fast-clone mode)..." -ForegroundColor Cyan
        if (Test-Path "$installDir\.git") {
            Set-Location $installDir
            git pull origin main
        } else {
            git clone --depth 1 --single-branch https://github.com/iMpacts-AI/ORION.git $installDir
            Set-Location $installDir
        }
    } else {
        Write-Host "[+] Git not found. Downloading latest archive from GitHub..." -ForegroundColor Cyan
        $zipUrl = "https://github.com/iMpacts-AI/ORION/archive/refs/heads/main.zip"
        $tempZip = Join-Path $env:TEMP "ORION-main.zip"
        
        Invoke-WebRequest -Uri $zipUrl -OutFile $tempZip -UseBasicParsing
        Write-Host "[+] Extracting archive..." -ForegroundColor Cyan
        
        $tempExtract = Join-Path $env:TEMP "ORION-extract"
        if (Test-Path $tempExtract) { Remove-Item -Path $tempExtract -Recurse -Force }
        Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force
        
        Copy-Item -Path "$tempExtract\ORION-main\*" -Destination $installDir -Recurse -Force
        Remove-Item -Path $tempZip -Force -ErrorAction SilentlyContinue
        Remove-Item -Path $tempExtract -Recurse -Force -ErrorAction SilentlyContinue
        Set-Location $installDir
    }
}

# 3. Install Dependencies & Build
Set-Location $installDir

if (-not (Test-Path "node_modules")) {
    Write-Host "`n[*] Installing project dependencies (ultra-fast mode: --no-audit --prefer-offline)..." -ForegroundColor Cyan
    npm install --prefer-offline --no-audit --no-fund --progress=false
}

if ((-not (Test-Path "dist\index.html")) -or (-not (Test-Path "dist-electron\main\index.js"))) {
    Write-Host "`n[*] Compiling production bundles (npm run build)..." -ForegroundColor Cyan
    npm run build
} else {
    Write-Host "[✓] Pre-compiled production bundles verified. Build step skipped (instant launch ready)." -ForegroundColor Green
}

# 4. Register Global CLI & Windows PATH
Write-Host "`n[*] Registering global CLI command and desktop shortcuts..." -ForegroundColor Cyan
node bin\install-cli.js

Write-Host @"

`e[32m======================================================================
       ORION IS NOW INSTALLED AND READY ON THIS COMPUTER!
======================================================================`e[0m

You can now open ANY Command Prompt or PowerShell and type:

  `e[33m> orion`e[0m           Launch ORION desktop application immediately
  `e[33m> orion demo`e[0m      Launch directly into Coders HQ Showcase mode
  `e[33m> orion dev`e[0m       Launch in developer mode with live reload
  `e[33m> orion doctor`e[0m    Check system diagnostics & health

"@
