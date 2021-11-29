<template>
  <div class="home">
    <EventNotification v-bind:eventType="registrationStatusEvent" />

    <div v-if="showWaitForRegistrationEvent" class="container">
      <h1 class="title has-subtext">
        {{ texts.waitingForRegistrationEvent.title }}
      </h1>
      <p
        class="subtitle"
        v-html="texts.waitingForRegistrationEvent.explanation"
      ></p>
    </div>

    <div v-else-if="showUserActionRequired" class="container">
      <h1 class="title has-subtext">{{ texts.userCheckRequired.title }}</h1>
      <p class="subtitle" v-html="texts.userCheckRequired.explanation"></p>
      <p class="subtitle">
        {{ texts.currentUserAddress }}<b>{{ ethereumAccount }}</b>
      </p>
      <p class="subtitle" v-html="texts.userCheckRequired.hint"></p>
    </div>

    <div v-else class="container">
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
import { isNil as _isNil, find as _find } from "lodash";

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
      registrationStatusEvent: EventTypes.RegistrationStatus,
      texts: uiTexts.home,
      eventWatcherActive: false,
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
    registeredNotification(newVal, oldVal) {
      if (
        this.eventWatcherActive &&
        !_isNil(newVal) &&
        newVal.notification.transactionHash !==
          oldVal?.notification?.transactionHash
      ) {
        this.$store.commit("appState/setRegistrationCheckDone", false)
        // also compare transactionHashes so sequential userRegister events are still treated
        // if incoming event detected that fulfils criteria, re-run authentication-flow for token
        this.initiateUserRegistrationCheck();
      }
    },
  },
  computed: {
    ...mapState("contracts", {
      ethereumAccount: (state) => state.userETHAccount,
      userRegistered: (state) => state.userRegistered,
      eventNotifications: (state) => state.eventNotifications,
    }),
    ...mapState("appState", {
      nonce: (state) => state.nonce,
      waitingForContractFeedback: (state) => state.waitingForContractFeedback,
      registrationCheckDone: (state) => state.registrationCheckDone,
    }),
    showUserNotRegistered() {
      return this.registrationCheckDone && !this.userRegistered;
    },
    showWaitForRegistrationEvent() {
      return this.waitingForContractFeedback;
    },
    showUserActionRequired() {
      return !this.registrationCheckDone;
    },
    registeredNotification() {
      if (this.eventNotifications.length === 0) {
        return null;
      }
      return _find(this.eventNotifications, (en) => {
        return en.notification.event === "RegistrationStatus";
      });
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
      this.eventWatcherActive = false;
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
    },
    handleContractCall(methodId) {
      if (methodId === methodIDs.REGISTER) {
        // activate event Watcher, so it reacts to incoming user registration events
        this.eventWatcherActive = true;
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
