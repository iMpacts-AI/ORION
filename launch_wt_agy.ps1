$workers = @('ORION RIP', 'ORION BUILD', 'ORION QA', 'ORION ARCH', 'ORION UX', 'ORION RE', 'ORION SECU')

foreach ($w in $workers) {
    Start-Process wt.exe -ArgumentList "-w", "0", "new-tab", "--title", "$w", "-d", "C:\Users\smsaq\Downloads\ORION", "C:\Users\smsaq\AppData\Local\agy\bin\agy.exe"
    Start-Sleep -Milliseconds 500
}
