<template>
  <div>
    <div class="title">您还没有绑定账号，绑定后可直接扫码登录</div>
    <el-form ref="form" :model="loginForm" :rules="rules" label-position="left" label-width="0px" class="bing-container">
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
      <el-form-item class="paddingT10">
        <el-button style="width: 100%" type="primary" :loading="logining" @click="handleLogin">立即绑定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { OtherApi } from '@/apis/otherApi';
import { UserApi } from '@/apis/userApi';
import { useCountDown } from '@/hooks/useCountDown';
import { useSendLogin } from '@/hooks/useSendIpc';
import { useUserInfo } from '@/hooks/useUserInfo';
import { validatePhone } from '@/utils/validate';
import { ElMessage } from 'element-plus';
import { generate } from 'shortid';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  weixintoken: {
    type: String,
    default: ''
  }
});
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
      logining.value = true;
      UserApi.login({ mobile: loginForm.mobile, captcha: loginForm.captcha })
        .then(async (res) => {
          if (res && res.code == 0) {
            OtherApi.addPOSTRecord('login', res.data.userInfo);
            await setUserInfo(res.data.token, res.data.ptoken, res.data.userInfo, res.data.platform);
            await UserApi.loginBindWx(props.weixintoken);
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
</script>

<style scoped lang="scss">
.title {
  margin-top: 16px;
  display: inline-block;
  padding: 2px 0;
  font-size: 14px;
  font-weight: bold;
  color: $text-color-primary;
  line-height: 28px;
  // border-bottom: 2px solid $primary-color;
}

.bing-container {
  padding-top: 18px;
  :deep(.el-input__inner) {
    padding: 0;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #dedede;
    box-shadow: none;
    &:focus {
      box-shadow: none;
    }
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
</style>
