<template>
  <div class="input">
    <el-autocomplete
      ref="autocomplete"
      v-model="searchInputData.nameAndCode"
      placeholder="代码/简称"
      :trigger-on-focus="false"
      :fetch-suggestions="searchInputSearchAsync"
      :highlight-first-item="true"
      :select-when-unmatched="true"
      @select="searchInputSelect"
      @blur="loseFocusListener"
      ><template #default="{ item }">
        <div class="value">
          {{ item.code }}<span style="margin-left: 20px">{{ item.shortName }}</span>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { CommonApi } from '@/apis/commonApi';
import PinyinMatch from 'pinyin-match';
import { onMounted, reactive, ref } from 'vue';

/**
 * 搜索
 */
const searchInputData = reactive({
  shortName: '',
  code: '',
  nameAndCode: ''
});

// 搜索传参
const params = {
  type: '',
  keyword: ''
};

// 保存返回数据
const resultList = ref([]);

// 数据初始化
const dataInit = () => {
  if (resultList.value.length == 0) {
    CommonApi.getAllCompanysFromKB(params).then((data) => {
      if (data != null) {
        resultList.value = data.data;
      }
    });
  }
};

// 搜索-输入触发查询
const searchInputSearchAsync = (queryString: string, cb) => {
  const finalRet = queryString ? resultList.value.filter(createFilter(queryString)).slice(0, 10) : '';
  cb(finalRet);
};
const createFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.code.indexOf(queryString) > -1 || PinyinMatch.match(restaurant.shortName, queryString);
  };
};

// 搜索-选择监听
const searchInputSelect = (item) => {
  if (typeof item == 'object') {
    searchInputData.shortName = item.shortName;
    searchInputData.code = item.code;
    searchInputData.nameAndCode = item.code + ' ' + item.shortName;
    // 监听后参数上层传递
    sendData2Father();
  }
};

// 搜索-失去焦点时触发
const loseFocusListener = () => {
  // 监听后参数上层传递
  sendData2Father();
};

// 向父组件传值
const emit = defineEmits(['getCodeAndShortNameSearchData']);
const sendData2Father = () => {
  // 如果当前查询框无数据，则重置传参
  if (!searchInputData.shortName || searchInputData.shortName.length == 0 || !searchInputData.code || searchInputData.code.length == 0 || searchInputData.nameAndCode.length == 0) {
    searchInputData.code = '';
    searchInputData.shortName = '';
    searchInputData.nameAndCode = '';
  }
  emit('getCodeAndShortNameSearchData', searchInputData);
};

// 自身方法-初始化
const dataReset = () => {
  searchInputData.code = '';
  searchInputData.shortName = '';
  searchInputData.nameAndCode = '';
  sendData2Father();
};
// 自身方法-查询公司简称/代码
const getOrgData = (queryString) => {
  return queryString ? resultList.value.filter(createFilter(queryString)).slice(0, 10) : '--';
};

/**
 * 页面挂载后触发
 */
onMounted(() => {
  dataInit();
});

/**
 * 对外暴露方法
 */
defineExpose({
  dataReset,
  getOrgData
});
</script>
<style lang="scss" scoped>
.input {
  display: inline-flex;
  width: 175px;
}
</style>
