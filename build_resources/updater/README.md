## 安装

安装 golang 环境

安装 goversioninfo

```
go get github.com/josephspurrier/goversioninfo/cmd/goversioninfo
```

## 生成 exe

生成两种updater程序，

1. 管理员权限的

1、执行命令`go generate`生成信息文件syso 
2、执行命令生成exe
```
GOOS=windows GOARCH=386 go build -ldflags "-s -w -H=windowsgui" -o qjUpdater.exe
```

2. 
1、注释 goversioninfo.exe.manifest 中的 trustInfo
1、执行命令`go generate`生成信息文件syso 
2、执行命令生成exe
```
GOOS=windows GOARCH=386 go build -ldflags "-s -w -H=windowsgui" -o updater.exe
```
