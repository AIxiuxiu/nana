<template>
  <el-dialog custom-class="qrcode-dialog" width="500px" :model-value="modelValue" :title="title" @close="handleClose">
    <el-row>
      <el-col :span="12" class="text-center">
        <div ref="qrcode">
          <QrcodeVue :value="url" :size="size" level="H"></QrcodeVue>
        </div>
      </el-col>
      <el-col :span="12" class="right-content">
        <el-tooltip v-model:visible="copied" :manual="true" effect="dark" content="已复制" placement="top">
          <el-button type="primary" class="w-100" plain @click="copy()">复制链接</el-button>
        </el-tooltip>
        <el-button type="primary" class="marginT20 w-100" plain @click="downloadQrCode">下载二维码</el-button>
      </el-col>
    </el-row>
    <div v-if="tips" class="marginT30 marginB30">
      <i class="dot-warning" />
      注：{{ tips }}
    </div>
    <template #footer>
      <div class="footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * 二维码
 */
import { useClipboard } from '@/hooks/useClipboard';
import QrcodeVue from 'qrcode.vue';
import { ref, watchEffect } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 150
  },
  title: {
    type: String,
    default: '二维码'
  },
  imgName: {
    type: String,
    default: 'qrcode'
  },
  tips: {
    type: String,
    default: ''
  }
});
const copyUrl = ref('');
watchEffect(() => {
  if (props.url) {
    copyUrl.value = props.url;
  }
});
const { copy, copied, isSupported } = useClipboard({ source: copyUrl });
const qrcode = ref(null);
const downloadQrCode = () => {
  const canvas = qrcode.value.getElementsByTagName('canvas')[0];
  const url = canvas.toDataURL('image/png', 2.0); // 通过 toDataURL 返回一个包含图片展示的 data URI
  const aDom = document.createElement('a');
  aDom.download = `${props.imgName}.png`; // 设置下载的文件名
  aDom.href = url;
  document.body.appendChild(aDom);
  aDom.click();
  aDom.remove();
};

const emits = defineEmits(['update:modelValue', 'refresh']);
function handleClose() {
  emits('update:modelValue', false);
}
</script>
<style lang="scss" scoped>
.qrcode-dialog {
  .right-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .el-button {
      margin-left: 0;
    }
  }
  .url {
    font-size: $font-size-medium;
    color: $primary-color;
    padding: 10px 0;
  }
  .w-100 {
    width: 100px;
  }
}
</style>

<style lang="scss">
.qrcode-dialog {
  .el-dialog__body {
    padding: var(--el-dialog-padding-primary) var(--el-dialog-padding-primary) 5px;
  }
}
</style>
