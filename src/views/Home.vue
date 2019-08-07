<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <router-view></router-view> -->
    <VuexTest></VuexTest>
  </div>
</template>

<script>
// @ is an alias to /src
import VuexTest from "@/components/vuex";

export default {
  name: "home",
  components: {
    VuexTest
  }
};
</script>
