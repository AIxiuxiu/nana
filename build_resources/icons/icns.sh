echo "***************** 欢迎使用 icns 生成器 *****************"
echo "--> 脚本开始执行 "
echo "--> 请先确保需要转换的PNG图片文件在脚本所在的当前文件夹，并且大小为 1024x1024 ~ "
read -p "--> 请输入需要转换的PNG图片的名称(默认icon)：" filename
if [ "$filename" = "" ] 
then 
    filename="icon" 
fi 
temp_path="$filename.iconset"
echo "--> 创建临时文件夹 $temp_path"
mkdir $temp_path
echo "--> 临时文件夹创建完毕，准备创建临时图片~"
sips -z 16 16     $filename.png --out $temp_path/icon_16x16.png
sips -z 32 32     $filename.png --out $temp_path/icon_16x16@2x.png
sips -z 32 32     $filename.png --out $temp_path/icon_32x32.png
sips -z 64 64     $filename.png --out $temp_path/icon_32x32@2x.png
sips -z 64 64     $filename.png --out $temp_path/icon_64x64.png
sips -z 128 128   $filename.png --out $temp_path/icon_64x64@2x.png
sips -z 128 128   $filename.png --out $temp_path/icon_128x128.png
sips -z 256 256   $filename.png --out $temp_path/icon_128x128@2x.png
sips -z 256 256   $filename.png --out $temp_path/icon_256x256.png
sips -z 512 512   $filename.png --out $temp_path/icon_256x256@2x.png
sips -z 512 512   $filename.png --out $temp_path/icon_512x512.png
sips -z 1024 1024 $filename.png --out $temp_path/icon_512x512@2x.png
echo "--> 临时图片创建完毕，准备生成 icns 文件"
iconutil -c icns $temp_path -o $filename.icns
echo "--> icns 文件生成完毕，准备清理临时文件"
rm -rf $temp_path
echo "--> 临时文件清理完毕"
echo "***************** icns 生成完毕 *****************"