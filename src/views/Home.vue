<template>
  <div class="home">
    <h1>Home Page</h1>
    <button v-permission='["admin","editor"]'>editor</button>
    <button v-permission='["admin"]'>admin</button>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  },
  created() {
    setTimeout(() => {
      { console.log('this', this) }
    }, 1000);
  }
};
</script>
