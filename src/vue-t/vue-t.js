class VueT {
    constructor(options) {
        this.$options = options

        this.$data = options.data
        // 响应化
        this.observe(this.$data)

        // test
        // new Watcher(this, 'test')
        // this.test

        // 创建编译器
        new Compile(options.el, this)

        if (options.created) {
            options.created.call(this)
        }
    }

    // 递归遍历，使传递进来的对象响应化
    observe(data) {
        if (!data || typeof data !== 'object') {
            return
        }
        // 遍历
        Object.keys(data).forEach(key => {
            // 对key进行响应式处理
            this.defineReactive(data, key, data[key])
            // 代理属性：vm.xxx => vm.$data.xxx
            this.proxyData(key)
        })
    }

    // 在vue根上定义属性代理data中的数据
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

    defineReactive(obj, key, val) {
        // 递归处理对象
        this.observe(val)

        // 创建Dep实例：Dep和key一对一对应
        // 每个属性(key)对应一个专属的Dep实例
        const dep = new Dep()

        // 给obj定义属性
        Object.defineProperty(obj, key, {
            get() {
                // 触发get时判断Dep.target指向
                // 将Dep.target指向的Watcher加入到Dep中
                Dep.target && dep.addDep(Dep.target)
                return val
            },
            set(newVal) {
                if (newVal !== val) {
                    val = newVal
                    dep.notify()
                }
            }
        })
    }
}

// 管理若干个watcher实例，它和key一对一关系
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

// 保存ui中依赖，实现update函数可以更新之
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb

        // 将当前实例指向Dep.target
        Dep.target = this
        this.vm[this.key] // 读一次key触发getter
        Dep.target = null
    }

    update() {
        // console.log(`${this.key}属性更新了`)
        this.cb.call(this.vm, this.vm[this.key])
    }
}