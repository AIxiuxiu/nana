# 常用脚本

## preinstall.js 和 postinstall.js

安装相关依赖和统一使用使用 `yarn`

## build-main.js

打包和启动 electron 主文件

## build-preload.js

打包和启动 electron preload

## build-electron.js

打包 electron

debug 模式 ：`node script/build-electron --debug`

注意事项：
**上传更新文件需提交说明，前台测试人员可看到，不要乱写**

## afterPackHook.js

APP 编译完成之后的钩子，主要添加更新代码（update.asar 替换 app.asar）
生成更新文件

## afterSignHook.js

APP 签名之后的钩子，用于 MacOS 进行公证

## afterAllArtifactBuildHook.js

APP 打包完成之后的钩子，用于上传更新文件和 APP 安装文件（测试环境）

## 注意事项

### MacSO 打包

安装证书，证书在 build_resources/mac/developerIDApp.p12，需添加环境变量
export CSC_LINK=".../developerIDApp.p12"
