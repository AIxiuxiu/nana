<template>
  <div class="editor-box">
    <div :id="`mytoolbar${id}`"></div>
    <el-scrollbar :style="{ height: height + 'px' }" wrap-class="editor-view">
      <!-- https://www.tiny.cloud/my-account/dashboard/?already-logged-in -->
      <Editor
        :id="id"
        v-model="contentValue"
        api-key="6rp9cznmx9b9t9yhdr4m0vbt1lal0tmzqb5irjx5xntcm63a"
        :style="{ minHeight: height + 'px' }"
        :init="init"
        :disabled="disabled"
        tinymce-script-src="/tinymce/tinymce.min.js"
        @onClick="onClick"
        @change="onChange"
        @init="onInit"
        @beforeinput="onBeforeinput"
      />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
//引入tinymce编辑器
import { QjFileType, useUpload } from '@/hooks/useUpload';
import Editor from '@tinymce/tinymce-vue';
import { ElMessage } from 'element-plus';
import { PropType, onUnmounted, ref, watch } from 'vue';

// 使用public文件下 tinymce，版本5.10.0
// 下载地址：https://www.tiny.cloud/get-tiny/self-hosted/

/**
 * 编辑器组件
 */
const props = defineProps({
  id: {
    type: String,
    default: () => {
      return Date.now();
    }
  },
  modelValue: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 400
  },
  disabled: {
    type: Boolean,
    default: false
  },
  plugins: {
    type: [String, Array],
    default: 'link autolink visualblocks visualchars directionality searchreplace image table lists nonbreaking textpattern powerpaste wordcount powerpaste'
  },
  toolbar: {
    type: [String, Array],
    default:
      'undo redo | formatselect | fontselect fontsizeselect bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify| bullist numlist indent outdent lineheight | table | image link | removeformat'
  },
  wordlimitMax: {
    // 字数限制，默认不限制
    type: Number,
    default: 0
  },
  powerpasteType: {
    // 粘贴方式，默认提示选择
    type: String as PropType<'propmt' | 'clean' | 'merge'>,
    default: 'propmt'
  }
});

//data里面写入初始配置
const init = {
  language_url: 'tinymce/langs/zh_CN.js', //引入语言包文件
  language: 'zh_CN', //语言类型
  skin_url: 'tinymce/skins', //皮肤：浅色

  contextmenu: 'copy paste | link image inserttable',
  plugins: props.wordlimitMax > 0 ? props.plugins + ' wordlimit' : props.plugins, //插件配置
  toolbar: props.toolbar, //工具栏配置，设为false则隐藏

  powerpaste_word_import: props.powerpasteType, // 参数可以是propmt, merge, clear，效果自行切换对比
  powerpaste_html_import: props.powerpasteType, // propmt, merge, clear
  powerpaste_googledocs_import: props.powerpasteType,
  powerpaste_allow_local_images: true,

  menubar: false, //菜单栏配置，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”

  fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px', //字体大小
  font_formats:
    '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;', //字体样式
  lineheight_formats: '0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5', //行高配置，也可配置成"12px 14px 16px 20px"这种形式

  placeholder: '在这里输入文字',
  branding: false, //tiny技术支持信息是否显示
  resize: false, //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
  statusbar: false, //最下方的元素路径和字数统计那一栏是否显示
  elementpath: false, //元素路径是否显示
  autosave_ask_before_unload: false, //禁止弹出保存提示

  selector: `#${props.id}`,
  inline: true,
  toolbar_persist: true,
  fixed_toolbar_container: `#mytoolbar${props.id}`,
  // height: props.height, //注：引入autoresize插件时，此属性失效, inline模式去掉
  toolbar_mode: 'sliding',
  content_style: 'img {max-width:100%;}', //直接自定义可编辑区域的css样式
  content_css: 'tinymce/skins/content.css', //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入

  // images_upload_url: '/apib/api-upload/uploadimg',  //后端处理程序的url，建议直接自定义上传函数image_upload_handler，这个就可以不用了
  // images_upload_base_path: '/demo',  //相对基本路径--关于图片上传建议查看--http://tinymce.ax-z.cn/general/upload-images.php
  paste_data_images: true, //图片是否可粘贴
  images_upload_handler: (blobInfo, success, failure) => {
    if (blobInfo.blob().size / 1024 / 1024 > 2) {
      failure('上传失败，图片大小请控制在 2M 以内');
    } else {
      let formdata = new FormData();
      formdata.append('file', blobInfo.blob(), blobInfo.filename());
      useUpload(QjFileType.public, blobInfo.blob())
        .then((data) => {
          if (data && data.url) {
            success(data.url);
          } else {
            failure();
          }
        })
        .catch(() => {
          failure();
        });
    }
  },
  wordlimit: {
    max: props.wordlimitMax, // 最多可以输入多少字
    spaces: false, // 是否含空格
    isInput: false, // 是否在超出后还可以输入
    // 自定义的提示方法, 默认用编辑器自带
    wordlimitCallback: function (e) {
      // e.maxCount   // 配置的最大输入字数
      // e.wordCount  // 已输入的字数
      // e.preCount    // 粘贴进来的内容字数，可以用来单独提示粘贴内容时超出的计算
      // e.isPaste       // 是否是粘贴输入
      // e.oldContent

      contentValue.value = e.oldContent;
      var beyond = 0;
      if (e.wordCount > e.maxCount) {
        beyond = e.wordCount - e.maxCount;
      }
      ElMessage.warning('最多只能输入' + e.maxCount + '个字' + (beyond > 0 ? '，已超出' + beyond + '个字，超出部分无法保存' : '。'));
    }
  }
};

const emits = defineEmits(['update:modelValue', 'onClick', 'onChange', 'onInit', 'onBeforeinput']);

function onClick(e) {
  emits('onClick', e);
}

function onChange(e) {
  emits('onChange', e);
}

function onInit(e) {
  emits('onInit', e);
}

function onBeforeinput(e) {
  emits('onBeforeinput', e);
}

function clear() {
  contentValue.value = '';
}
const contentValue = ref(props.modelValue);

onUnmounted(() => {
  window.tinymce.remove(`#${props.id}`);
});

watch(
  () => props.modelValue,
  (newVal) => {
    contentValue.value = newVal;
  }
);

watch(
  () => contentValue.value,
  (newVal) => {
    emits('update:modelValue', newVal);
  }
);
</script>

<style lang="scss" scoped>
:deep(.editor-view) {
  border: 1px solid #ccc;
  border-top: none;
}

.editor-box {
  width: 100%;
}
</style>
