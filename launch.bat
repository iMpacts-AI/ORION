@echo off
if exist "%~dp0release\win-unpacked\ORION.exe" (
    start "" "%~dp0release\win-unpacked\ORION.exe"
) else if exist "%~dp0..\ORION-App\ORION.exe" (
    start "" "%~dp0..\ORION-App\ORION.exe"
) else (
    echo ORION.exe not found. Run 'npm run build' first.
)
