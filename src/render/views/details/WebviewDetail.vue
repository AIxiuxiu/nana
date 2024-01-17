<template>
  <iframe ref="iframe" v-loading="loading" width="100%" height="100%" frameborder="no" marginwidth="0" marginheight="0" :src="iframeSrc" @load="iframeLoad"></iframe>
</template>

<script setup lang="ts">
/**
 * iframe详情页
 */
import { useDetailParams } from '@/hooks/useDetailModal';
import { ref } from 'vue';
defineProps({
  src: {
    type: String,
    default: ''
  }
});

const loading = ref(false);
const iframeSrc = ref('');
useDetailParams(({ src }) => {
  iframeSrc.value = ''; //清理数据
  loading.value = true;
  iframeSrc.value = src;
});

const iframe = ref<HTMLIFrameElement>(null);
function iframeLoad() {
  try {
    const document = iframe.value.contentWindow.document;
    if (!document) return;
    const styleElem = document.createElement('style');
    styleElem.innerHTML = `
        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        ::-webkit-scrollbar-thumb{
            background-color: #999;
            -webkit-border-radius: 5px;
            border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:vertical:hover{
            background-color: #666;
        }
        ::-webkit-scrollbar-thumb:vertical:active{
            background-color: #333;
        }
        ::-webkit-scrollbar-button{
            display: none;
        }
        ::-webkit-scrollbar-track{
            background-color: #f1f1f1;
        }`;
    document.head.appendChild(styleElem);
  } catch (error) {
    console.log('iframe 跨域');
  }
  loading.value = false;
}
</script>
