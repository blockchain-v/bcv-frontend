<template>
  <div class="home">
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
      <InterfaceInitiator :action-list="homeActionList" :auto-expand="true" />
    </div>
  </div>
</template>

<script>
import InterfaceInitiator from "../components/InterfaceInitiator";
import { EventTypes } from "../services/eventListenerService";
import { homeActionList } from "../constants/interfaceConfig";
import {
  apiCall_PUT_token,
  apiCall_POST_token,
} from "../services/apiCallService";
import { mapState } from "vuex";
import { routeNames } from "../router";
import { uiTexts } from "../constants/texts";
import { isNil as _isNil, find as _find } from "lodash";
import { getAccount } from "../services/truffleService";

export default {
  name: "Home",
  components: {
    InterfaceInitiator,
  },
  data() {
    return {
      homeActionList,
      registrationStatusEvent: EventTypes.RegistrationStatus,
      texts: uiTexts.home,
    };
  },
  async mounted() {
    /* to protect against error when manually navigation to home, we fetch account here too and
     * force the authentication flow -> always a new cookie when navigation hits /home */
    this.$store.dispatch("appState/setIsLoading", true);

    if (this.ethereumAccount) {
      // prevent getting stuck on comparing account to already existing account in store
      this.initiateUserRegistrationCheck();
    } else {
      // NOTE: working, but polling :(
      let account = await getAccount().then(() => {
        if (_isNil(account)) {
          console.log("on created, no MM account found");
          setInterval(async () => {
            account = await getAccount();
            if (!_isNil(account) && account !== this.ethereumAccount) {
              console.log("found new MM account/address:", account);
              await this.setAccountToStore(account);
            }
          }, 200);
        } else {
          this.setAccountToStore(account);
        }
      });
      this.$store.dispatch("appState/setIsLoading", false);
    }
  },
  watch: {
    userRegistered(newVal) {
      if (newVal === true) {
        this.$router.push({ name: routeNames.USER });
      }
    },
    nonce(newVal, oldVal) {
      if (newVal !== oldVal && !_isNil(newVal)) {
        // a new nonce has been set to store -> execute signature and backend token fetch
        this.concludeUserRegistrationCheck();
      }
    },
    hasRegisterNotification(newVal, oldVal) {
      // react to registration event -> reruns auth check with backend
      if (newVal === true) {
        this.$store.commit("appState/setRegistrationCheckDone", false);
        this.initiateUserRegistrationCheck();
      }
    },
  },
  computed: {
    ...mapState("contracts", {
      ethereumAccount: (state) => state.userETHAccount,
      userRegistered: (state) => state.userRegistered,
      eventNotifications: (state) => state.eventNotificationQueue,
    }),
    ...mapState("appState", {
      nonce: (state) => state.nonce,
      waitingForContractFeedback: (state) => state.waitingForContractFeedback,
      registrationCheckDone: (state) => state.registrationCheckDone,
    }),
    hasRegisterNotification() {
      if (this.eventNotifications.length === 0) {
        return false;
      }
      const found = _find(this.eventNotifications, (notification) => {
        return notification.eventType === this.registrationStatusEvent;
      });
      return !!found;
    },
    showUserNotRegistered() {
      return this.registrationCheckDone && !this.userRegistered;
    },
    showWaitForRegistrationEvent() {
      return this.waitingForContractFeedback;
    },
    showUserActionRequired() {
      return !this.registrationCheckDone;
    },
  },
  methods: {
    async setAccountToStore(account) {
      await this.$store
        .dispatch("contracts/setUserETHAccount", account)
        .then(() => {
          this.initiateUserRegistrationCheck();
        });
    },
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
