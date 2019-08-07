import Vue from "vue";
import App from "./App.vue";
import create from "@/utils/create";
import router from './router'

Vue.config.productionTip = false;

Vue.prototype.$dispatch = dispatch

Vue.prototype.$boardcast = function (eventName, data) {
  boardcast.call(this, eventName, data)
}

function boardcast(eventName, data) {
  this.$children.forEach(child => {
    // 子元素触发事件
    child.$emit(eventName, data)
    if (child.$children.length) {
      // 递归查找子元素，通过call修改this指向child
      boardcast.call(child, eventName, data)
    }
  })
}

function dispatch(eventName, data) {
  let parent = this.$parent
  // 查找父元素
  while (parent) {
    // 父元素触发事件
    parent.$emit(eventName, data)
    // 递归查找父元素
    parent = parent.$parent
    if (!parent) {
      break
    }
  }
}

class Bus {
  constructor() {
    // {
    //   eventName1:[fn1,fn2],
    //   eventName2:[fn3,fn4],
    // }
    this.callbacks = {};
  }
  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(fn);
  }
  $emit(name, args) {
    if (this.callbacks[name]) {
      // 存在 遍历所有callback
      this.callbacks[name].forEach(cb => cb(args));
    }
  }
}

// function Bus() {
//   const callbacks = {}

//   this.$on = function (name, fn) {
//     callbacks[name] = callbacks[name] || []
//     callbacks[name].push(fn)
//   }

//   this.$emit = function (name, args) {
//     if (callbacks[name]) {
//       callbacks[name].forEach(cb => cb(args))
//     }
//   }
// }

Vue.prototype.$bus = new Bus();
Vue.prototype.$create = create;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
