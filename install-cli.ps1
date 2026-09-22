# ORION Global Command Line Interface Installer (PowerShell)
Set-Location -Path $PSScriptRoot
Write-Host "[*] Installing ORION Global Command Line Interface..." -ForegroundColor Cyan
& node "$PSScriptRoot\bin\install-cli.js"
