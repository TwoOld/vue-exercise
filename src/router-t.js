import Home from "./views/Home";
import About from "./views/About";
import Vue from "vue";
// 实现插件 
// url变化监听 
// 路由配置解析： {‘/’: Home} 
// 实现全局组件：router-link router-view
class VueRouter {
    constructor(options) {
        this.$options = options
        // 解析后的路由
        this.routeMap = {}

        // 实现路由响应式
        this.app = new Vue({
            data: {
                current: '/'
            }
        })
    }

    init() {
        this.bindEvents()// 监听url
        this.createRouteMap(this.$options)// 解析路由配置
        this.initComponent()// 实现两个组件
    }

    bindEvents() {
        window.addEventListener('load', this.onHashChange.bind(this))
        window.addEventListener('hashchange', this.onHashChange.bind(this))
    }

    onHashChange() {
        this.app.current = window.location.hash.slice(1) || '/'
    }

    createRouteMap(options) {
        options.routes.forEach(item => {
            this.routeMap[item.path] = item.component
        })
    }

    initComponent() {
        // <router-link to='/about'>About</router-link>
        Vue.component('router-link', {
            props: { to: String, required: { type: Boolean, default: true } },
            render(h) {
                return h('a', { attrs: { href: '#' + this.to } }, [
                    this.$slots.default
                ])
            }
        })
        // <router-view></router-view>
        Vue.component('router-view', {
            render: (h) => {
                const comp = this.routeMap[this.app.current]
                return h(comp)
            }
        })
    }
}
VueRouter.install = function (Vue) {
    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
                this.$options.router.init()
            }
        }
    })
}
Vue.use(VueRouter);

export default new VueRouter({
    routes: [{ path: "/", component: Home }, { path: "/about", component: About }]
});