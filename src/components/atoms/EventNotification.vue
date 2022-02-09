<template>
  <div
    v-if="hasEventNotification && isVisible"
    class="notification"
    :class="{ error: isErroneous }"
  >
    <div class="button-container">
      <span class="close" @click="isVisible = false">&times;</span>
    </div>
    <span :class="{ 'event-error': isErroneous }">
      {{ eventMessage }}
    </span>
  </div>
</template>

<script>
import {
  attachEventListener,
  getEventMessage,
} from "../../services/eventListenerService";
import { isNil as _isNil } from "lodash";
export default {
  name: "EventNotification",
  props: {
    eventType: {
      type: Number,
    },
    message: {
      type: String,
    },
  },
  data() {
    return {
      isVisible: false,
    };
  },
  async created() {
    attachEventListener(this.eventType, async (err, e) => {
      let message = getEventMessage(this.eventType, e.returnValues);

      await this.setEventNotification(e, this.eventType, message);

      this.isVisible = true;

      setTimeout(async () => {
        this.isVisible = false;
      }, 10000);
    });
  },
  computed: {
    hasEventNotification() {
      return this.hasNotifications(this.eventType);
    },
    eventNotification() {
      return this.getEventNotification(this.eventType).notification;
    },
    eventMessage() {
      return this.getEventNotification(this.eventType).message;
    },
    isErroneous() {
      let hasError = !this.getEventNotification(this.eventType).notification
        .returnValues["success"];
      console.log("IsErroneous", hasError);
      return hasError;
    },
  },
  methods: {
    async setEventNotification(e, eventType, message) {
      await this.$store.dispatch("contracts/setEventNotifications", {
        eventType: eventType,
        notification: e,
        message: message,
      });
    },
    getEventNotification(eventType) {
      return this.$store.state.contracts.eventNotifications[eventType];
    },

    hasNotifications(eventType) {
      let notifications =
        this.$store.state.contracts.eventNotifications[eventType];
      return !_isNil(notifications);
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.button-container {
  margin-top: 15px;
}

.notification {
  border: 1px solid $green-cadetblue;
  border-radius: 10px;
  background-color: $green-white;
  color: $vue-darkblue;
  position: relative;
  //position: fixed;
  z-index: 20;
  //top: 145px;
  //right: 100px;
  float: right;
  margin: 10px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 20px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 4px 4px 4px grey;

  &.error {
    border-color: $red;
    background-color: $red-light;
  }
}

.close {
  user-select: none;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 12px;
  font-weight: bold;
  font-size: 20px;
  float: right;
}
</style>
