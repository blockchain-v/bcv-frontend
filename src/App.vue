<template>
  <div id="app">
    <div v-if="showNavigation" class="navigation">
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
    <Spinner v-if="showLoadingScreen" :lock-background="true" />
    <div class="notification-container">
      <EventNotification
        v-for="(eventType, index) in eventTypes"
        :key="index"
        :eventType="eventType"
      />
      <CallNotification
        v-for="notification in callNotifications"
        :key="`notification-${notification.id}`"
        :payload="notification"
      />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { routeNames } from "./router";
import { mapState } from "vuex";
import Spinner from "./components/atoms/Spinner";
import EventNotification from "./components/atoms/EventNotification.vue";
import CallNotification from "./components/atoms/CallNotification";
import { EventTypes } from "./services/eventListenerService";

export default {
  name: "App",
  components: {
    EventNotification,
    CallNotification,
    Spinner,
  },
  data() {
    return {
      eventTypes: EventTypes,
    };
  },
  computed: {
    ...mapState("appState", {
      showLoadingScreen: (state) => state.isLoading,
    }),
    ...mapState("contracts", {
      userETHAccount: (state) => state.userETHAccount,
    }),
    ...mapState("backend", {
      callNotifications: (state) => state.apiNotificationQueue,
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
  font-family: $default-font-family;
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

  .notification-container {
    visibility: visible;
    position: fixed;
    right: 100px;
    top: 145px;
    display: flex;
    flex-direction: column;
    z-index: 19;
    align-items: flex-end;

    &.show {
      visibility: visible;
      z-index: 19;
    }
  }
}
</style>
