<template>
  <div class="content">
    <LayoutTitlebar :is-maximizable="false" />
    <img class="logo" :src="$img('logo_gray.png')" alt="logo" />
    <div class="login">
      <div class="login-warp">
        <span class="switch-tag" :class="loginType" :title="loginType == 'pc' ? '微信扫码登录' : '手机号登录'" @click="switchLoginType"></span>
        <img width="230" :src="$img('login_title.png')" />
        <div v-show="loginType == 'pc'">
          <el-form ref="form" :model="loginForm" :rules="rules" label-position="left" label-width="0px" class="login-container">
            <el-form-item prop="mobile" style="margin-bottom: 30px">
              <el-input v-model="loginForm.mobile" type="text" auto-complete="off" placeholder="请输入您的手机号"></el-input>
            </el-form-item>
            <div :id="renderId" style="margin-bottom: 16px"></div>
            <el-form-item prop="captcha" style="margin-bottom: 30px">
              <el-input v-model="loginForm.captcha" type="text" auto-complete="off" placeholder="请输入验证码">
                <template #append>
                  <el-button type="text" :loading="senging" :disabled="disabledCount" @click="sendCode">
                    <span>{{ countText }}</span>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <!-- <div class="register" @click="showRegister = true">申请注册</div> -->
            <el-checkbox style="height: 20px" :model-value="remember" @change="rememberChange">记住手机号</el-checkbox>
            <el-form-item class="paddingT20">
              <el-button style="width: 100%" type="primary" :loading="logining" @click="handleLogin">登 录</el-button>
              <div class="agree">
                <el-checkbox v-model="agree" label="" size="large" />
                <span class="info">我已阅读并同意</span>
                <el-link href="https://www.nana.net/zt/user_agreement.htm" target="_blank" type="primary" :underline="false">《用户服务协议》</el-link>
                <el-link href="https://www.nana.net/zt/privacy_agreement.htm" target="_blank" type="primary" :underline="false">《隐私政策》</el-link>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="!weixintoken && loginType == 'wx'">
          <div class="wxBox">
            <iframe :src="wxloginurl" frameborder="0" scrolling="no" width="272px" height="400px"></iframe>
          </div>
        </div>
        <div v-if="weixintoken && loginType == 'wx'">
          <BingWx :weixintoken="weixintoken" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OtherApi } from '@/apis/otherApi';
import { UserApi } from '@/apis/userApi';
import { useCountDown } from '@/hooks/useCountDown';
import { useOnIpc, useRemoveAllIpc } from '@/hooks/useIpc';
import { useSendLogin } from '@/hooks/useSendIpc';
import { useUserInfo } from '@/hooks/useUserInfo';
import LayoutTitlebar from '@/layout/LayoutTitlebar.vue';
import { storage } from '@/utils/storage';
import { validatePhone } from '@/utils/validate';
import { ElMessage } from 'element-plus';
import qs from 'qs';
import { generate } from 'shortid';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { WX_CODE_RUL } from '../../../common/event';
import BingWx from './components/BingWx.vue';

const { start, count, countText } = useCountDown(60, '获取验证码', '重新发送', () => {
  ncReset();
});
const disabledCount = computed(() => {
  return !awscParams.value || !loginForm.mobile || count.value > 0;
});

const awscParams = ref();

const customLang = {
  cn: {
    //加载状态提示。
    LOADING: '加载中...',
    //等待滑动状态提示。
    SLIDE: '请向右滑动证码',
    //验证通过状态提示。
    SUCCESS: '验证通过',
    //验证失败触发拦截状态提示。
    ERROR: '非常抱歉，网络出错了...',
    //验证失败触发拦截状态提示。
    FAIL: '验证失败，请重试'
  }
};

const renderId = generate();

onMounted(() => {
  // 之前有先注销
  ncReset();
  window.nc = null;
  // 实例化ic对象
  // 实例化nc
  // eslint-disable-next-line no-undef
  window.AWSC.use('nc', function (state, module) {
    // 初始化
    window.nc = module.init({
      // 应用类型标识。它和使用场景标识（scene字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在阿里云验证码控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
      appkey: 'FFFF0N000000000085DA',
      //使用场景标识。它和应用类型标识（appkey字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在阿里云验证码控制台的配置管理页签找到对应的scene值，请务必正确填写。
      scene: 'nc_login',
      // 声明滑动验证需要渲染的目标ID。
      renderTo: renderId,
      width: 268,
      upLang: customLang,
      //前端滑动验证通过时会触发该回调参数。您可以在该回调参数中将会话ID（sessionId）、签名串（sig）、请求唯一标识（token）字段记录下来，随业务请求一同发送至您的服务端调用验签。
      success: function (data) {
        awscParams.value = { csessionid: data.sessionId, sig: data.sig, nc_token: data.token, scene: 'nc_login' };
      },
      // 滑动验证失败时触发该回调参数。
      fail: function (failCode) {
        window.console && console.log(failCode);
      },
      // 验证码加载出现异常时触发该回调参数。
      error: function (errorCode) {
        window.console && console.log(errorCode);
      }
    });
  });
});

