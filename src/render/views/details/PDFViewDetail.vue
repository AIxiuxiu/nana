<template>
  <iframe ref="iframe" v-loading="loading" width="100%" height="100%" frameborder="no" marginwidth="0" :src="iframeSrc" @load="iframeLoad"></iframe>
</template>

<script setup lang="ts">
/**
 * iframe详情页
 */
import { useDetailParams } from '@/hooks/useDetailModal';
import { PropType, ref } from 'vue';
defineProps({
  pdf: {
    type: String,
    default: ''
  },
  theme: {
    type: String as PropType<'min' | 'simple'>,
    default: ''
  }
});

const pdfViewer = import.meta.env.VITE_APP_PDF_VIEWER?.toString();

const loading = ref(false);

const iframeSrc = ref(pdfViewer);

useDetailParams(({ pdf, theme }) => {
  iframeSrc.value = ''; //清理数据
  loading.value = true;
  iframeSrc.value = `${pdfViewer}?file=${encodeURIComponent(pdf)}&theme=${theme}`;
});

const iframe = ref<HTMLIFrameElement>(null);
function iframeLoad() {
  loading.value = false;
}
</script>
