<template>
  <el-upload
    ref="uploadRef"
    style="width: 100%; word-break: break-all"
    action=""
    :http-request="uploadFile"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :on-exceed="handleExceed"
    :on-change="handleChange"
    :accept="accept"
    multiple
    :limit="limit"
    :file-list="fileList"
  >
    <slot>
      <el-button plain type="primary">上传文件</el-button>
    </slot>
    <template #tip>
      <slot name="tip">
        <span class="margin15 el-upload__tip">
          <span>支持扩展名：{{ accept }}，</span>
          <span v-if="limitFileSize">文件不能大于{{ fileSize }}{{ fileSizeUnit.toUpperCase() }}</span>
        </span>
      </slot>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
/**
 * 上传附件
 */
import { QjFileType, useUpload } from '@/hooks/useUpload';
import { ElMessage, useFormItem } from 'element-plus';
import { PropType, nextTick, ref, watch } from 'vue';
import { MimeType } from './mimeType';

const props = defineProps({
  // 附件数组
  modelValue: {
    type: Array as PropType<{ id: string; name: string; size: number; url: string }[]>,
    default: () => {
      return [];
    }
  },
  // 上传的文件列表
  fileList: {
    type: Array as PropType<{ name: string; url: string }[]>,
    default: () => {
      return [];
    }
  },
  // 上传文件的路径 具体查看 QjFileType
  fileType: {
    type: String as PropType<QjFileType>,
    default: QjFileType.public
  },
  // 支持的文件类型
  accept: {
    type: String,
    default: '.gif,.jpg,.png,.doc,.docx,.pdf,.xls,.xlsx'
  },
  // 是否校验真实文件类型
  checkRealType: {
    type: Boolean,
    default: true
  },
  limit: {
    type: [Number, undefined],
    default: undefined
  },
  // 是否限制大小
  limitFileSize: {
    type: Boolean,
    default: true
  },
  // 限制文件大小 mb
  fileSize: {
    type: Number,
    default: 20
  },
  fileSizeUnit: {
    type: String as PropType<'kb' | 'KB' | 'mb' | 'MB'>,
    default: 'mb'
  },
  validateEvent: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits(['update:modelValue', 'change', 'success', 'remove']);

function beforeUpload(file) {
  // 附件类型判断
  if (props.accept && props.checkRealType) {
    // 获取限制类型的真实类型
    let trueTypeArray = [];
    for (let type of props.accept.split(',')) {
      type = type.toLowerCase();
      if (MimeType.get(type) != undefined) {
        trueTypeArray.push(MimeType.get(type));
      } else {
        ElMessage.error(`文件类型错误，支持文件类型为： ${props.accept}!`);
        return false;
      }
    }
    // 判断真实文件类型
    if (trueTypeArray.join().indexOf(file.type) == -1) {
      ElMessage.error(`文件类型错误，支持文件类型为： ${props.accept}!`);
      return false;
    }
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
      ElMessage.error(`文件大小不能超过 ${props.fileSize}${props.fileSizeUnit}!`);
      return false;
    }
  }
}

function uploadFile(param) {
  useUpload(props.fileType, param.file, (progress) => {
    param.onProgress(progress);
  })
    .then((data) => {
      param.onSuccess(data);
    })
    .catch((err) => {
      console.log('上传文件失败', err);
      param.onError();
    });
}

function handleExceed(files, fileList) {
  ElMessage.warning(`当前限制选择 ${props.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
}

const uploadRef = ref(null);

function getUploadFiles(uploadFiles) {
  return uploadFiles.map((v) => {
    return { name: v.name, size: v.size, id: v.response.id, url: v.response.url };
  });
}

const handleSuccess = async (response, file, fileList) => {
  const uploadFiles = getUploadFiles(fileList);
  emits('update:modelValue', uploadFiles);
  await nextTick();
  emits('change', fileList);
};

const handleRemove = async (file, fileList) => {
  const uploadFiles = getUploadFiles(fileList);
  emits('update:modelValue', uploadFiles);
  await nextTick();
  emits('change', fileList);
};

const handleChange = (file, fileList) => {
  // emits('update:modelValue', getUploadFiles());
  // emits('change', fileList);
};

// 清空已上传的文件列表
async function clearFiles() {
  uploadRef.value.clearFiles();
  emits('update:modelValue', []);
  await nextTick();
  emits('change', []);
}

defineExpose({ clearFiles });

const { formItem } = useFormItem();

watch(
  () => props.modelValue,
  (val) => {
    if (!val || val.length == 0) {
      uploadRef.value.clearFiles();
    }
    if (props.validateEvent) {
      formItem?.validate?.('change').catch((err) => console.error(err));
    }
  }
);

watch(
  () => props.fileList,
  (val) => {
    if (val && val.length != 0) {
      emits('update:modelValue', val);
    }
  },
  { immediate: true }
);
</script>
