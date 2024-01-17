/**
 * 用户中心路由
 */
export default {
  path: '/userCenter',
  component: () => import('@/views/userCenter/index.vue'),
  redirect: '/userCenter/msgManage',
  meta: {
    title: '用户中心',
    authCode: 8000
  },
  originalChildren: [
    {
      path: 'accountManage',
      component: () => import('@/views/userCenter/accountManage/index.vue'),
      meta: {
        title: '账号管理',
        authCode: 8002
      }
    },
    {
      path: 'securitySettings',
      component: () => import('@/views/userCenter/securitySettings/index.vue'),
      meta: {
        title: '安全设置',
        authCode: 8003
      }
    },
    {
      path: 'versionInfo',
      component: () => import('@/views/userCenter/versionInfo/index.vue'),
      meta: {
        title: '版本更新',
        authCode: 8005
      }
    },
    {
      path: 'feedback',
      component: () => import('@/views/userCenter/feedback/index.vue'),
      meta: {
        title: '使用反馈',
        authCode: 8006
      }
    },
    {
      path: 'protocol',
      component: () => import('@/views/userCenter/protocol/index.vue'),
      meta: {
        title: '平台相关协议'
      }
    },
    {
      path: 'document',
      component: () => import('@/views/userCenter/document/index.vue'),
      meta: {
        title: '帮助文档'
      }
    }
  ]
};
