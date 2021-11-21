<template>
  <div class="home">
    <div class="navigation"></div>
    <router-link to="/contract-view">Contract Interface</router-link> |
    <router-link to="/backend-view">Make API Calls</router-link> |
    <router-link to="/about">About</router-link>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>

<style lang="scss">
@import "src/styles/global.scss";

.home {
  .navigation {
    padding: 30px;

    a {
      font-weight: bold;
      color: $vue-darkblue;

      &.router-link-exact-active {
        color: $vue-green;
      }
    }
  }
}
</style>
