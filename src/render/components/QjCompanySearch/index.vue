<template>
  <el-select
    :model-value="searchValue"
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
      <el-option v-for="item in showCompanys" :key="item.companyCode" :label="item.companyCode + ' ' + item.companyShortname" :value="item"> </el-option>
    </template>
  </el-select>
</template>
<script setup lang="ts">
/** 此控件要求必须点击公司后才能完成选择 */
import { CommonApi } from '@/apis/commonApi';
import { QjCompanyInfo } from '@/model/companyInfo';
import PinyinMatch from 'pinyin-match';
import { onMounted, PropType, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object as PropType<{ companyCode: string; companyShortname: string }>,
    default: () => null
  },
  placeHolder: {
    type: String,
    default: '请输入公司简称/代码'
  },
  style: {
    type: String,
    default: ''
  }
});

const loading = ref(false);
const searchValue = ref(props.modelValue ? props.modelValue.companyCode + ' ' + props.modelValue.companyShortname : '');
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      searchValue.value = val.companyCode + ' ' + val.companyShortname;
    } else {
      searchValue.value = null;
    }
  }
);

const companyInfo = ref<QjCompanyInfo>();
const emit = defineEmits(['update:modelValue', 'companyChecked']);

const companys = ref([]);
const showCompanys = ref([]);
function getCompanys() {
  loading.value = true;
  CommonApi.getAllCompanys({ company_type: 1, keyword: '', limit: 9999 }).then((data) => {
    loading.value = false;
    if (data.data) {
      const alldata = data.data;
      companys.value = alldata;
      showCompanys.value = [];
    }
  });
}
function companySelect(item) {
  if (item) {
    searchValue.value = item.companyCode + ' ' + item.companyShortname;
    companyInfo.value = JSON.parse(JSON.stringify(item));
  } else {
    searchValue.value = null;
    companyInfo.value = null;
  }
  emit('update:modelValue', companyInfo.value);
  emit('companyChecked', companyInfo.value);
  showCompanys.value = companys.value.slice(0, 10);
}

const remoteMethod = (query) => {
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
<style scoped lang="scss">
.el-select-dropdown__item.selected {
  color: var(--el-text-color-regular);
  font-weight: unset;
}
</style>
