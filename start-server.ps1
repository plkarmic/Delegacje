Start-Process -FilePath C:\www\main.exe -WorkingDirectory C:\www
Start-Process C:\NodeLTS\node-v11.4.0-win-x64\serve.cmd -ArgumentList "-s build -l 80" -WorkingDirectory C:\www -Wait