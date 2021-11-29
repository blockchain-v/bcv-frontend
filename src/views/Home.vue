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
      <p class="subtitle" v-html="texts.userCheckRequired.hint"></p>
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
import {
  apiCall_PUT_token,
  apiCall_POST_token,
} from "../services/apiCallService";
import { mapState } from "vuex";
import { routeNames } from "../router";
import { uiTexts } from "../constants/texts";
import { isNil as _isNil } from "lodash";

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
  mounted() {
    this.initiateUserRegistrationCheck();
  },
  watch: {
    userRegistered(newVal) {
      if (newVal === true) {
        this.$router.push({ name: routeNames.CONTRACT_VIEW });
      }
    },
    nonce(newVal, oldVal) {
      if (newVal !== oldVal && !_isNil(newVal)) {
        // a new nonce has been set to store -> execute signature and backend token fetch
        this.concludeUserRegistrationCheck();
      }
    },
  },
  computed: {
    ...mapState("contracts", {
      ethereumAccount: (state) => state.userETHAccount,
      userRegistered: (state) => state.userRegistered,
    }),
    ...mapState("appState", {
      nonce: (state) => state.nonce,
    }),
    showUserNotRegistered() {
      return this.registrationCheckDone && !this.userRegistered;
    },
  },
  methods: {
    async performTokenCheck(payload) {
      await apiCall_POST_token(payload);
    },
    async getNonce(account) {
      await apiCall_PUT_token(account);
    },
    async initiateUserRegistrationCheck() {
      this.$store.dispatch("appState/setIsLoading", true);
      const account = this.$store.getters["contracts/getUserETHAccount"];
      // get a nonce from the backend
      await this.getNonce(account);
      this.$store.dispatch("appState/setIsLoading", false);
    },
    async concludeUserRegistrationCheck() {
      const account = this.$store.getters["contracts/getUserETHAccount"];
      const nonce = this.nonce;
      // sign nonce
      const signedValue = await window.web3.eth.sign(
        window.web3.utils.sha3(nonce),
        account
      );
      this.$store.dispatch("appState/setIsLoading", true);
      const payload = [nonce, signedValue, account];
      await this.performTokenCheck(payload);
      this.$store.dispatch("appState/setIsLoading", false);
      this.registrationCheckDone = true;
    },
    handleContractCall(methodId) {
      if (methodId === methodIDs.REGISTER) {
        this.registrationCheckDone = false;
        // TODO. good until here, but here would have to listen to event from smart contract
        //  to trigger re-evaluation of user registration
        // _> watcher on the notification slot in store for register
        // -> triggers checkUserRegistration or just performTokenCheck IF watcherActivated
        //  -> is boolean which is set here, once we now the register has been initiated
        //  -> set to false once the check has been done again in the watcher
        this.initiateUserRegistrationCheck();
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
