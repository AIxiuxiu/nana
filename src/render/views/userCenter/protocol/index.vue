<template>
  <el-scrollbar
    v-track="{ id: 'page_view', eventResource: '平台相关协议', elementId: `protocol`, parentElId: `userCenter` }"
    class="main-scrollbar"
    wrap-class="main-wrap"
    view-class="main-view"
  >
    <div class="content-card content-padding" style="padding-top: 10px">
      <el-tabs>
        <el-tab-pane label="服务协议" name="0">
          <iframe ref="iframe1" class="webview" width="100%" frameborder="no" marginwidth="0" marginheight="0" :src="userAgreement" @load="iframeLoad(iframe1)"></iframe>
        </el-tab-pane>
        <el-tab-pane label="隐私政策" name="1">
          <iframe ref="iframe2" class="webview" width="100%" frameborder="no" marginwidth="0" marginheight="0" :src="privacyAgreement" @load="iframeLoad(iframe2)"></iframe>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
/**
 * 平台相关协议
 */
const userAgreement = ref('https://www.nana.net/zt/user_agreement.htm');
const privacyAgreement = ref('https://www.nana.net/zt/privacy_agreement.htm');

const iframe1 = ref<HTMLIFrameElement>();
const iframe2 = ref<HTMLIFrameElement>();
function iframeLoad(iframe) {
  try {
    if (!iframe.value || !iframe.value.contentWindow) {
      return;
    }
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
}
</script>

<style lang="scss" scoped>
.webview {
  height: calc(100vh - 222px);
}
</style>
