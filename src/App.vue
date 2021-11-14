<template>
  <div id="nav">
    <router-link to="/contract-view">Contract Interface</router-link> |
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
@import "src/styles/global.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $vue-darkblue;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: $vue-darkblue;

    &.router-link-exact-active {
      color: $vue-green;
    }
  }
}
</style>
