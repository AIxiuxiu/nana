!define PRODUCT_PATHNAME 			    "${APP_FILENAME}_staging"  # 安装卸载项用到的KEY
!define INSTALL_APPEND_PATH       "nanaGSTAGING"	  # 安装路径追加的名称

!define EXE_NAME               		"${PRODUCT_NAME}.exe" # 指定主运行程序，快捷方式也是用此程序生成
!define SETUP_NAME                "${APP_PACKAGE_NAME}"
!define PRODUCT_LEGAL          		"${COMPANY_NAME} Copyright（c）2021"
!define INSTALL_OUTPUT_NAME    		"${APP_PACKAGE_NAME}-${VERSION}.exe"

# ====================== 自定义宏 安装信息==============================
!define INSTALL_RES_PATH       		  "${PROJECT_DIR}\build\skin.zip"
!define INSTALL_LICENCE_FILENAME    "licence.txt"
!define INSTALL_LICENCE_FILE        "${PROJECT_DIR}\build_resources\win\${INSTALL_LICENCE_FILENAME}"
!define INSTALL_ICO 				        "${MUI_ICON}"
!define UNINSTALL_ICO               "${MUI_UNICON}"
#修改为你自定义的URL Protocol
!define SCHEMENAME                  "nanaqjkhdg"

!addplugindir /x86-unicode "${PROJECT_DIR}\build_resources\nsis\plugins\x86-unicode"

!addincludedir "${PROJECT_DIR}\build_resources\nsis\includes"


!include "ui.nsh"

# ==================== NSIS属性 ================================

# 针对Vista和win7 的UAC进行权限请求.
# RequestExecutionLevel none|user|highest|admin
RequestExecutionLevel admin

#SetCompressor zlib

; 安装包名字.
Name "${SETUP_NAME}"

# 安装程序文件名.
OutFile "${PROJECT_DIR}\build\${INSTALL_OUTPUT_NAME}"


InstallDir "1"

# 安装和卸载程序图标
Icon              "${INSTALL_ICO}"
UninstallIcon     "${UNINSTALL_ICO}"
