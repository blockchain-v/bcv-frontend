<template>
  <div id="app">
    <div v-if="showNavigation" class="navigation">
      <!--      <router-link to="/contract-view">Contract Interface</router-link> |-->
      <!--      <router-link to="/backend-view">Make API Calls</router-link> |-->
      <div class="nav-items">
        <router-link to="/vnf">VNF</router-link> |
        <router-link to="/vnfd">VNFD</router-link>

        <div class="address" v-if="userETHAccount">
          {{ userETHAccount }}
        </div>
        <div v-else>|</div>

        <router-link to="/user">User</router-link> |
        <router-link to="/about">About</router-link>
      </div>

      <hr />
    </div>
    <div v-if="showLoadingScreen" class="loading-container">
      <PulseLoader />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { routeNames } from "./router";
import { mapState } from "vuex";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
  name: "App",
  components: {
    PulseLoader,
  },
  computed: {
    ...mapState("appState", {
      showLoadingScreen: (state) => state.isLoading,
    }),
    ...mapState("contracts", {
      userETHAccount: (state) => state.userETHAccount,
    }),
    showNavigation() {
      return (
        this.$route.name !== routeNames.ROOT &&
        this.$route.name !== routeNames.HOME
      );
    },
  },
};
</script>

<style lang="scss">
@import "src/styles/global.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $vue-darkblue;
  height: 100%;
  width: 100%;

  .navigation {
    padding: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;

    .nav-items {
      display: flex;
      justify-content: center;
    }

    hr {
      width: 800px;
    }

    a {
      font-weight: bold;
      color: $vue-darkblue;
      text-decoration: none;
      margin: 0 10px;

      &.router-link-exact-active {
        color: $vue-green;
      }
    }
  }

  .loading-container {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $white;
    opacity: 0.6;
  }
}
</style>
