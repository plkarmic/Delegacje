FROM microsoft/nanoserver

SHELL [ "powershell", "-Command", "$ErrorActionPreference = 'SilentlyContinue'; $ProgressPreference = 'SilentlyContinue';" ]

RUN mkdir 'C:\\Node'
RUN Invoke-WebRequest -Uri https://nodejs.org/download/release/latest/node-v10.11.0-win-x64.zip -OutFile 'C:\\Node\\node.zip'
RUN cd 'C:\\Node'
RUN Expand-Archive C:\\Node\\node.zip -DestinationPath 'C:\\NodeLTS'
# how to change expand directory??

# SET NODE ENV => production

RUN mkdir C:\www
COPY build C:\\www\\build
COPY main.exe C:\\www\\main.exe
COPY CountryTable1.json C:\\www\\CountryTable1.json

EXPOSE 5000 8080

# node-v10.11.0-win-x64\serve.cmd
# RUN 'C:\\NodeLTS\\node-v10.11.0-win-x64\\npm.cmd install -g serve'


RUN cd C:\www\
# RUN C:\\NodeLTS\\node-v10.11.0-win-x64\\serve.cmd -s build