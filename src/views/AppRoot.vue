<template>
  <div class="app-root">
    <div v-if="!ethereumAccountIsKnown" class="container">
      <h1 class="title">No Ethereum Account Detected</h1>
      <p>Please use MetaMask to set up a connection with an account</p>
      <p>
        The MetaMask extension should open automatically. If it does not, press
        the button below
      </p>
      <div class="button-container">
        <CustomButton
          @button-click="connectMetaMask"
          button-text="Connect to Metamask"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { isNil as _isNil } from "lodash";
import CustomButton from "../components/atoms/CustomButton";
import { routeNames } from "../router";

/*
 https://stackoverflow.com/a/59499056
 -> just window.ethereum not working in App.vue
 */
const Web3 = require("web3");
const web3 = new Web3(window.ethereum);

/*
TODO: styles like container etc. are used in all views, put them into an external .scss file
 */

export default {
  name: "AppRoot",
  components: {
    CustomButton,
  },
  data() {
    return {};
  },
  computed: {
    ethereumAccount() {
      return this.$store.state.contracts.userETHAccount;
    },
    ethereumAccountIsKnown() {
      return !_isNil(this.ethereumAccount);
    },
  },
  async created() {
    this.$store.dispatch("appState/setIsLoading", true);

    // NOTE: working, but polling :(
    let account = await this.getAccount().then(() => {
      if (_isNil(account)) {
        console.log("on created, no MM account found");
        setInterval(async () => {
          account = await this.getAccount();
          if (!_isNil(account) && account !== this.ethereumAccount) {
            console.log("found new MM account/address:", account);
            await this.setAccountToStore(account);
          }
        }, 200);
        this.isLoading = false;
      } else {
        this.setAccountToStore(account);
        this.isLoading = false;
      }
    });
    this.$store.dispatch("appState/setIsLoading", false);
  },
  mounted() {
    /*
    catch case where you have an account, but manipulate the URL to be invalid
    -> pushes back to app, would be stuck here
    -> hence re-evaluate account
    */
    this.$store.dispatch("contracts/getAccountStatus").then((res) => {
      if (!_isNil(res.ethAccount)) {
        this.navigateToHome();
      }
    });
  },
  methods: {
    navigateToHome() {
      this.$router.push({ name: routeNames.HOME });
    },
    async getAccount() {
      /*
      TODO: perhaps if multiple accounts detected (e.g., on navigation or created), ask user
        to select the account to be used for calls.
      */

      // grab account with which to perform call
      const accounts = await web3.eth.getAccounts();
      return accounts[0];
    },
    async setAccountToStore(account) {
      await this.$store
        .dispatch("contracts/setUserETHAccount", account)
        .then(() => {
          this.navigateToHome();
        });
    },
    connectMetaMask() {
      window.ethereum.request({ method: "eth_requestAccounts" });
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
}
</style>
