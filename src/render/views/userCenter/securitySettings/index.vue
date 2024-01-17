<template>
  <el-scrollbar
    v-track="{ id: 'page_view', eventResource: '安全设置', elementId: `securitySettings`, parentElId: `userCenter` }"
    class="main-scrollbar"
    wrap-class="main-wrap"
    view-class="main-view"
  >
    <el-row class="container" :gutter="26">
      <el-col :span="12">
        <div class="content-card" style="padding: 10px 40px 26px 26px">
          <div>
            <div class="header">
              <span>手机号设置</span>
            </div>
            <div class="paddingR15">
              <el-form ref="form" label-position="right" label-width="100px" :model="phoneForm" :rules="rules">
                <el-form-item label="已绑手机号">
                  <el-input v-model="userInfo.mobile" :disabled="true" placeholder="未绑定手机号"></el-input>
                </el-form-item>
                <el-form-item label="新手机号" prop="mobile">
                  <el-input v-model="phoneForm.mobile" placeholder="请输入新手机号"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                  <el-input v-model="phoneForm.code" placeholder="请输入验证码">
                    <template #append>
                      <el-button :disabled="count != 0" @click="sendCode()">{{ countText }}</el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loading" @click="onSubmit">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div v-if="wxUserInfo" class="content-card content-padding">
          <div>
            <span>绑定微信</span>
          </div>
          <div class="wx-info">
            <div class="label">该账号已经绑定微信“{{ wxUserInfo?.nickname }}”</div>
            <img
              :src="
                wxUserInfo.headPortrait || 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
              "
              alt="头像"
            />
            <el-button size="small" type="success" plain @click="cancelThirdBand()">点击解除绑定该微信</el-button>
          </div>
        </div>
        <div v-else class="content-card bingwx">
          <div>
            <span>绑定微信</span>
          </div>
          <div class="paddingR15">
            <iframe :src="wxloginurl" frameborder="0" scrolling="no" width="300px" height="360px"></iframe>
          </div>
          <div>
            <el-button :icon="Refresh" round size="small" plain @click="refreshWxQR">刷新</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script setup lang="ts">
/**
 * 修改手机号
 */
import { UserApi } from '@/apis/userApi';
import { useCountDown } from '@/hooks/useCountDown';
import { useOnIpc, useRemoveAllIpc } from '@/hooks/useIpc';
import { useUserInfo } from '@/hooks/useUserInfo';
import { Refresh } from '@element-plus/icons';
import { ElMessage, ElMessageBox } from 'element-plus';
import qs from 'qs';
import { computed, onUnmounted, reactive, ref } from 'vue';
import { WX_CODE_RUL } from '../../../../common/event';

const phoneForm = reactive({
  mobile: '',
  code: ''
});

const { userInfo } = useUserInfo();

