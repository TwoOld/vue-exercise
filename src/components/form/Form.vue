<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
/**
 *  给FormItem预留插槽 slot
 *  设置数据和校验规则
 *  全局校验
 */
export default {
    provide() {
        return {
            form: this
        }
    },
    props: {
        model: {
            type: Object,
            required: true
        },
        rules: {
            type: Object
        },
    },
    methods: {
        validate(cb) {
            const tasks = this.$children
                .filter(item => item.prop)
                .map(item => item.validate())
            // 所有任务都通过才算校验通过
            Promise.all(tasks)
                .then(() => cb(true))
                .catch(() => cb(false))
        }
    },
}
</script>

<style scoped>
</style>