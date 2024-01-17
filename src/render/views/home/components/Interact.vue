<template>
  <div class="content-card">
    <div class="header">
      <span style="line-height: 20px">互动问答</span>
      <span v-has="6001">
        <el-tooltip trigger="hover" :content="'更多'" :placement="'bottom-start'" :effect="'light'" :visible-arrow="false">
          <QjSvgIcon class="moreicon" name="ellipsis" :size="20" :color="'#9D9CBB'" @click="router.push('/qjInteract')" />
        </el-tooltip>
      </span>
    </div>
    <div v-loading="loading" style="min-height: 250px">
      <el-carousel v-if="interactData.length > 0" height="250px" :autoplay="true" direction="vertical" :indicator-position="'none'" :interval="5000">
        <el-carousel-item v-for="(item, index) in Math.ceil(interactData.length / 4)" :key="index">
          <template v-for="(item2, index2) in 4" :key="index2">
            <div v-if="interactData[index * 4 + index2]" style="margin: 10px 0">
              <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center">
                <div>
                  <span style="color: #6561f7; font-weight: 500; line-height: 26px">投资者提问：</span>
                  <span
                    style="
                      padding: 0 4px;
                      display: inline-block;
                      font-size: 12px;
                      color: rgb(47, 84, 235);
                      line-height: 16px;
                      background: rgba(47, 84, 235, 0.1);
                      border-radius: 7px;
                      border: 1px solid #2f54eb;
                    "
                    >{{ interactData[index * 4 + index2].companyBaseInfo.companyShortname }}</span
                  >
                </div>
                <span style="font-weight: 400; color: #bababa; line-height: 26px; float: right">{{ interactData[index * 4 + index2]?.replyList?.length > 0 ? '已回复' : '' }}</span>
              </div>
              <div class="question-content" style="color: var(--text-color-regular); line-height: 24px" :title="interactData[index * 4 + index2]?.content">
                {{ interactData[index * 4 + index2]?.content }}
              </div>
            </div>
          </template>
        </el-carousel-item>
      </el-carousel>
      <div v-if="!loading && interactData && interactData.length == 0" style="text-align: center">
        <qj-empty />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { InteractApi } from '@/apis/interactApi';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { userInfo } = useUserInfo();
const loading = ref(false);
const interactData = ref([]);
const getList = () => {
  const qp: any = { page: 1, pagesize: 12, platformId: userInfo.superviseId };
  loading.value = true;
  InteractApi.getQuestionList(qp).then((res) => {
    loading.value = false;
    if (res.code === 0) {
      interactData.value.push(...res.data);
    }
  });
};
getList();
</script>
<style scoped lang="scss">
.content-card {
  padding: 16px 18px 22px 18px;
  height: 320px;
}

.header {
  margin-bottom: 10px;
  position: relative;

  .moreicon {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
  }
}

.reply-btn {
  font-weight: 500;
  color: #3d7eff;
  line-height: 26px;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

.question-content {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
</style>
