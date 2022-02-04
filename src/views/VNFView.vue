<template>
  <div class="vnf-view">
    <div class="container">
      <EventNotification
        v-for="(eventType, index) in eventTypes"
        :key="index"
        :eventType="eventType"
      />
      <h1 class="title">VNF Controls</h1>
      <hr class="horizontal-divider" />
      <InterfaceInitiator :action-list="vnfActionList" />
    </div>
  </div>
</template>

<script>
import InterfaceInitiator from "../components/InterfaceInitiator";
import { EventTypes } from "../services/eventListenerService";
import EventNotification from "../components/atoms/EventNotification.vue";
import { vnfActionList } from "../constants/interfaceConfig";

export default {
  name: "VNFView",
  components: {
    InterfaceInitiator,
    EventNotification,
  },
  data() {
    return {
      eventTypes: [
        EventTypes.DeploymentStatus,
        EventTypes.RegistrationStatus,
        EventTypes.UnregistrationStatus,
      ],
      vnfActionList,
    };
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.vnf-view {
  .container {
    border: 2px solid $green-cadetblue;
    margin: 40px 100px;
    padding: 20px 50px;

    &.error {
      border: 2px solid $red;
      background-color: $red-salmon;
    }

    .subtitle {
      font-size: 18px;
    }

    .title {
      margin-bottom: 40px;

      &.has-subtext {
        margin-bottom: unset;
      }
    }

    .horizontal-divider {
      margin-bottom: 20px;
      font-size: 10px;
      background-color: $green-white;
    }
  }
}
</style>
