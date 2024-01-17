<template>
  <el-scrollbar v-loading="loading" class="newsDetailDialog">
    <div class="news-detail">
      <div class="title">{{ newsDetail?.title }}</div>
      <div class="proppanel">
        <div>发布来源：{{ newsDetail?.sourceinfo }}</div>
        <div v-if="!!newsDetail?.author">作者：{{ newsDetail?.author }}</div>
        <div><a :href="newsDetail?.url" target="_blank" class="a-link">原文链接</a></div>
        <div v-if="detailParams.database == 'vnews' && !!newsDetail?.samecount">转载量：{{ newsDetail?.samecount }}</div>
        <div>发布时间：{{ newsDetail?.publishdate }}</div>
      </div>
      <!-- <div v-html-highlight="{ keywords: keywordsString }" class="content">{{ newsDetail.drecontent }}</div> -->
      <div v-html-highlight="{ keywords: keywordsString, detail: newsDetail?.drecontent }" class="content"></div>
    </div>
    <div v-if="detailParams.database === 'vnews' && newsOtherInfo.similar?.length > 0" class="similar-news">
      <div class="otitle" style="margin-bottom: 10px">相似文章</div>
      <el-table :data="newsOtherInfo.similar" style="width: 100%">
        <el-table-column :label="'标题'">
          <template #default="scope">
            <a :href="scope.row.url" target="_blank" class="title" :title="scope.row.title">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="'来源'" width="160">
          <template #default="scope">
            <span class="source" :title="scope.row.sourceinfo">
              {{ scope.row.sourceinfo }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="publishdate" align="center" label="时间" width="180" />
      </el-table>
    </div>
  </el-scrollbar>
  <div class="news-drawer" :class="{ 'news-drawer-open': newsDrawerOpen }">
    <div v-if="newsDrawerOpen" class="openBtn" @click="newsDrawerOpen = !newsDrawerOpen">
      <QjSvgIcon name="arrow-double-right" :size="18" :color="'#3d7eff'" />
    </div>
    <div v-if="!newsDrawerOpen" class="openBtn btnshadow" @click="newsDrawerOpen = !newsDrawerOpen">
      <QjSvgIcon name="arrow-double-left" :size="18" :color="'#3d7eff'" />
    </div>
    <div class="others">
      <div>
        <div class="head-title">
          <span class="otitle"
            >涉及主体<span class="primary marginL5">{{ newsDetail?.zhuti === '' ? 0 : newsDetail?.zhuti?.split(',').length }}</span></span
          >
          <span class="checkAll" @click="keywordsClick(newsDetail.zhuti)">
            <el-icon :size="18"><Filter /></el-icon>
          </span>
        </div>
        <span
          v-for="(item, index) in newsDetail?.zhuti?.split(',')"
          :key="index"
          class="item"
          :style="{ color: heightKeywords.indexOf(item) > -1 ? '#3D7EFF' : '', cursor: 'pointer' }"
          @click="keywordsClick(item)"
          >{{ item }}</span
        >
      </div>
      <div v-if="newsDetail?.person?.length > 0" style="margin-top: 20px">
        <div class="head-title">
          <span class="otitle"
            >涉及人物<span class="primary marginL5">{{ newsDetail?.person === '' ? 0 : newsDetail?.person?.split(',').length }}</span></span
          >
          <span class="checkAll" @click="keywordsClick(newsDetail.person)">
            <el-icon :size="18"><Filter /></el-icon>
          </span>
        </div>
        <span
          v-for="(item, index) in newsDetail?.person?.split(',')"
          :key="index"
          class="item"
          :style="{ color: heightKeywords.indexOf(item) > -1 ? '#3D7EFF' : '', cursor: 'pointer' }"
          @click="keywordsClick(item)"
          >{{ item }}</span
        >
      </div>
      <div v-if="detailParams.database === 'vnews' && getMedia()" style="margin-top: 20px">
        <div class="head-title">
          <span class="otitle">报道媒体</span>
        </div>
        <span v-for="(item, key, index) in newsOtherInfo.connectMedia" :key="index" class="item" :style="{ color: heightKeywords.indexOf(key) > -1 ? '#3D7EFF' : '' }">{{
          key
        }}</span>
      </div>
    </div>
  </div>
  <div v-if="newsDrawerOpen" class="masking" @click="newsDrawerOpen = false"></div>
</template>
<script setup lang="ts">
import { OpinionWarningApi } from '@/apis/opinionWarningApi';
import { useDetailParams } from '@/hooks/useDetailModal';
import { Filter } from '@element-plus/icons';
import { ref } from 'vue';

defineProps({
  url: {
    type: String,
    default: ''
  },
  database: {
    type: String,
    default: ''
  },
  keywords: {
    type: String,
    default: ''
  }
});

function getMedia() {
  let r = false;
  for (let key in newsOtherInfo.value?.connectMedia) {
    r = true;
  }
  return r;
}

const newsDrawerOpen = ref(false);
const loading = ref(false);
const newsDetail = ref<any>({});
const newsOtherInfo = ref<any>({});
const getDetail = (url) => {
  loading.value = true;
  OpinionWarningApi.getNewsDetail({ url: encodeURIComponent(url) }).then((data) => {
    loading.value = false;
    if (data.data) {
      newsDetail.value = data.data[0];
      newsDetail.value.drecontent = getStruct(newsDetail.value.drecontent);
      getNewsSimilar();
      heightKeywords.value.push(newsDetail.value.sourceinfo);
    }
  });
};
const getNewsSimilar = () => {
  OpinionWarningApi.getNewsSimilar({ cb: newsDetail.value.combinevalue, url: newsDetail.value.url }).then((data) => {
    if (data.data) {
      if (!newsDetail.value.samecount) {
        newsDetail.value.samecount = data.total;
      }
      newsOtherInfo.value = { connectMedia: data.data.media, similar: data.data.items };
    }
  });
};

const heightKeywords = ref([]);
const keywordsString = ref('');
function keywordsClick(val) {
  let valArr = val.split(',');
  // 判断高亮数组是否包含选中元素
  let isContain = false;
  isContain = valArr.every((item) => heightKeywords.value.includes(item));
  // 如果heightKeywords包含val所有元素
  if (isContain) {
    // 取消
    heightKeywords.value = heightKeywords.value.filter((item) => valArr.indexOf(item) == -1);
  } else {
    // 全选
    heightKeywords.value = [...valArr, ...heightKeywords.value];
  }
  keywordsString.value = '';
  keywordsString.value = heightKeywords.value.join(',');
}
function getStruct(content) {
  if (content) {
    const spaceToMultiMatchRegex0 = new RegExp(' +', 'gm');
    const spaceToMultiMatchRegex = new RegExp('\\n+(\\s+){1,}', 'gm');
    const spaceToMultiMatchRegex3 = new RegExp('\\n+', 'gm');
    // const spaceToMultiMatchRegex2 = new RegExp('(\\n)+\s*(\\n)*\s*', 'gm');
    content = content.replace(spaceToMultiMatchRegex, '<br><br>&emsp;&emsp;');
    content = content.replace(spaceToMultiMatchRegex0, '&emsp;');
    return content.replace(spaceToMultiMatchRegex3, '<br><br>&emsp;&emsp;');
    // return content.replace(new RegExp('\\n+', 'gm'), '<br>');
  }
}

const detailParams = useDetailParams((params) => {
  if (params.url) {
    newsDrawerOpen.value = false;
    loading.value = false;
    newsDetail.value = {};
    newsOtherInfo.value = {};
    keywordsString.value = params.keywords || '';
    heightKeywords.value = params.keywords.split(',');
    getDetail(params.url);
  }
});
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  > div {
    align-items: center;
  }
}

