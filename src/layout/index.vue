<template>
    <div class="app-wrapper">
        <SideBar></SideBar>
        <div class="main-container">
            <BreadCrumb></BreadCrumb>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
export default {
    components: {
        BreadCrumb,
        SideBar,
    },
}
</script>

<style lang="scss" scoped>
</style>