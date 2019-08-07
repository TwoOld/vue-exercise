<template>
    <div>
        <label v-if="label">{{label}}</label>
        <slot></slot>
        <p v-if="errorMessage">{{errorMessage}}</p>
    </div>
</template>

<script>
/**
 *  为Input预留插槽 slot
 *  能够展示label和校验信息
 *  能够进行校验
 * */
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
        this.$on('validate', () => {
            this.validate()
        })
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
            }).catch(err => {
                throw err.errors[0].message
            })

        }
    },
}
</script>

<style scoped>
</style>