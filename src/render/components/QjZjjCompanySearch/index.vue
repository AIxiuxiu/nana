<template>
  <el-select
    v-model="searchValue"
    value-key="companyCode"
    filterable
    clearable
    remote
    :filter-method="remoteMethod"
    :placeholder="props.placeHolder"
    :style="props.style"
    :default-first-option="true"
    @change="companySelect"
  >
    <template v-if="showCompanys.length > 0">
      <el-option v-for="item in showCompanys" :key="item.companyCode" :label="item.companyShortname + ' ' + item.companyCode" :value="item"> </el-option>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { CommonApi } from '@/apis/commonApi';
import { useUserInfo } from '@/hooks/useUserInfo';
import PinyinMatch from 'pinyin-match';
import { onMounted, PropType, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object as PropType<{ companyCode: string; companyShortname: string; pid: string }>,
    default: () => null
  },
  placeHolder: {
    type: String,
    default: '请输入公司简称/代码'
  },
  style: {
    type: String,
    default: ''
  },
  defaultShow: {
    // 默认展示十条
    type: Boolean,
    default: false
  }
});
const loading = ref(false);

const { userInfo } = useUserInfo();

const companyInfo = ref<{ companyCode: string; companyShortname: string; pid: string }>();
const emit = defineEmits(['update:modelValue', 'companyChecked']);

const companys = ref<{ companyCode: string; companyShortname: string; pid: string }[]>([]);
const showCompanys = ref([]);

function getCompanys() {
  loading.value = true;
  CommonApi.getZjjCompanys(userInfo.superviseId).then((res) => {
    loading.value = false;
    if (res.data) {
      companys.value = res.data;
      if (props.defaultShow) {
        showCompanys.value = companys.value.slice(0, 10);
      } else {
        showCompanys.value = [];
      }
    }
  });
}

const searchValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    searchValue.value = val;
  }
);

function companySelect(item) {
  if (item) {
    companyInfo.value = JSON.parse(JSON.stringify(item));
  } else {
    companyInfo.value = null;
  }
  emit('update:modelValue', companyInfo.value);
  emit('companyChecked', companyInfo.value);

  if (!item && props.defaultShow) {
    showCompanys.value = companys.value.slice(0, 10);
  }
}

const remoteMethod = (query: string) => {
  if (query) {
    showCompanys.value = companys.value
      .filter((restaurant) => {
        return restaurant.companyCode.indexOf(query) > -1 || PinyinMatch.match(restaurant.companyShortname, query);
      })
      .slice(0, 10);
  } else {
    showCompanys.value = [];
  }
};

onMounted(() => {
  getCompanys();
});
</script>
<style lang="scss" scoped>
.input {
  display: inline-flex;
  width: 175px;
}
</style>
