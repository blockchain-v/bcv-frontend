<template>
  <div class="notification" :class="{ error: isError, remove: remove }">
    <div class="button-container" v-if="!remove">
      <span class="close" @click="handleClose">&times;</span>
    </div>
    <span
      class="f-info message title"
      :class="{ 'event-error': isError }"
      v-if="!remove"
    >
      <b>{{ notificationMessage }}</b
      ><br />
    </span>
    <div v-if="!remove && hasAdditionalMessage">
      <span
        class="f-info message"
        :class="{ 'event-error': isError }"
        v-for="(msg, index) in additionalMessage"
        :key="index"
        >{{ msg }}<br
      /></span>
    </div>
  </div>
</template>

<script>
import { uiTexts } from "../../constants/texts";
import { actionIDs } from "../../constants/interfaceConfig";
import { isNil as _isNil } from "lodash";

export default {
  name: "CallNotification.vue",
  props: {
    payload: {
      // expects notification object as seen in backend store
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      remove: false,
      texts: uiTexts.callNotification,
      actionIDs,
    };
  },
  created() {
    // initiate timer that destroy msg in store -> will resolve entire component
    setTimeout(() => {
      this.purgeFromQueue();
    }, 10000);
  },
  computed: {
    isError() {
      return this.payload.isError;
    },
    notificationMessage() {
      return this.isError
        ? this.texts[this.payload.actionId].error
        : this.texts[this.payload.actionId].success;
    },
    hasAdditionalMessage() {
      return !_isNil(this.additionalMessage);
    },
    additionalMessage() {
      switch (this.payload.actionId) {
        case actionIDs.POST_VNFD:
          return this.isError
            ? this.getErrorMsg()
            : [`With VNFD ID ${this.getVnfdId()}`];
        default:
          return null;
      }
    },
  },
  methods: {
    handleClose() {
      this.purgeFromQueue();
    },
    getVnfdId() {
      return this.payload?.body?.data?.id;
    },
    getErrorMsg() {
      const errorString = this.payload?.body?.data?.Error;
      if (!errorString) {
        return "";
      }
      const errorObject = JSON.parse(errorString);
      if (errorObject?.TackerError) {
        // received a tacker specific error
        const messages = [];
        messages.push(`Status code: ${this.payload?.body?.status}`);
        messages.push(`Error type: ${errorObject?.TackerError?.type}`);
        messages.push(`Message: ${errorObject?.TackerError?.message}`);
        return messages;
      }
      // cases for e.g. regular non-tacker backend errors
      return "";
    },
    purgeFromQueue() {
      this.remove = true;
      // allow for the css to resolve the 'remove' class before destroying entry
      setTimeout(() => {
        this.$store.commit("backend/purgeNotification", this.payload.id);
      }, 600);
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
  z-index: 20;
  float: right;
  margin: 10px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 20px;
  font-size: 14px;
  box-shadow: 4px 4px 4px grey;
  // gives impression of notifications "moving up" when space becomes free
  transition: all 0.6s ease-out;
  text-align: start;
  width: fit-content;

  &.remove {
    // reduce component completely
    opacity: 0;
    height: 0;
    padding: 0;
    margin: 0;
    border-width: 0;
    // move out of container before componentUnmount to free up space for
    // potential notifications below to "move up"
    top: -400px;
  }

  &.error {
    border-color: $red;
    background-color: $red-light;
  }
}

.message {
  &.title {
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
