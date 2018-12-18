
Invoke-Command -ComputerName WASSV076 -ScriptBlock {

    del c:\deployNew\build
    del c:\deployNew\main.exe
}

Copy-Item .\frontend\gui-delegacje\build \\wassv076\C$\deployNew -Recurse
Copy-Item .\backend\main.exe \\wassv076\C$\deployNew -Recurse

Invoke-Command -ComputerName WASSV076 -ScriptBlock {
    cd c:\deployNew
    
    #docker stop delegacje

    docker build -t delegacje:stage13 .
    docker run -p 5000:5000 -p 8080:8080 --name delegacje delegacje:stage13

}
