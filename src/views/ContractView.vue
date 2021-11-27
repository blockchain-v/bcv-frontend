<template>
  <div class="contract-interface">
    <div v-if="contractFound" class="container">
      <EventNotification
        v-for="(eventType, index) in eventTypes"
        v-bind:key="index"
        v-bind:eventType="eventType"
      />
      <h1 class="title has-subtext">Invoke Contract Calls</h1>
      <p class="subtitle"><b>using address:</b><br />{{ ethereumAccount }}</p>
      <hr class="horizontal-divider" />
      <ContractInterfaceInitiator :resolver-index="methodGroupingKeys.all" />
    </div>

    <div v-else class="container contract-not-found">
      <h1 class="title">Unable to resolve VNFDeployment Contract address</h1>
      <p>Please contact us if the issue persists</p>
    </div>
  </div>
</template>

<script>
import { VNFContract } from "../services/truffleService";
import { EventTypes } from "../services/eventListenerService";
import { methodGroupingKeys } from "../constants/contractInterfaceConfig";
import ContractInterfaceInitiator from "../components/ContractInterfaceInitiator";
import EventNotification from "../components/atoms/EventNotification.vue";
import { isNil as _isNil } from "lodash";

/*
TODO:
  - Debug weird error when manually triggering MM
    - reject automatic connection
    - initiate via button
    - still yields errors
  - unified/generic component for registration/deployment/... status messages
    - also unified interface to store
 */

export default {
  name: "ContractInterface",
  components: {
    ContractInterfaceInitiator,
    EventNotification,
  },
  data() {
    return {
      methodGroupingKeys,
      eventTypes: [
        EventTypes.DeploymentStatus,
        EventTypes.RegistrationStatus,
        EventTypes.UnregistrationStatus,
      ],
    };
  },
  computed: {
    contractFound() {
      return !_isNil(VNFContract._address);
    },
    ethereumAccount() {
      return this.$store.state.contracts.userETHAccount;
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.contract-interface {
  .container {
    border: 2px solid $green-cadetblue;
    margin: 40px 100px;
    padding: 20px 50px;

    &.contract-not-found {
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