.newsDetailDialog {
  padding: 0 26px;
}

.news-detail {
  color: #929196;
  font-size: 14px;
  line-height: 24px;
  margin-top: 26px;
  margin-bottom: 10px;

  .title {
    color: #2c2b30;
    font-weight: 500;
    font-size: 16px;
  }

  .proppanel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 20px;

    > div {
      align-items: center;
    }
  }
  .content {
    color: #595966;
    font-size: 14px;
    line-height: 24px;
  }
}

.news-drawer {
  color: #929196;
  font-size: 14px;
  line-height: 24px;
  position: absolute;
  display: flex;
  flex-direction: row;
  width: 405px;
  padding-left: 10px;
  right: -360px;
  top: 0;
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
  overflow-y: auto;
  z-index: 3;
  max-height: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.news-drawer::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.news-drawer-open {
  right: 0;
}

.openBtn {
  width: 35px;
  height: 26px;
  border: 1px solid #dcdfe6;
  border-right: none;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  text-align: center;
  line-height: 27px;
  &:hover {
    cursor: pointer;
  }
  // background-color: #fffffff3;
}

.a-link {
  color: $primary-color;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

.others {
  flex: 1;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 4px 2px rgba(208, 208, 208, 38%);
  transition: all 0.5s;
  height: fit-content;
  backdrop-filter: blur(10px);
  .head-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .otitle {
      color: #2c2b30;
      font-weight: 500;
      font-size: 16px;
    }
  }

  .item {
    margin-right: 25px;
    margin-top: 7px;
    margin-bottom: 5px;
    display: inline-block;
  }

  .checkAll {
    color: $warning-color;
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
}

.similar-news {
  margin-top: 20px;
  margin-bottom: 26px;

  .title,
  .source {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }

  .title {
    font-size: 14px;
    font-weight: 500;
    color: #2c2b30;
    cursor: pointer;
  }
}

.masking {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
  // background-color: #2c2b3033;
  height: 100%;
  width: 100%;
}
</style>
