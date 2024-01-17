<template>
  <div v-loading="loading" class="upload-picture" :class="{ disabled: disabled }">
    <el-upload
      ref="upload"
      :disabled="disabled"
      class="picture-uploader"
      :style="{ width: imgSize.width * zoom + 'px', height: imgSize.height * zoom + 'px' }"
      :show-file-list="false"
      action="#"
      :multiple="false"
      :auto-upload="false"
      accept="image/jpeg,image/jpg,image/gif,image/png"
      :on-change="handleUploadChange"
    >
      <slot :value="modelValue">
        <div v-if="modelValue" style="width: 100%; height: 100%">
          <img :src="modelValue" class="picture" />
          <span v-if="showDelete && !disabled" class="upload-actions">
            <span class="upload-delete" @click.stop="handleFileRemove()">
              <el-icon :size="28">
                <delete />
              </el-icon>
            </span>
          </span>
        </div>
        <el-icon v-else :style="{ lineHeight: imgSize.height * zoom + 'px' }" class="picture-uploader-icon" :size="20">
          <plus />
        </el-icon>
      </slot>
    </el-upload>
    <div v-if="showTip" class="upload-tip">
      <slot name="tip">
        <span v-if="limitImgSize && limitFileSize"> 请上传图片大小为{{ imgSize.width }}*{{ imgSize.height }},且不超过{{ fileSize }}{{ fileSizeUnit.toUpperCase() }} </span>
        <span v-else-if="limitImgSize && !limitFileSize"> 请上传图片大小为{{ imgSize.width }}*{{ imgSize.height }}</span>
        <span v-else-if="!limitImgSize && limitFileSize"> 请上传图片大小不超过{{ fileSize }}{{ fileSizeUnit.toUpperCase() }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 上传图片 picture
 */
import { QjFileType, useImgSize, useIsImg, useUpload } from '@/hooks/useUpload';
import { Delete, Plus } from '@element-plus/icons';
import { ElMessage } from 'element-plus';
import { UploadFile } from 'element-plus/lib/components';
import { PropType, ref } from 'vue';

const props = defineProps({
  // 图片地址
  modelValue: {
    type: String,
    default: ''
  },
  // 上传文件的路径 具体查看 QjFileType
  fileType: {
    type: String as PropType<QjFileType>,
    default: QjFileType.public
  },
  // 限制图片尺寸
  limitImgSize: {
    type: Boolean,
    default: true
  },
  // 图片大小，
  imgSize: {
    type: Object as PropType<{ width: number; height: number }>,
    default: () => ({ width: 120, height: 120 })
  },
  // 图片展示缩放大小
  zoom: {
    type: Number,
    default: 1
  },
  // 是否限制图片大小
  limitFileSize: {
    type: Boolean,
    default: true
  },
  // 限制图片大小 kb
  fileSize: {
    type: Number,
    default: 500
  },
  fileSizeUnit: {
    type: String as PropType<'kb' | 'KB' | 'mb' | 'MB'>,
    default: 'kb'
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showTip: {
    type: Boolean,
    default: true
  },
  // 图片最大尺寸，
  maxImgSize: {
    type: Object as PropType<{ width: number; height: number }>,
    default: () => ({ width: 7680, height: 12000 })
  }
});

const emits = defineEmits(['update:modelValue', 'change']);
const loading = ref(false);
const handleUploadChange = (file: UploadFile) => {
  const isIMAGE = useIsImg(file.raw);
  if (!isIMAGE) {
    ElMessage.error('只能选择图片格式文件!');
    return;
  }
  if (props.limitFileSize) {
    let fileSize = file.size;
    if (props.fileSizeUnit.toLowerCase() == 'kb') {
      fileSize = file.size / 1024;
    } else {
      fileSize = file.size / 1024 / 1024;
    }
    const isLtSize = fileSize < props.fileSize;
    if (!isLtSize) {
      ElMessage.error(`图片大小不能超过 ${props.fileSize}${props.fileSizeUnit}!`);
      return;
    }
  }

  useImgSize(file.raw, props.imgSize, props.limitImgSize)
    .then((imgSize) => {
      if (imgSize.width > props.maxImgSize.width || imgSize.height > props.maxImgSize.height) {
        ElMessage.error(`图片尺寸不能超过${props.maxImgSize.width}×${props.maxImgSize.height}`);
      } else {
        updatedImg(file.raw);
      }
    })
    .catch((err) => {
      ElMessage.error(`图片大小不符和标准,尺寸应为${props.imgSize.width}×${props.imgSize.height}。
            当前上传图片的尺寸为：${err.width}×${err.height}`);
    });
};

function updatedImg(file: File) {
  loading.value = true;
  useUpload(props.fileType, file)
    .then((data) => {
      emits('update:modelValue', data.url);
      emits('change', data);
      loading.value = false;
    })
    .catch((err) => {
      console.log('update image error', err);
      loading.value = false;
    });
}

const handleFileRemove = () => {
  emits('update:modelValue', '');
};
</script>

<style lang="scss" scoped>
.picture-uploader {
  position: relative;
}

:deep(.el-upload) {
  height: 100%;
  width: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border: 1px dashed $primary-color;
  }
}

.disabled {
  :deep(.el-upload) {
    &:hover {
      border: 1px dashed #d9d9d9;
    }
  }
}

.picture-uploader-icon {
  height: 100%;
  width: 100%;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.picture {
  height: 100%;
  width: 100%;
}

.upload-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  .upload-delete {
    display: none;
  }
  &:hover {
    opacity: 0.8;
    .upload-delete {
      display: block;
    }
  }
}

.upload-tip {
  margin-top: 4px;
  font-size: 12px;
  color: $text-color-secondary;
}
</style>
