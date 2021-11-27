<template>
  <div class="home">
    <EventNotification v-bind:eventType="registrationStatusEvent" />
    <div v-if="showUserNotRegistered" class="container">
      <h1 class="title has-subtext">{{ texts.userNotRegistered.title }}</h1>
      <p class="subtitle">
        <b>{{ texts.currentUserAddress }}</b> {{ ethereumAccount }}
      </p>
      <hr class="horizontal-divider" />
      <ContractInterfaceInitiator
        :resolver-index="methodGroupingKeys.register"
        :expand-all-items="true"
        :propagate-events-for-methods="[methodIDs.REGISTER]"
        @contractCall="handleContractCall"
      />
    </div>
    <div v-else class="container">
      <h1 class="title has-subtext">{{ texts.userCheckRequired.title }}</h1>
      <p class="subtitle" v-html="texts.userCheckRequired.explanation"></p>
      <p class="subtitle">
        {{ texts.currentUserAddress }}<b>{{ ethereumAccount }}</b>
      </p>
    </div>
  </div>
</template>

<script>
import ContractInterfaceInitiator from "../components/ContractInterfaceInitiator";
import EventNotification from "../components/atoms/EventNotification.vue";
import { EventTypes } from "../services/eventListenerService";
import {
  methodGroupingKeys,
  methodIDs,
} from "../constants/contractInterfaceConfig";
import { apiCall_challenge } from "../services/apiCallService";
import { mapState } from "vuex";
import { routeNames } from "../router";
import { uiTexts } from "../constants/texts";

/*
TODO
  - also include title, subtitle (optional), hr (optional ?) in ContractInterfaceInitiator
 */

export default {
  name: "Home",
  components: {
    ContractInterfaceInitiator,
    EventNotification,
  },
  data() {
    return {
      methodGroupingKeys,
      methodIDs,
      registrationCheckDone: false,
      registrationStatusEvent: EventTypes.RegistrationStatus,
      texts: uiTexts.home,
    };
  },
  async mounted() {
    await this.checkUserRegistration().then(
      () => (this.registrationCheckDone = true)
    );
  },
  watch: {
    userRegistered(newVal) {
      if (newVal === true) {
        this.$router.push({ name: routeNames.CONTRACT_VIEW });
      }
    },
  },
  computed: {
    ...mapState("contracts", {
      ethereumAccount: (state) => state.userETHAccount,
      userRegistered: (state) => state.userRegistered,
    }),
    showUserNotRegistered() {
      return this.registrationCheckDone && !this.userRegistered;
    },
  },
  methods: {
    async checkUserRegistration() {
      this.$store.dispatch("appState/setIsLoading", true);
      // TODO: actual - for now just sign own account address - challenge will have to come
      // from backend
      const account = this.$store.getters["contracts/getUserETHAccount"];
      const signedValue = await window.web3.eth.sign(
        window.web3.utils.sha3(account),
        account
      );

      const payload = {
        signedValue: signedValue,
        value: account,
        address: account,
      };

      await apiCall_challenge(payload).then(async () => {
        this.$store.dispatch("appState/setIsLoading", false);
      });
    },
    handleContractCall(methodId) {
      if (methodId === methodIDs.REGISTER) {
        this.registrationCheckDone = false;
        // TODO. good until here, but here would have to listen to event from smart contract
        //  to trigger re-evaluation of user registration
        this.checkUserRegistration();
      }
    },
  },
};
</script>

<style lang="scss">
@import "src/styles/global.scss";

.home {
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
