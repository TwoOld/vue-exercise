<template>
  <div>{{msg}}</div>
</template>

<script lang='ts'>
import { Vue } from "vue-property-decorator";

function Component(options:any) {
  return function(target:any) {
    const options: any = {
      data() {
        return { msg: "mua~~~~" };
      }
    };
    // 输出组件构造函数
    return Vue.extend(options); 
  };
}

@Component
export default class Decor extends Vue {
  msg: string = "";
}
</script>

<style scoped>
</style>