function ncReset() {
  awscParams.value = null;
  window.nc && window.nc.reset();
}

let protocolData;

const loginForm = reactive({ mobile: '', captcha: '' });
const rules = {
  mobile: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' }
  ],
  captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
};

const form = ref(null);

const senging = ref(false);
function sendCode() {
  form.value.validateField('mobile', async (valid) => {
    if (valid) {
      try {
        senging.value = true;
        let res = await UserApi.sendSmsCodeAI({ ...awscParams.value, mobile: loginForm.mobile, tempKey: 'IR_LOGIN' });
        if (res && res.code === 0) {
          start();
          ElMessage({ type: 'success', message: '验证码发送成功' });
        } else {
          ElMessage({ type: 'error', message: '滑动验证已失效，请重新验证！' });
          awscParams.value = null;
          ncReset();
        }
      } catch (err) {
        console.error('sendCode error', err);
      }
      senging.value = false;
    }
  });
}

const { userInfo, setUserInfo } = useUserInfo();

const logining = ref(false);
function handleLogin() {
  form.value.validate((valid) => {
    if (valid) {
      if (!agree.value) {
        ElMessage.info('请先同意《用户服务协议》和《隐私政策》');
        return;
      }
      logining.value = true;
      UserApi.login({ mobile: loginForm.mobile, captcha: loginForm.captcha })
        .then(async (res) => {
          if (res && res.code == 0) {
            OtherApi.addPOSTRecord('login', res.data.userInfo);
            await setUserInfo(res.data.token, res.data.ptoken, res.data.userInfo, res.data.platform);
            sendLogin();
          }
        })
        .finally(() => {
          logining.value = false;
        });
    } else {
      return false;
    }
  });
}

const route = useRoute();
const router = useRouter();
function sendLogin() {
  let path = '/home';
  if (route.query.redirect) {
    path = route.query.redirect.toString();
  }
  router.replace({ path }).then(() => {
    useSendLogin();
    logining.value = false;
  });
}

const remember = ref(storage.get('rememberMobile') ? true : false);
if (remember.value) {
  loginForm.mobile = userInfo.mobile;
}
function rememberChange(val) {
  remember.value = val;
  storage.set('rememberMobile', remember.value);
}

const agree = ref(false);

const loginType = ref('pc');
function switchLoginType() {
  if (loginType.value == 'pc') {
    if (!agree.value) {
      ElMessage.warning('请先同意《用户服务协议》和《隐私政策》');
      return;
    }
    loginType.value = 'wx';
  } else {
    loginType.value = 'pc';
  }
}

const appID = import.meta.env.VITE_APP_WX_APPID.toString();
const redirectUrl = encodeURIComponent(import.meta.env.VITE_APP_WX_REDIRECT_URL.toString());
const state = ref(Math.random().toString().slice(2));
/* 微信二维码样式
.impowerBox .qrcode {width: 240px;}
.impowerBox .title {display: none;}
.impowerBox .info {width: 240px;}
.impowerBox .status_icon {width: 22px;height:22px;margin:0;}
.impowerBox .status {text-align: center;}
.impowerBox .status.status_succ p {display: none;}
.impowerBox .status.status_succ::after{content: '\5728\5fae\4fe1\4e2d\8f7b\89e6\5141\8bb8\5373\53ef\767b\5f55';font-size: 13px;display: inline-block;}
.impowerBox .status.status_fail p, .impowerBox .status.status_fail h4 {display: none;}
.impowerBox .status.status_fail .status_txt::before{content: '\4f60\5df2\53d6\6d88\6b64\6b21\767b\5f55';font-size: 16px;display: inline-block;}
.impowerBox .status.status_fail::after{content: '\4f60\53ef\518d\6b21\626b\63cf\767b\5f55\ff0c\6216\4f7f\7528\8d26\53f7\767b\5f55';font-size: 13px;display: inline-block;}
*/
const cssHref =
  'LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDI0MHB4O30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyNDBweDt9Ci5pbXBvd2VyQm94IC5zdGF0dXNfaWNvbiB7d2lkdGg6IDIycHg7aGVpZ2h0OjIycHg7bWFyZ2luOjA7fQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7fQouaW1wb3dlckJveCAuc3RhdHVzLnN0YXR1c19zdWNjIHAge2Rpc3BsYXk6IG5vbmU7fQouaW1wb3dlckJveCAuc3RhdHVzLnN0YXR1c19zdWNjOjphZnRlcntjb250ZW50OiAnXDU3MjhcNWZhZVw0ZmUxXDRlMmRcOGY3Ylw4OWU2XDUxNDFcOGJiOFw1MzczXDUzZWZcNzY3Ylw1ZjU1Jztmb250LXNpemU6IDEzcHg7ZGlzcGxheTogaW5saW5lLWJsb2NrO30KLmltcG93ZXJCb3ggLnN0YXR1cy5zdGF0dXNfZmFpbCBwLCAuaW1wb3dlckJveCAuc3RhdHVzLnN0YXR1c19mYWlsIGg0IHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLnN0YXR1cy5zdGF0dXNfZmFpbCAuc3RhdHVzX3R4dDo6YmVmb3Jle2NvbnRlbnQ6ICdcNGY2MFw1ZGYyXDUzZDZcNmQ4OFw2YjY0XDZiMjFcNzY3Ylw1ZjU1Jztmb250LXNpemU6IDE2cHg7ZGlzcGxheTogaW5saW5lLWJsb2NrO30KLmltcG93ZXJCb3ggLnN0YXR1cy5zdGF0dXNfZmFpbDo6YWZ0ZXJ7Y29udGVudDogJ1w0ZjYwXDUzZWZcNTE4ZFw2YjIxXDYyNmJcNjNjZlw3NjdiXDVmNTVcZmYwY1w2MjE2XDRmN2ZcNzUyOFw4ZDI2XDUzZjdcNzY3Ylw1ZjU1Jztmb250LXNpemU6IDEzcHg7ZGlzcGxheTogaW5saW5lLWJsb2NrO30=';
