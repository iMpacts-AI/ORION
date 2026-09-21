@echo off
set AGY="%LOCALAPPDATA%\agy\bin\agy.exe"
set REPO="%~dp0"

echo Launching ORION Avengers AGY Worker Terminals...

start "ORION RIP" cmd /k "title ORION RIP && cd /d %REPO% && %AGY%"
start "ORION BUILD" cmd /k "title ORION BUILD && cd /d %REPO% && %AGY%"
start "ORION QA" cmd /k "title ORION QA && cd /d %REPO% && %AGY%"
start "ORION ARCH" cmd /k "title ORION ARCH && cd /d %REPO% && %AGY%"
start "ORION UX" cmd /k "title ORION UX && cd /d %REPO% && %AGY%"
start "ORION RE" cmd /k "title ORION RE && cd /d %REPO% && %AGY%"
start "ORION SECU" cmd /k "title ORION SECU && cd /d %REPO% && %AGY%"

echo All 7 AGY worker terminals launched.
