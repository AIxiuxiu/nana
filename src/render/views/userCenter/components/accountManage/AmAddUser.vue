<template>
  <el-dialog :model-value="modelValue" title="添加账号" width="60%" :close-on-click-modal="false" @close="closeDialog">
    <el-form ref="form" label-position="right" label-width="80px" :model="userForm" :rules="rules">
      <el-form-item prop="name" label="姓名">
        <el-input v-model="userForm.name"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" label="手机号码">
        <el-input v-model="userForm.mobile"></el-input>
      </el-form-item>
      <el-form-item prop="duty" label="职务">
        <el-input v-model="userForm.duty"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" class="mt20 mb20 menuAuthority">
        <el-tree
          ref="tree"
          :data="menus"
          :props="{ children: 'child', label: 'name' }"
          show-checkbox
          :default-checked-keys="defaultMenuCheck"
          node-key="pid"
          :default-expanded-keys="menuExpandedKeys"
          @check-change="checkChange"
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { UserApi } from '@/apis/userApi';
import { useUserInfo } from '@/hooks/useUserInfo';
import { InjectAuthMenus } from '@/types/symbols';
import { validatePhone } from '@/utils/validate';
import { ElMessage } from 'element-plus';
import { inject, reactive, ref } from 'vue';

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const { menus, defaultMenuCheck } = inject(InjectAuthMenus);

const userForm = reactive({
  name: '',
  mobile: '',
  duty: '',
  menuIds: defaultMenuCheck.value
});

const rules = {
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  mobile: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' }
  ]
};

const menuExpandedKeys = [];

const tree = ref(null);
function checkChange() {
  const selectData = tree.value.getCheckedNodes(false, true);
  userForm.menuIds = selectData.map((item) => item.pid).join(',');
}

const emits = defineEmits(['update:modelValue', 'success']);

const form = ref<any>();
const loading = ref<any>(false);
const { userInfo } = useUserInfo();
async function onSubmit() {
  loading.value = true;
  form.value.validate(async (valid) => {
    if (valid) {
      let res = await UserApi.addCompnayUser({ ...userForm, companyId: userInfo.companyId, type: 2 });
      if (res && res.code === 0) {
        ElMessage({ type: 'success', message: '添加成功, 已发送短信通知用户' });
        emits('success');
        closeDialog();
      }
    }
    loading.value = false;
  });
}

const closeDialog = () => {
  emits('update:modelValue', false);
};
</script>
