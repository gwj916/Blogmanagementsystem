import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/control',
    children: [
      {
        path: 'control',
        name: 'Control',
        component: () => import('@/views/control/index'),
        meta: { title: '控制台', icon: 'el-icon-s-operation', auth: true }
      }
    ]
  },

  {
    path: '/index',
    component: Layout,
    children: [
      {
        path: 'slogan',
        name: 'Slogan',
        component: () => import('@/views/main/index'),
        meta: { title: '首页标语', icon: 'el-icon-s-home', auth: true }
      }
    ]
  },
  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/table',
    name: 'blog',
    meta: { title: '文章管理', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'bloglist',
        name: 'bloglist',
        component: () => import('@/views/table/index'),
        meta: { title: '文章列表', icon: 'el-icon-document-copy', auth: true },
      },
      {
        path: 'blogtype',
        name: 'blogtype',
        component: () => import('@/views/tree/index'),
        meta: { title: '文章分类', icon: 'el-icon-document', auth: true }
      },
      {
        path: 'addblog',
        name: 'Addblog',
        component: () => import('@/views/addblog/index'),
        meta: { title: '添加文章', icon: 'el-icon-document-add', auth: true }
      },
      {
        path: '/editblog/:id',
        name: 'editblog',
        component: () => import('@/views/editblog/index'),
        hidden: true,
        meta: { title: '编辑文章', icon: 'el-icon-document-add', auth: true }

      }
    ]
  },

  {
    path: '/project',
    component: Layout,
    redirect: '/project/mpm',
    name: 'mpm',
    meta: { title: '项目管理', icon: 'el-icon-takeaway-box', auth: true },
    children: [
      {
        path: '/proglist',
        name: 'proglist',
        component: () => import('@/views/mpms/index'),
        meta: { title: '项目列表', icon: 'el-icon-folder-opened', auth: true }
      },
      {
        path: '/addmpm',
        name: 'Addmpm',
        component: () => import('@/views/addmpm/index'),
        meta: { title: '添加项目', icon: 'el-icon-folder-add', auth: true }
      }
    ]
  },

  {
    path: '/comment',
    component: Layout,
    children: [
      {
        path: 'comments',
        name: 'Comments',
        component: () => import('@/views/form/index'),
        meta: { title: '评论管理', icon: 'el-icon-chat-square', auth: true }
      }
    ]
  },

  {
    path: '/message',
    component: Layout,
    children: [
      {
        path: 'board',
        name: 'Board',
        component: () => import('@/views/message/index'),
        meta: { title: '留言板', icon: 'el-icon-collection', auth: true }
      }
    ]
  },

  {
    path: '/aboutme',
    component: Layout,
    children: [
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/about/index'),
        meta: { title: '关于我', icon: 'el-icon-s-custom', auth: true }
      }
    ]
  },
  {
    path: '/sets',
    component: Layout,
    children: [
      {
        path: 'set',
        name: 'Set',
        component: () => import('@/views/set/index'),
        meta: { title: '设置', icon: 'el-icon-s-tools', auth: true }
      }
    ]
  },
  {
    path: '/personalSetting',
    component: Layout,
    hidden: true,
    meta: { children: ['/personalSetting'] },
    children: [
      {
        path: '/personalSetting',
        name: 'PersonalSetting',
        component: () => import('@/views/personalSetting/index'),
        meta: { title: '个人中心', icon: 'el-icon-document-copy', auth: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