const rules = {
  mobile: [{ required: true, message: '新手机号不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
};

const form = ref<any>();
const loading = ref<any>(false);
const { start, count, countText } = useCountDown();
function sendCode() {
  form.value.validateField('mobile', async (valid) => {
    if (valid) {
      let res = await UserApi.sendSmsCode({ mobile: phoneForm.mobile, tempKey: 'IR_RESET_MOBILE' });
      if (res.code === 0) {
        start();
        ElMessage({ type: 'success', message: '验证码发送成功' });
      }
    }
  });
}

function onSubmit() {
  loading.value = true;
  form.value.validate(async (valid) => {
    if (valid) {
      let res = await UserApi.updateMobile({
        mobile: phoneForm.mobile,
        code: phoneForm.code
      });
      if (res && res.code === 0) {
        userInfo.mobile = phoneForm.mobile;
        form.value.resetFields();
        ElMessage({ type: 'success', message: '手机号设置成功' });
      }
    }
    loading.value = false;
  });
}

const appID = import.meta.env.VITE_APP_WX_APPID.toString();
const redirectUrl = encodeURIComponent(import.meta.env.VITE_APP_WX_REDIRECT_URL.toString());
const state = ref(Math.random().toString().slice(2));
// 微信样式中存在中文需要unicode编码并把u去掉再base64编码
// https://www.bejson.com/convert/unicode_chinese/
// https://tools.moemperor.com/base64/
/** 当前样式
.impowerBox .qrcode {width: 240px;}
.impowerBox .title {display: none;}
.impowerBox .info {width: 240px;}
.impowerBox .status_icon {width: 22px;height:22px;margin:0;}
.impowerBox .status {text-align: center;}
.impowerBox .status.status_browser p {display: none;}
.impowerBox .status.status_browser::before {content: '\4f7f\7528\5fae\4fe1\626b\4e00\626b\7ed1\5b9a\A\201c\5168\666f\670d\52a1\5e73\53f0\201d';white-space: pre;font-size: 13px;}
.impowerBox .status.status_succ p {display: none;}
.impowerBox .status.status_succ::after{content: '\5728\5fae\4fe1\4e2d\8f7b\89e6\5141\8bb8\5373\53ef\7ed1\5b9a';font-size: 13px;display: inline-block;}
.impowerBox .status.status_fail p, .impowerBox .status.status_fail h4 {display: none;}
.impowerBox .status.status_fail .status_txt::before{content: '\4f60\5df2\53d6\6d88\6b64\6b21\7ed1\5b9a';font-size: 16px;display: inline-block;}
.impowerBox .status.status_fail::after{content: '\4f60\53ef\518d\6b21\626b\63cf\7ed1\5b9a\ff0c\626b\7801\9519\8bef\8bf7\5237\65b0';font-size: 13px;display: inline-block;}
 */
const cssHref =
  'LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDI0MHB4O30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyNDBweDt9Ci5pbXBvd2VyQm94IC5zdGF0dXNfaWNvbiB7d2lkdGg6IDIycHg7aGVpZ2h0OjIycHg7bWFyZ2luOjA7fQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7fSAKLmltcG93ZXJCb3ggLnN0YXR1cy5zdGF0dXNfYnJvd3NlciBwIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLnN0YXR1cy5zdGF0dXNfYnJvd3Nlcjo6YmVmb3JlIHtjb250ZW50OiAnXDRmN2ZcNzUyOFw1ZmFlXDRmZTFcNjI2Ylw0ZTAwXDYyNmJcN2VkMVw1YjlhXEFcMjAxY1w1MTY4XDY2NmZcNjcwZFw1MmExXDVlNzNcNTNmMFwyMDFkJzt3aGl0ZS1zcGFjZTogcHJlO2ZvbnQtc2l6ZTogMTNweDt9Ci5pbXBvd2VyQm94IC5zdGF0dXMuc3RhdHVzX3N1Y2MgcCB7ZGlzcGxheTogbm9uZTt9Ci5pbXBvd2VyQm94IC5zdGF0dXMuc3RhdHVzX3N1Y2M6OmFmdGVye2NvbnRlbnQ6ICdcNTcyOFw1ZmFlXDRmZTFcNGUyZFw4ZjdiXDg5ZTZcNTE0MVw4YmI4XDUzNzNcNTNlZlw3ZWQxXDViOWEnO2ZvbnQtc2l6ZTogMTNweDtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fQouaW1wb3dlckJveCAuc3RhdHVzLnN0YXR1c19mYWlsIHAsIC5pbXBvd2VyQm94IC5zdGF0dXMuc3RhdHVzX2ZhaWwgaDQge2Rpc3BsYXk6IG5vbmU7fQouaW1wb3dlckJveCAuc3RhdHVzLnN0YXR1c19mYWlsIC5zdGF0dXNfdHh0OjpiZWZvcmV7Y29udGVudDogJ1w0ZjYwXDVkZjJcNTNkNlw2ZDg4XDZiNjRcNmIyMVw3ZWQxXDViOWEnO2ZvbnQtc2l6ZTogMTZweDtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fQouaW1wb3dlckJveCAuc3RhdHVzLnN0YXR1c19mYWlsOjphZnRlcntjb250ZW50OiAnXDRmNjBcNTNlZlw1MThkXDZiMjFcNjI2Ylw2M2NmXDdlZDFcNWI5YVxmZjBjXDYyNmJcNzgwMVw5NTE5XDhiZWZcOGJmN1w1MjM3XDY1YjAnO2ZvbnQtc2l6ZTogMTNweDtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fQ==';
const wxloginurl = computed(() => {
  return `https://open.weixin.qq.com/connect/qrconnect?appid=${appID}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_login&state=${state.value}styletype=&sizetype=&bgcolor=&rst=&href=data:text/css;base64,${cssHref}`;
});

function refreshWxQR() {
  state.value = Math.random().toString().slice(2);
}

useOnIpc(WX_CODE_RUL, (data) => {
  // 微信授权code
  let params = qs.parse(data.split('?')[1]);
  if (!params.code) {
    ElMessage.warning('微信扫码登录');
    // 刷新二维码
    state.value = Math.random().toString().slice(2);
  } else {
    UserApi.havaBindingUserWx(`${params.code}`)
      .then(async (res) => {
        if (res.data) {
          ElMessage.success('微信账号绑定成功');
          wxUserInfo.value = res.data;
        }
      })
      .finally(() => {
        // 刷新二维码
        state.value = Math.random().toString().slice(2);
      });
  }
});

const wxUserInfo = ref<{ nickname: string; headPortrait: string }>();
UserApi.checkThirdBand().then((res) => {
  if (res.data.obj == 'isBand') {
    wxUserInfo.value = res.data.info;
  }
});

function cancelThirdBand() {
  ElMessageBox.confirm('确定解除绑定该微信吗？', '提示', {
    type: 'warning'
  }).then(() => {
    UserApi.cancelThirdBand().then(() => {
      ElMessage.success('解绑成功');
      wxUserInfo.value = null;
    });
  });
}

onUnmounted(() => {
  useRemoveAllIpc(WX_CODE_RUL);
});
</script>

<style lang="scss" scoped>
// scss
.header {
  padding: 26px;
  font-weight: 500;
}

.content-card {
  height: 375px;
}

.bingwx {
  display: flex;
  justify-content: space-between;
  padding: 26px 26px 0;
}

.wx-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .label {
    padding: 20px 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: #595966;
    line-height: 21px;
  }
  img {
    margin-bottom: 16px;
    width: 140px;
    height: 140px;
  }
}
</style>
