echo "***************** 欢迎使用 ico 生成器 *****************"
echo "--> 脚本开始执行 "
echo "--> 请先确保需要转换的PNG图片文件在脚本所在的当前文件夹，并且大小为 256*256 ~ "
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
sips -z 32 32     $filename.png --out $temp_path/icon_32x32.png
sips -z 64 64     $filename.png --out $temp_path/icon_64x64.png
sips -z 128 128   $filename.png --out $temp_path/icon_128x128.png
sips -z 256 256   $filename.png --out $temp_path/icon_256x256.png
echo "--> 临时图片创建完毕，准备生成 ico 文件"
icotool -c -r $temp_path/icon_16x16.png -r $temp_path/icon_32x32.png -r $temp_path/icon_64x64.png -r $temp_path/icon_128x128.png -r $temp_path/icon_256x256.png -o $filename.ico
echo "--> ico 文件生成完毕，准备清理临时文件"
rm -rf $temp_path
echo "--> 临时文件清理完毕"
echo "***************** ico 生成完毕 *****************"