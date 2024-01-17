/**
 * 详情页路演
 */
export default [
  {
    path: 'webview',
    name: 'Webview', //可使用 name跳转
    component: () => import('@/views/details/WebviewDetail.vue')
  },
  {
    path: 'pdfDetail',
    name: 'PDFViewDetail',
    component: () => import('@/views/details/PDFViewDetail.vue')
  },
  {
    path: 'news-detail',
    name: 'NewsDetail', //可使用 name跳转
    component: () => import('@/views/details/NewsDetail.vue')
  },
  {
    path: 'roadshowDetail',
    name: 'RoadshowDetail',
    component: () => import('@/views/details/RoadshowDetail.vue')
  },
  {
    path: 'videoDetail',
    name: 'VideoDetail',
    component: () => import('@/views/details/VideoDetail.vue')
  },
  {
    path: 'laws-detail',
    name: 'LawsDetail',
    component: () => import('@/views/superviseData/lawsRegulations/lawsDetail.vue')
  },
  {
    path: 'xinPhiDetail',
    name: 'XinPhiDetail',
    component: () => import('@/views/scData/xinPhiManage/XinPhiDetail.vue')
  },
  {
    path: 'regulatory-detail',
    name: 'RegulatoryDynamicsDetail',
    component: () => import('@/views/superviseData/regulatoryDynamics/RegulatoryDynamicsDetail.vue')
  },
  {
    path: 'smartBond-detail',
    name: 'SmartBondDetail',
    component: () => import('@/views/scData/smartBond/SmartBondDetail.vue')
  }
];
