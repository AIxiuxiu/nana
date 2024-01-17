<template>
  <el-scrollbar
    v-track="{ id: 'page_view', eventResource: '使用反馈', elementId: `feedback`, parentElId: `userCenter` }"
    class="main-scrollbar"
    wrap-class="main-wrap"
    view-class="main-view"
  >
    <div class="content-card content-padding qj-left-content">
      <el-form ref="formRef" label-position="right" label-width="140px" :model="formData" :rules="rules">
        <el-form-item prop="type" label="选择问题类型">
          <el-radio-group v-model="formData.type" style="width: 200px">
            <el-radio label="活动视频、封面上传不成功">活动视频、封面上传不成功；</el-radio>
            <el-radio label="收不到活动邀请短信">收不到活动邀请短信；</el-radio>
            <el-radio label="收不到短信">收不到短信；</el-radio>
            <el-radio label="客户端更新不成功">客户端更新不成功；</el-radio>
            <el-radio label="系统自动退出">系统自动退出；</el-radio>
            <el-radio label="其他">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="问题描述" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="8" placeholder="请简单描述触发问题操作"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="annex">
          <QjAnnexUpload v-model="annex" :limit="1" :file-size="50">
            <template #tip>
              <span class="margin15 el-upload__tip">上传文件格式为图片、.word或.pdf，文件不能大于50MB</span>
            </template>
          </QjAnnexUpload>
        </el-form-item>
        <el-form-item>
          <p class="forms-tips">
            感谢您的支持，我们将不断改进产品和提升服务！若出现问题需要紧急处理，可联系您的客户经理：{{ serviceManager?.managerName }} {{ serviceManager?.managerMobile }}
          </p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
/**
 * 反馈
 */
import { UserApi } from '@/apis/userApi';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';

const formData = reactive({
  type: '',
  description: ''
});

const annex = ref([]);

const rules = {
  type: [{ required: true, message: '其选择问题类型', trigger: 'blur' }]
};

const { serviceManager } = useUserInfo();

const formRef = ref<any>();
const loading = ref<any>(false);

function onSubmit() {
  loading.value = true;
  formRef.value.validate((valid) => {
    if (valid) {
      const params: any = {
        question_type: formData.type,
        question_desc: formData.description
      };
      if (annex.value.length > 0) {
        params.fileId = annex.value.map((v) => v.id);
      }
      UserApi.saveUserFeedback(params).then((res) => {
        if (res && res.code === 0) {
          ElMessage.success('反馈提交成功');
          formData.type = '';
          formData.description = '';
          annex.value = [];
        }
      });
    }
    loading.value = false;
  });
}
</script>

<style lang="scss" scoped>
.forms-tips {
  color: $text-color-secondary;
}
</style>
