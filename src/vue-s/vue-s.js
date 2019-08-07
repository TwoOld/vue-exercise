class VueS {
    constructor(options) {
        this.$options = options
        this.$data = options.data

        this.observe(this.$data)

        // test Watcher
        // new Watcher(this, 'test')

        new Compile(options.el, this)

        if (options.created) {
            options.created.call(this)
        }
    }

    observe(data) {
        if (!data || typeof data !== 'object') {
            return
        }

        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
            this.proxyData(key)
        })
    }

    defineReactive(obj, key, val) {
        this.observe(val)

        const dep = new Dep()
        Object.defineProperty(obj, key, {
            get() {
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

class Dep {
    constructor() {
        this.deps = []
    }

    addDep(watcher) {
        this.deps.push(watcher)
    }

    notify() {
        this.deps.forEach(watcher => watcher.update())
    }
}

class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb

        Dep.target = this
        this.vm[this.key]
        Dep.target = null
    }

    update() {
        // console.log(`${this.key}属性更新了`)
        this.cb.call(this.vm)
    }
}