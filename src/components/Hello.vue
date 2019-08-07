<template>
  <div>
      {{msg+'/'+count}}
      <div>
      <input type="text" placeholder="输入新特性" @keyup.enter="addFeature" />
    </div>
      <ul>
          <li v-for="f in features" :key="f.id">{{f.name}}</li>
      </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, Getter, namespace } from 'vuex-class';

interface Feature {id: number, name: string}
interface Result<T> { ok: 0|1, data: T[] }
function getData<T>(): Promise<Result<T>> {
    const data: any[]=[{id:1,name:'类型注解'},{id:2,name:'类型推论'}]
    return new Promise(resolve=>{
        resolve({
            ok:1,
            data
        })
    })
}
@Component({
    props: {
        msg: {
            type: String,
            default: 'msg'
        }
    }
})
export default class Hello extends Vue {
    // @Prop({default:'msg'}) msg!: string

    @State('features') features!: Feature[]

    @Action('addFeature') addFeatureAction:any

    constructor(){
        super()
    }

    // 作为生命周期钩子
    async created(){
        // const res = await getData<Feature>()
        // this.features = res.data
    }

    // 声明的方法将来会加入到methods里面，除了生命周期函数
    @Emit('foo')
    addFeature(e: any) {
        const val = e.target.value
        this.addFeatureAction(val)
        // this.features.push({id:this.features.length+1,name:val})
        e.target.value = ''
        return val
    }

    @Watch('msg')
    onMsgChange(val: string, oldVal: any) {
        alert(val+'/'+oldVal+'/'+this.count)
    }
    
    // 存取器实现计算属性
    get count() {
        return this.features.length;
    }
}
</script>

<style>
</style>
