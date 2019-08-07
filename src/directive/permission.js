import store from "../store"

const permission = {
    inserted(el, binding) {
        const { value: pRoles } = binding
        const roles = store.getters && store.getters.roles

        if (pRoles && pRoles instanceof Array && pRoles.length > 0) {
            const hasPermission = roles.some(role => {
                return pRoles.includes(role)
            })

            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error(`出错了`)
        }
    }
}

export default permission