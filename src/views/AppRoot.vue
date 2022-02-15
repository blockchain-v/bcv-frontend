<template>
  <div class="app-root">
    <div v-if="showSpinner" class="loading-container">
      <PulseLoader />
    </div>
    <div v-else-if="!ethereumAccountIsKnown" class="container">
      <h1 class="title">{{ texts.noMMTitle }}</h1>
      <p v-html="texts.MMActionText"></p>
      <div class="button-container">
        <CustomButton
          @button-click="connectMetaMask"
          button-text="Connect to Metamask"
        />
      </div>
      <p v-html="texts.MMActionWarning"></p>
    </div>
  </div>
</template>

<script>
import { isNil as _isNil } from "lodash";
import CustomButton from "../components/atoms/CustomButton";
import { routeNames } from "../router";
import { getToken } from "../services/appService";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { getAccount } from "../services/truffleService";
import {uiTexts} from "../constants/texts";

export default {
  name: "AppRoot",
  components: {
    CustomButton,
    PulseLoader,
  },
  data() {
    return {
      texts: uiTexts.appRoot
    }
  },
  computed: {
    token() {
      return getToken();
    },
    showSpinner() {
      // return this.token && !this.ethereumAccountIsKnown;
      return false;
    },
    ethereumAccount() {
      return this.$store.state.contracts.userETHAccount;
    },
    ethereumAccountIsKnown() {
      return !_isNil(this.ethereumAccount);
    },
  },
  mounted() {
    this.performAccountCheck();
  },
  methods: {
    async performAccountCheck() {
      if (this.ethereumAccount) {
        /*
          catch case where you have an account, but manipulate the URL to be invalid
          -> pushes back to app, would be stuck here
          -> hence re-evaluate account
          -> also concerns case where you unregister
          */
        this.navigateToHome();
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
      }
    },
    navigateToHome() {
      if (!this.token) {
        this.$router.push({ name: routeNames.HOME });
      } else {
        /*
        Means that page was refreshed, token still present.
        No need to run authentication flow.
         */
        this.$store.dispatch("appState/setBearerToken", this.token).then(() => {
          this.$router.push({ name: routeNames.USER });
        });
      }
    },
    async setAccountToStore(account) {
      await this.$store
        .dispatch("contracts/setUserETHAccount", account)
        .then(() => {
          this.navigateToHome();
        });
    },
    connectMetaMask() {
      // NOTE: https://github.com/MetaMask/metamask-extension/issues/9407
      // this is a long-standing issue with MM that breaks on-boarding flows everywhere, have not found a way around it
      // and essentially just telling users to reload the page once connected.
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .catch((e) => console.log(e));
    },
  },
};
</script>

<style lang="scss">
@import "src/styles/global.scss";
.app-root {
  height: 100%;
  width: 100%;

  .container {
    border: 2px solid $green-cadetblue;
    margin: 40px 100px;
    padding: 20px 50px;

    &.error {
      border: 2px solid $red;
      background-color: $red-salmon;
    }

    .button-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 50px 0 30px;
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
  .loading-container {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $white;
    opacity: 0.6;
  }
}
</style>
