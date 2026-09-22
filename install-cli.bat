@echo off
setlocal
cd /d "%~dp0"
echo [*] Installing ORION Global Command Line Interface...
node bin\install-cli.js
pause
