class VueE {
    // 初始化参数
    // 实现响应式的$data
    constructor(options) {
        this.$options = options
        this.$data = options.data

        // 响应化
        this.observe(this.$data)

        // 创建编译器
        new Compile(options.el, this)

        if (options.created) {
            options.created.call(this)
        }
    }

    observe(data) {
        if (!data || typeof data !== 'object') {
            return
        }

        // 遍历
        Object.keys(data).forEach(key => {
            // 对key进行响应化处理
            this.defineReactive(data, key, data[key])
            // 代理属性 vm.xxx => vm.$data.xxx
            this.proxyData(key)
        })
    }

    defineReactive(obj, key, val) {
        // 递归
        this.observe(val)

        // 创建Dep实例
        // 每个key对应一个Dep实例
        const dep = new Dep()

        // 给obj定义属性
        Object.defineProperty(obj, key, {
            get() {
                // 触发get时判断Dep.target指向
                // 将Dep.target指向的Watcher加入到当前key对应的Dep中
                Dep.target && dep.addDep(Dep.target)
                return val
            },
            set(newVal) {
                if (val !== newVal) {
                    val = newVal
                    // 通知变化
                    dep.notify()
                }
            }
        })
    }

    // 在vue根上定义属性，代理data中的数据
    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key]
            },
            set(newVal) {
                this.$data[key] = newVal
            }
        })
    }
}

// 与key一对一
// 管理若干个Watcher实例
class Dep {
    constructor() {
        this.deps = []
    }

    addDep(watcher) {
        this.deps.push(watcher)
    }

    notify() {
        this.deps.forEach(dep => dep.update())
    }
}

// 保存ui中的依赖，实现update函数可更新之
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb

        // 将当前实例指向Dep.target
        Dep.target = this
        this.vm[this.key] // 触发getter进行收集
        Dep.target = null // 置空
    }

    update() {
        // this.key属性更新
        this.cb.call(this.vm, this.vm[this.key])
    }
}