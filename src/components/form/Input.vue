<template>
    <div>
        <input :value="value" @input="onInput" v-bind="$attrs">
    </div>
</template>

<script>
/**
 *  双向绑定：@input、:value
 *  派发校验事件
 *  v-bind='$attrs'，实现非props属性绑定
 */
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

            this.$parent.$emit('validate')
        }
    },
}
</script>

<style scoped>
</style>