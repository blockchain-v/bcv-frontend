<template>
  <div
    v-if="hasEventNotification && this.isVisible"
    class="container"
    :class="{ 'event-error': isErroneous }"
  >
    <p>
      {{ eventMessage }}
    </p>
    <div class="button-container">
      <CustomButton
        @button-click="this.isVisible = false"
        button-text="dismiss"
      />
    </div>
  </div>
</template>

<script>
import {
  attachEventListener,
  getEventMessage,
} from "../../services/eventListenerService";
import { isNil as _isNil } from "lodash";
import CustomButton from "./CustomButton.vue";
export default {
  components: { CustomButton },
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
    attachEventListener(this.$props.eventType, async (err, e) => {
      let message = getEventMessage(this.$props.eventType, e.returnValues);

      await this.setEventNotification(e, this.$props.eventType, message);

      this.isVisible = true;

      setTimeout(() => {
        this.isVisible = false;
      }, 10000);
    });
  },
  computed: {
    hasEventNotification() {
      return this.hasNotifications(this.$props.eventType);
    },
    eventNotification() {
      return this.getEventNotification(this.$props.eventType).notification;
    },
    eventMessage() {
      return this.getEventNotification(this.$props.eventType).message;
    },
    isErroneous() {
      let hasError = !this.getEventNotification(this.$props.eventType)
        .notification.returnValues["success"];
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

.event-error {
  color: red;
}

.button-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0 30px;
}
</style>
