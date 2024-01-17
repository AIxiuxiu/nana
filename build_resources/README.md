# 打包资源

## icons 图标

icon.ico window 系统图标
icon.icns macOS 系统图标

### icns

icns 使用最小 1024x1024 大小的 png 生成，使用 `icns.sh` 脚本生成,
如果无法运行请执行 `chmod 777 icns.sh` 赋予权限

### ico

安装 `icoutils`
mac 安装 `brew install icoutils`
ico 使用最小 256x256 大小的 png 生成，使用 `ico.sh` 脚本生成,
如果无法运行请执行 `chmod 777 ico.sh` 赋予权限

## mac

### dmg 背景图

dmg_bg.tiff MacOS 打包 dmg 的背景图

通过一下命令生成 tiff 图

```
tiffutil -cathidpicheck dmg_bg.png dmg_bg@2x.png -out dmg_bg.tiff
```

### entitlements.mac

mac 申请权限文件，用于公证

### license

MacOS dmg 使用协议，把一下两个文件添加到*build 文件夹*中
license_zh_CN.txt

### developerIDApp.p12

打包证书

## win

### 图标

*logo.ico* 和 *uninst.ico* 是 Window 系统图标名称无法更改

### licence

Window 用户协议
licence.txt 文件 编码 GB 2313

## nsis

Windows 打包脚本
skin 文件更改需重新生成 skin.zip 压缩文件到*build 文件夹*中

windows 改成32位打包，要改成64位需要 修改niss中 `APP_32` 为 `APP_64`
