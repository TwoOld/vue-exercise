// 使用参数中的Vue，可避免在插件中打包Vue
let Vue;

// 实现插件
// 实现四个东西：state/mutations/actions/getters
// 创建Store
// 数据响应式
class Store {
    constructor(options) {
        this.state = new Vue({
            data: options.state
        })
        this.mutations = options.mutations || {}
        this.actions = options.actions

        options.getters && this.handleGetters(options.getters)
    }

    // 箭头函数，实现actions中this绑定为当前作用域
    commit = (type, arg) => {
        this.mutations[type](this.state, arg)
    }

    dispatch(type, arg) {
        this.actions[type](
            {
                commit: this.commit,
                state: this.state
            },
            arg
        )
    }

    handleGetters(getters) {
        this.getters = {}// 定义this.getters
        // 遍历参数getters选项，为this.getters定义getters
        // 属性名就是选项中的key，只需要定义get函数保证其只读性
        Object.keys(getters).forEach(key => {
            Object.defineProperty(this.getters, key, {
                // 依然箭头函数
                get: () => {
                    return getters[key](this.state)
                }
            })
        })
    }
}

function install(_Vue) {
    Vue = _Vue
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}

export default { Store, install };
