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
      <div
        v-for="notification in notifications"
        :key="`notification-${notification.id}`"
      >
        <EventNotification
          v-if="isEventNotification(notification)"
          :payload="notification"
        />
        <CallNotification v-else :payload="notification" />
      </div>
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
import {
  attachEventListener,
  getEventMessage,
  clearSubscriptions,
  removeListenerAfterFeedback,
} from "./services/eventListenerService";
import { isNil as _isNil } from "lodash";
import { apiCall_GET_errorMsg } from "./services/apiCallService";
import { QUERY_PARAMS } from "./constants/http";

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
      queryParams: QUERY_PARAMS,
      listeners: {},
    };
  },
  created() {
    clearSubscriptions();
    this.attachEventListeners();
  },
  beforeUnmount() {
    try {
      this.removeAllEventListeners();
    } catch (e) {
      console.warn("error whilst unsubscribing, refresh page");
    }
  },
  computed: {
    ...mapState("appState", {
      showLoadingScreen: (state) => state.isLoading,
    }),
    ...mapState("contracts", {
      userETHAccount: (state) => state.userETHAccount,
      eventNotifications: (state) => state.eventNotificationQueue,
    }),
    ...mapState("backend", {
      callNotifications: (state) => state.apiNotificationQueue,
    }),
    notifications() {
      const notifications = [
        ...this.eventNotifications,
        ...this.callNotifications,
      ];
      // have to be sorted by timestamp, else event notifications will always be inserted
      // above  all notifications. this way they mix
      return notifications.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
    },
    showNavigation() {
      return (
        this.$route.name !== routeNames.ROOT &&
        this.$route.name !== routeNames.HOME
      );
    },
  },
  methods: {
    attachEventListeners() {
      Object.values(this.eventTypes).forEach((event) => {
        this.listeners[event] = {
          id: attachEventListener(event, this.getFeedBackHandler(event)),
        };
      });
    },
    isEventNotification(notification) {
      return !_isNil(notification.msg);
    },
    getFeedBackHandler(event) {
      switch (event) {
        case 0:
          return this.registrationHandler;
        case 1:
          return this.unregistrationHandler;
        case 2:
          return this.deploymentHandler;
        case 3:
          return this.deletionHandler;
        default:
          console.warn("unknown event type", event);
          return () => {};
      }
    },
    logEvent(event) {
      // required as it (somehow) prevents the handlers from being called 4 times. not sure why that happens
      console.log("e:", event);
    },
    /* I separated the handlers so that only one trigger happens, else all
    listeners trigger the handler -> 4 triggers */
    async deploymentHandler(error, event) {
      if (event && event.event === "DeploymentStatus") {
        this.logEvent(event);
        const params = {
          [QUERY_PARAMS.DEPLOYMENT_ID]: event.returnValues.deploymentId,
        };
        await this.writeToEventNotificationQueue(event, params);
      }
    },
    async deletionHandler(error, event) {
      if (event && event.event === "DeletionStatus") {
        this.logEvent(event);
        await this.writeToEventNotificationQueue(event);
      }
    },
    async registrationHandler(error, event) {
      if (event && event.event === "RegistrationStatus") {
        this.logEvent(event);
        await this.writeToEventNotificationQueue(event);
      }
    },
    async unregistrationHandler(error, event) {
      if (event && event.event === "UnregistrationStatus") {
        this.logEvent(event);
        await this.writeToEventNotificationQueue(event);
      }
    },
    async writeToEventNotificationQueue(event, params = null) {
      let errorMsg = null;
      if (!event.returnValues["success"] && params) {
        // if failure and for a call that treats those (has params) grab error message from backend
        const response = await apiCall_GET_errorMsg(params);
        errorMsg = response.message;
      }

      this.$store.commit("contracts/writeToEventNotificationQueue", {
        eventType: this.eventTypes[event.event],
        isError: !event.returnValues["success"],
        errorMsg,
        body: event,
        msg: getEventMessage(this.eventTypes[event.event], event.returnValues),
      });
    },
    removeAllEventListeners() {
      Object.values(this.listeners).forEach((handler) => {
        removeListenerAfterFeedback(handler);
      });
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
