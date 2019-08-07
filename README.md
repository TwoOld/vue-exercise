### 组件间传值、通信

##### 父组件 => 子组件
- props
```
// 父组件
<Child title='I am Child'/>

// 子组件
props: { title: String }
```
- refs
```
// 父组件
<Child ref='child'/>
...
this.$refs.child.xxx
```
##### 子组件 => 父组件
- 自定义事件
```
// 父组件
<Child @say='handleSay'/>
...
handleSay(val) {
 console.log(val) // hello
}

// 子组件
this.$emit('say', 'hello')
```
##### 兄弟组件
- 通过共同的祖辈组件搭桥，\$parent 或 $root
```
// 兄弟1
this.$parent.$on('say', handleSay)

// 兄弟2
this.$parent.$emit('say', 'hello')
```
##### 祖先 => 后代
- provide&inject 传值
```
// 祖先
provide() {
  return { msg: 'hello world'}
}

// 后代
<span>{{ msg }}</span>
...
inject: ['msg']
```
- broadcast 通信
```
// 定义broadcast方法，指定派发事件名称和数据
function broadcast(eventName, data) {
  this.$children.forEach(child => {
    // 子组件出发$emit
    child.$emit(eventName, data)
    if(child.$children.length) {
      // 递归调用，通过call修改this指向child
      broadcast.call(child, eventName, data)
    }
  }
}
Vue.prototype.$broadcast = function (eventName, data) {
  broadcast.call(this, eventName, data)
}
```
##### 后代 => 祖先
- dispatch
```
// 定义dispatch方法，指定派发事件名称和数据
function dispatch(eventName, data) {
  let parent = this.$parent
  // 递归查找父元素
  while(parent) {
    // 父元素调用$emit出发事件
    parent.$emit('say', 'hello')
    parent = parent.$parent
  }
}
Vue.prototype.$dispatch = dispatch

// Child.vue
<h1 @click='dispatch("say", "hello")'>{{ msg }}</h1>

// App.vue
this.$on('say', this.handleSay)
```
##### 任意组件间
- 事件总线：创建一个Bus类负责事件派发、监听和回调管理（也可直接创建一个Vue实例，直接使用\$on和$emit）
```
// Bus：事件派发、监听和回调管理
class Bus {
  constructor() {
    this.callbacks = {}
  }
  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || []
    this.callbacks[name].push(fn)
  }
  $emit(name, args) {
    if(this.callbacks[name]) {
      this.callbacks[name].forEach(cb => cb(args))
    }
  }
}

// main.js
Vue.prototype.$bus = new Bus() // 也可用 new Vue()

// 组件1
this.$bus.$on('say', this.handleSay)
// 组件2
this.$bus.$emit('say', 'hello')
```
- [vuex](https://vuex.vuejs.org/zh/guide/)：创建唯一的全局数据管理者store，通过他管理数据并通知组件状态变更

### Vue 全局挂载组件的通用方法：仿ElementUI notice
1.文件目录
```
|--src
|    |--components
|    |    |--notice
|    |    |    |--Notice.vue #Notice组件
|    |--utils
|    |    |--create.js #挂载方法
```
2.编写Notice组件
```
<template>
    <div class="box" v-if="isShow">
        <h3>{{title}}</h3>
        <p class="box-content">{{message}}</p>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        message: {
            type: String,
            default: ""
        },
        duration: {
            type: Number,
            default: 1000
        }
    },
    data() {
        return {
            isShow: false
        };
    },
    methods: {
        show() {
            this.isShow = true;
            setTimeout(this.hide, this.duration);
        },
        hide() {
            this.isShow = false;
            this.remove();
        }
    }
};
</script>

<style scoped>
.box {
  position: fixed;
  width: 100%;
  top: 16px;
  left: 0;
  text-align: center;
  pointer-events: none;
}
.box-content {
  width: 200px;
  margin: 10px auto;
  font-size: 14px;
  border: blue 3px solid;
  padding: 8px 16px;
  background: #fff;
  border-radius: 3px;
  margin-bottom: 8px;
}
</style>
```
3.编写create.js
```
import Vue from 'vue'

export default function create(Component,props) {
  // 创建实例
  const vm = new Vue({
    render(h) {
      // h为createElement，返回VNode虚拟Node
      return h(Component,{props})
    }
  }).$mount()

  // 手动挂载实例到body
  document.body.appendChild(vm.$el)

  const comp = vm.$children[0]
  // 销毁方法
  comp.remove = function() {
    document.body.removeChild(vm.$el)
    vm.$destroy()
  }
  // 返回组件
  return comp
}
```
4.在main.js中将create挂载到Vue全局
```
// main.js
import create from "@/utils/create"

Vue.prototype.$create = create
```
5.调用
```
<template>
...
</template>

import Notice from "@/components/notice/Notice"

export default {
  ...
  methods: {
    ...
    handleNotice() {
      const notice = this.$create(Notice,{
        title: '提示',
        message: 'blablablablablabla',
        duration: 2000
      })
    }
  }
}
```

### Vue 组件应用：仿Element UI中的Form组件 简单版
##### 调用
- 由Form, FormItem 及实现双向绑定的Input组成
```
<template>
    <div>
        <h3>Element表单</h3>
        <hr>
        <k-form :model="model" :rules="rules" ref="loginForm">
            <k-form-item label="用户名" prop="username">
                <k-input v-model="model.username" autocomplete="off" placeholder="输入用户名"></k-input>
            </k-form-item>
            <k-form-item label="确认密码" prop="password">
                <k-input type="password" v-model="model.password" autocomplete="off"  placeholder='请输入密码'></k-input>
            </k-form-item>
            <k-form-item>
                <button @click="submitForm('loginForm')">提交</button>
            </k-form-item>
        </k-form>
        {{model}}
    </div>
</template>

<script>
import KForm from "./Form";
import KFormItem from "./FormItem";
import KInput from "./Input";

export default {
    components: {
        KForm,
        KFormItem,
        KInput
    },
    data() {
        return {
            model: { username: "tom", password: "" },
            rules: {
                username: [{ required: true, message: "请输入用户名" }],
                password: [{ required: true, message: "请输入密码" }]
            }
        };
    },
    methods: {
        submitForm(form) {
            this.$refs[form].validate(valid => {
                if (valid) { alert('请求登录！') } else { alert('校验失败！') }
            });
        }
    }
};
</script>
```
##### Input
- 双向绑定：@input、:value
- 派发校验事件
- v-bind='[$attrs](https://cn.vuejs.org/v2/api/#vm-attrs)'，实现非props属性绑定
```
<template>
    <div>
        <input :value="value" @input="onInput" v-bind="$attrs">
    </div>
</template>

<script>
export default {
    inheritAttrs: false,
    props: {
        value: {
            type: String,
            default: ''
        },
    },
    methods: {
        onInput(e) {
            this.$emit('input', e.target.value)
            // 派发校验事件
            this.$parent.$emit('validate')
        }
    },
}
</script>
```
##### FormItem
- 为Input预留插槽 slot
- 能够展示label和校验信息
- 能够进行校验
```
<template>
    <div>
        <label v-if="label">{{label}}</label>
        <slot></slot>
        <p v-if="errorMessage">{{errorMessage}}</p>
    </div>
</template>

<script>
import Schema from 'async-validator'

export default {
    inject: ['form'],
    props: {
        label: {
            type: String,
            default: ''
        },
        prop: {
            type: String
        }
    },
    data() {
        return {
            errorMessage: ''
        }
    },
    mounted() {
        this.$on('validate', this.validate)
    },
    methods: {
        validate() {
            const value = this.form.model[this.prop]
            const rules = this.form.rules[this.prop]
            // npm i async-validator -S
            const desc = { [this.prop]: rules }
            const schema = new Schema(desc)
            // return的是校验结果的Promise
            return schema.validate({ [this.prop]: value }, error => {
                if (error) {
                    this.errorMessage = error[0].message
                } else {
                    this.errorMessage = ''
                }
            })
        }
    },
}
</script>
```
##### Form
- 给FormItem预留插槽 slot
- 设置数据和校验规则
- 全局校验
```
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      form: this
    };
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: {
      type: Object
    }
  },
  methods: {
    validate(cb) {
      const tasks = this.$children
        .filter(item => item.prop)
        .map(item => item.validate());

      // 所有任务都通过才算校验通过
      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false));
    }
  }
};
</script>
```