// 遍历模板，将里面的插值表达式处理
// 如果发现k-xx，@xx需特别处理
class Compile {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)

        if (this.$el) {
            // 使用Fragment处理元素，Fragment不在DOM树中，可提高性能
            // 1.将$el中的内容搬到一个fragment中
            this.$fragment = this.node2Fragment(this.$el)

            // 2.编译fragment
            this.compile(this.$fragment)

            // 3.将编译结果追加回宿主中
            this.$el.appendChild(this.$fragment)
        }
    }

    // 遍历el，将内容搬到fragment中
    node2Fragment(node) {
        // 创建Fragment
        const fragment = document.createDocumentFragment()

        let child
        while ((child = node.firstChild)) {
            fragment.appendChild(child)
        }

        return fragment
    }

    // 把动态值替换，把指令和事件做处理
    compile(el) {
        // 遍历el
        const childNodes = el.childNodes

        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                this.compileElement(node)
            } else if (this.isInterpolation(node)) {
                this.compileText(node)
            }

            // 递归
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }

    isElement(node) {
        return node.nodeType === 1
    }

    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    compileElement(node) {
        // 查看node的特性中是否有k-，@
        const nodeAttrs = node.attributes
        Array.from(nodeAttrs).forEach(attr => {
            // k-model='name' => attrName=model,exp=name
            const attrName = attr.name,
                exp = attr.value
            // 指令：k-xx
            if (attrName.indexOf('k-') === 0) {
                const dir = attrName.substring(2)
                // 执行指令
                this[dir] && this[dir](node, this.$vm, exp)
            } else if (attrName.indexOf('@') === 0) {
                // 事件 @click='handleClick'
                const eventName = attrName.substring(1)
                this.eventHandler(node, this.$vm, exp, eventName)
            }
        })
    }

    eventHandler(node, vm, exp, eventName) {
        // 获取回调函数
        const fn = vm.$options.methods && vm.$options.methods[exp]

        if (eventName && fn) {
            // 回调函数this指向当前组件
            node.addEventListener(eventName, fn.bind(vm))
        }
    }

    // 需要双向数据的绑定
    model(node, vm, exp) {
        // update是数据变了改界面
        this.update(node, vm, exp, 'model')

        // 界面变了改数据
        // 根据类型选择事件
        if (node.type === 'text') {
            node.addEventListener('input', e => {
                vm[exp] = e.target.value
            })
        }
        if (node.type === 'checkbox') {
            node.addEventListener('change', e => {
                vm[exp] = e.target.checked
            })
        }
    }

    text(node, vm, exp) {
        this.update(node, vm, exp, 'text')
    }

    html(node, vm, exp) {
        this.update(node, vm, exp, 'html')
    }

    // 把插值表达式替换为实际内容
    compileText(node) {
        // RegExp.$1是匹配()分组部分
        // /\{\{(.*)\}\}/.test('{{xxx}}') => RegExp.$1 => xxx
        // console.log(RegExp.$1)
        const exp = RegExp.$1
        this.update(node, this.$vm, exp, 'text')
    }

    // 编写update函数，可复用
    // exp是表达式，dir是具体操作：text,html,model
    update(node, vm, exp, dir) {
        const fn = this[dir + 'Updator']
        // Updator参数为元素、value
        fn && fn(node, vm[exp])
        // 创建Watcher
        new Watcher(vm, exp, function (args) {
            console.log(args)
            fn && fn(node, vm[exp])
        })
    }

    htmlUpdator(node, value) {
        node.innerHTML = value
    }

    modelUpdator(node, value) {
        // 根据类型选择赋值
        if (node.type === 'checkbox') {
            node.checked = value
        } else {
            node.value = value
        }
    }

    textUpdator(node, value) {
        node.textContent = value
    }
}