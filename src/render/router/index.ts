import { useSendLogout } from '@/hooks/useSendIpc';
import { QjUserInfo, useUserAuthState } from '@/hooks/useUserInfo';
import { storage } from '@/utils/storage';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // progress bar style
import { RouteRecordRaw, Router, createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
NProgress.configure({ showSpinner: false });

let finishRoute = false;
const dynamicRoutes: any = {
  path: '/',
  name: 'Layout',
  component: () => import('@/layout/index.vue'),
  redirect: '/home'
};

const dynamicChildrenRoutes: any = [
  {
    path: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: 'fullNews',
    component: () => import('@/views/fullNews/index.vue'),
    meta: {
      title: '新闻列表页'
    }
  },
  {
    path: 'qjsc',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '安娜视窗'
    }
  }
];

const errorRoute = {
  path: '/:pathMatch(.*)*',
  component: () => import('@/layout/index.vue'),
  redirect: '/404',
  children: [
    {
      path: '404',
      component: () => import('@/views/errorPage/404.vue')
    }
  ]
};

/**
 * 添加主页路由
 */
const mainRoute: any[] = [];

const aminContext = import.meta.glob<{ default: any }>('./mainViews/*.ts', { eager: true });
Object.keys(aminContext).forEach((v) => {
  const route = aminContext[v].default;
  route.originalChildren &&
    route.originalChildren.forEach((r, index) => {
      r.meta && (r.meta.level = index);
    });
  mainRoute.push(route);
});
dynamicChildrenRoutes.push(...mainRoute);

/**
 * 添加详情页路由
 */
const detailRoute: RouteRecordRaw = {
  path: '/detail',
  name: 'Detail',
  component: () => import('@/layout/LayoutDetail.vue'),
  children: []
};
const detailContext = import.meta.glob<{ default: any }>('./details/*.ts', { eager: true });
Object.keys(detailContext).forEach((v) => {
  detailRoute.children.push(...detailContext[v].default);
});
routes.push(detailRoute);

// 创建路由
const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: routes.flat()
});

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (to.path === '/login') {
    finishRoute = false;
    next();
  } else if (to.meta && to.meta.webViewUrl) {
    const userInfo = storage.get<QjUserInfo>('userInfo');
    window.open(to.meta.webViewUrl + (to.meta.authCode == 1004 ? userInfo.platform : ''));
    next(false);
  } else {
    if (!finishRoute) {
      const routes = await generateMenu();
      if (routes) {
        router.removeRoute('Layout');
        // 动态添加可访问路由表
        router.addRoute(routes);
        router.addRoute(errorRoute);
        finishRoute = true;
        next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
      } else {
        next({ path: 'login', replace: true });
        useSendLogout();
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

const { getAuths } = useUserAuthState();

async function generateMenu() {
  await getAuths();
  const auths: string[] = storage.get('auths');
  if (!auths) {
    return;
  }
  const filterFun = (route) => {
    if (route.originalChildren) {
      route.children = route.originalChildren.filter((route) => filterFun(route));
      if (route.children.length == 0) {
        return false;
      }
    }
    if (route.meta && route.meta.authCode) {
      return auths.includes(`${route.meta.authCode}`);
    } else {
      return true;
    }
  };
  const childrenRoutes = dynamicChildrenRoutes.filter((route) => filterFun(route));
  // 添加重定向
  childrenRoutes.forEach((item) => {
    if (item.children) {
      item.redirect = item.path + '/' + item.children[0].path;
    }
  });
  dynamicRoutes.children = childrenRoutes;
  return dynamicRoutes;
}

export default router;
