<template>
    <div v-if="hasEventNotification" class="container">
      <p>
        {{ eventMessage }}
      </p>
    </div>
</template>

<script>
import { attachEventListener, getEventMessage } from '../../services/eventListenerService';
import { isNil as _isNil } from "lodash";
export default {
  name: "EventNotification",
  props: {
    eventType: {
      type: Number,
    },
    message: {
        type: String
    }
  },
  async created(){
    attachEventListener(this.$props.eventType, async (err, e) => {
        let message = getEventMessage(this.$props.eventType, e.returnValues);
        
        await this.setEventNotification(e, this.$props.eventType, message);
    });
  },
  computed:{
    hasEventNotification(){
      return this.hasNotifications(this.$props.eventType);
    },
    eventNotification(){
      return this.getEventNotification(this.$props.eventType).notification;
    },
    eventMessage(){
        return this.getEventNotification(this.$props.eventType).message;
    }
  },
  methods: {
    async setEventNotification(e, eventType, message){
      await this.$store.dispatch("contracts/setEventNotifications", {eventType: eventType, notification: e, message: message});
    },
    getEventNotification(eventType) {
      return this.$store.state.contracts.eventNotifications[eventType];
    },

    hasNotifications(eventType) {
      let notifications = this.$store.state.contracts.eventNotifications[eventType];
      return !_isNil(notifications);
    },
  }
};



</script>

<style scoped lang="scss"></style>
