Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -File ""C:\Users\macda\Documents\Github\leekduck_scraper\windows\leekduck_scraper.ps1""", 0, False
