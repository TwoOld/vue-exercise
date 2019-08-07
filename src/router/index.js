import Vue from "vue";
import Router from "vue-router";
import Layout from '@/layout'; // 布局页

Vue.use(Router);

// 通用页面：这里的配置时不需要权限的
export const constRoutes = [
    {
        path: "/login",
        component: () => import("@/views/Login"),
        hidden: true // 导航菜单忽略该项
    },
    {
        path: "/",
        component: Layout,// 应用布局
        redirect: "/home",
        meta: { title: 'Home', icon: 'qq' },
        children: [
            {
                path: "home",
                component: () =>
                    import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
                name: "home",
                meta: {
                    title: "家", // 导航菜单项标题
                    icon: "qq" // 导航菜单项图标
                }
            },
            {
                path: "mua",
                component: () =>
                    import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
                name: "mua",
                meta: {
                    title: "波一个", // 导航菜单项标题
                    icon: "wx" // 导航菜单项图标
                }
            }
        ]
    }
];

// 权限页面
export const asyncRoutes = [
    {
        path: "/about",
        component: Layout,
        redirect: "/about/index",
        meta: { title: 'About', icon: 'qq' },
        children: [
            {
                path: "index",
                component: () =>
                    import(/* webpackChunkName: "home" */ "@/views/About.vue"),
                name: "about",
                meta: {
                    title: "hi",
                    icon: "qq",
                    roles: ['editor']
                },
            },
            {
                path: "bla",
                component: () =>
                    import(/* webpackChunkName: "home" */ "@/views/About.vue"),
                name: "bla",
                meta: {
                    title: "you",
                    icon: "qq",
                    roles: ['admin']
                },
            },
        ]
    }
];

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: constRoutes
});