const wxloginurl = computed(() => {
  return `https://open.weixin.qq.com/connect/qrconnect?appid=${appID}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_login&state=${state.value}styletype=&sizetype=&bgcolor=&rst=&href=data:text/css;base64,${cssHref}`;
});

const weixintoken = ref('');
useOnIpc(WX_CODE_RUL, (data) => {
  // 微信授权code
  let params = qs.parse(data.split('?')[1]);
  if (!params.code) {
    ElMessage.warning('微信扫码登录');
    // 刷新二维码
    state.value = Math.random().toString().slice(2);
  } else {
    UserApi.wechatLogin(`${params.code}`)
      .then(async (res) => {
        if (res.data) {
          if (res.data.token) {
            OtherApi.addPOSTRecord('login', res.data.userInfo);
            await setUserInfo(res.data.token, res.data.ptoken, res.data.userInfo, res.data.platform);
            sendLogin();
          } else {
            weixintoken.value = res.data;
            loginType.value = 'wx';
          }
        }
      })
      .finally(() => {
        // 刷新二维码
        state.value = Math.random().toString().slice(2);
      });
  }
});

onUnmounted(() => {
  useRemoveAllIpc(WX_CODE_RUL);
});
</script>

<style scoped lang="scss">
.content {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: calc(100vh - #{$titlebar-height});
  margin-top: $titlebar-height;
}

.logo {
  position: absolute;
  top: 44px;
  left: 20px;
  width: 136px !important;
}

.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background-image: url(@/assets/images/login_bg.svg);
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100%;
}

.login-warp {
  position: relative;
  overflow: hidden;
  padding: $content-padding;
  margin-top: 12%;
  margin-left: 420px;
  width: 324px;
  height: 396px;
  background: #fff;
  box-shadow: 0 10px 20px 0 rgba(125, 127, 136, 0.18);
  border-radius: 16px;
  opacity: 0.79;
  flex-shrink: 0;
  .title {
    display: inline-block;
    padding: 2px 0;
    font-size: 16px;
    font-weight: bold;
    color: $primary-color;
    line-height: 24px;
    border-bottom: 2px solid $primary-color;
  }
  .login-container {
    padding-top: 18px;
    :deep(.el-input__inner) {
      padding: 0;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #dedede;
      box-shadow: none;
    }
    :deep(.el-input-group__append) {
      background-color: transparent;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #dedede;
      color: $text-color-regular;
      box-shadow: none;
    }
  }
}

:deep(.nc-container) {
  position: relative;
  .nc_wrapper {
    width: 272px !important;
  }
  .nc_scale span {
    height: 34px;
    line-height: 34px;
    outline: 0;
  }
  .nc_scale .nc_ok,
  .nc_scale .nc_bg {
    background: $primary-color;
  }

  .scale_text.slidetounlock.scale_text2 span[data-nc-lang='SLIDE'] {
    -webkit-text-fill-color: white;
  }
  .nc_scale .btn_ok {
    color: $primary-color;
  }
}

.agree {
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .info {
    margin-left: 6px;
    color: #666;
  }
  .el-link {
    font-size: 12px;
  }
}

.switch-tag {
  width: 38px;
  height: 38px;
  position: absolute;
  z-index: 99;
  top: 0;
  right: 0;
  cursor: pointer;

  &::before {
    content: '';
    width: 30px;
    height: 30px;
    position: absolute;
    z-index: 99;
    top: 8px;
    right: 8px;
    transition: all 0.3 ease-in-out;
  }
  &::after {
    content: '';
    position: absolute;
    z-index: 9;
    width: 0;
    height: 0;
    border-top: 70px solid $primary-color;
    border-left: 70px solid transparent;
    top: 0;
    right: 0;
  }
  &.pc {
    &::before {
      background: url('@/assets/images/login_code.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  &.wx {
    &::before {
      background: url('@/assets/images/login_pc.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
