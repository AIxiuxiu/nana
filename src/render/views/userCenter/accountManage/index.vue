<template>
  <el-scrollbar
    v-track="{ id: 'page_view', eventResource: '账号管理', elementId: `accountManage`, parentElId: `userCenter` }"
    class="main-scrollbar"
    wrap-class="main-wrap"
    view-class="main-view"
  >
    <div class="content-card account qj-left-content">
      <div class="pull-right paddingB15">
        <el-button type="primary" @click="dialog.addVisible = true">+添加</el-button>
        <el-button :disabled="colectIds.length == 0" @click="deleteUsers">删除</el-button>
      </div>
      <el-table v-loading="isLoading" :data="userList" @selection-change="selectionChange">
        <el-table-column label="选择" prop="" type="selection"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="手机号码（登录账号）" prop="mobile"></el-table-column>
        <el-table-column label="创建时间" prop="creDttm"></el-table-column>
        <el-table-column label="操作" prop="" align="center" min-width="120">
          <template #default="scope">
            <div class="nowrap">
              <el-button type="text" @click="openDialog(scope, 0)">权限设置</el-button>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <qj-empty />
        </template>
      </el-table>
      <QjPagination />
    </div>
    <AmAddUser v-if="dialog.addVisible" v-model="dialog.addVisible" @success="refresh()" />
    <AmChangeAuth v-if="dialog.changeAuth" v-model="dialog.changeAuth" :user-id="userId" />
  </el-scrollbar>
</template>

<script setup lang="ts">
/**
 * 账号管理
 */
import { UserApi } from '@/apis/userApi';
import { useAsyncApi, useAsyncTableApi } from '@/hooks/useAsyncApi';
import { InjectAuthMenus } from '@/types/symbols';
import { IQjAuthMenus } from '@/types/types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { provide, reactive, ref } from 'vue';
import AmAddUser from '../components/accountManage/AmAddUser.vue';
import AmChangeAuth from '../components/accountManage/AmChangeAuth.vue';

const {
  data: userList,
  isLoading,
  refresh
} = useAsyncTableApi((params) => {
  return UserApi.getUserList(params);
});

const dialog = reactive({
  addVisible: false,
  changeAuth: false
});

let colectIds = ref('');
function selectionChange(val) {
  colectIds.value = val.map((item) => item.pid).join(',');
}

function deleteUsers() {
  ElMessageBox.confirm('确认删除选择的用户吗').then(() => {
    UserApi.deleteCompanyUser(colectIds.value).then((res) => {
      if (res && res.code == 0) {
        ElMessage({ message: '删除成功', type: 'success' });
        refresh();
      }
    });
  });
}

const userId = ref('');
function openDialog(scope, type) {
  userId.value = scope.row.pid;
  if (type == 0) dialog.changeAuth = true;
}

const defaultMenuCheck = ref<string[]>([]);
const { data: menus } = useAsyncApi<IQjAuthMenus[]>(
  () => {
    return UserApi.getMenuList();
  },
  {
    onFilter: (data) => {
      return data.filter((v) => {
        v.child && (v.child = v.child.filter((i) => i.isShow == 1));
        return v.isShow == 1;
      });
    },
    onSuccess: (data) => {
      for (const value of data) {
        if (value.isDefault) {
          defaultMenuCheck.value.push(value.pid);
        }
        if (value.child) {
          defaultMenuCheck.value.push(...value.child.filter((item) => item.isDefault).map((item) => item.pid));
        }
      }
    }
  }
);

provide(InjectAuthMenus, { menus, defaultMenuCheck });
</script>

<style lang="scss" scoped>
.account {
  padding: $content-padding;
}
</style>
