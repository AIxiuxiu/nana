<template>
  <el-dialog :model-value="modelValue" title="变更权限" width="600px" @close="closeDialog">
    <div v-loading="isLoading">
      <el-tree
        ref="menuTree"
        :data="menus"
        :props="{ children: 'child', label: 'name' }"
        show-checkbox
        :default-checked-keys="defatultMenuids"
        node-key="pid"
        :check-strictly="false"
        @check-change="checkChange"
      >
      </el-tree>
    </div>
    <template #footer>
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { UserApi } from '@/apis/userApi';
import { useAsyncApi } from '@/hooks/useAsyncApi';
import { useUserInfo } from '@/hooks/useUserInfo';
import { InjectAuthMenus } from '@/types/symbols';
import { ElMessage } from 'element-plus';
import { inject, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    default: ''
  }
});

const { menus } = inject(InjectAuthMenus);

let menuIds = '';
const { isLoading, data: defatultMenuids } = useAsyncApi(
  () => {
    return UserApi.getUserMenuList(props.userId);
  },
  {
    onFilter: (data) => {
      if (data) {
        const parentIds = data.map((item) => item.parentId).filter((v) => !!v);
        const menuIds = data.map((item) => item.menuId).filter((v) => parentIds.indexOf(v) == -1);
        return menuIds;
      }
      return [];
    },
    onSuccess: (val) => {
      menuIds = val.join(',');
    }
  }
);

const menuTree = ref(null);
function checkChange() {
  const selectData = menuTree.value.getCheckedNodes(false, true);
  menuIds = selectData.map((item) => item.pid).join(',');
}

const loading = ref<any>(false);
const { userInfo } = useUserInfo();

async function onSubmit() {
  loading.value = true;
  let res = await UserApi.updateUserAuth({ menuIds, userId: props.userId, companyId: userInfo.companyId });
  if (res && res.code === 0) {
    ElMessage({ type: 'success', message: '权限更新成功' });
  }
  loading.value = false;
  closeDialog();
}

const emits = defineEmits(['update:modelValue']);
const closeDialog = () => {
  emits('update:modelValue', false);
};
</script>
