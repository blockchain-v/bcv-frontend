<template>
  <div class="home">
    <div v-if="true" class="container">
      <h1 class="title has-subtext">User not yet registered!</h1>
      <p class="subtitle"><b>current user address:</b> {{ ethereumAccount }}</p>
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
import {
  methodGroupingKeys,
  methodIDs,
} from "../constants/contractInterfaceConfig";
import { apiCall_challenge } from "../services/apiCallService";
import { mapState } from "vuex";
import { routeNames } from "../router";

/*
TODO
  - also include title, subtitle (optional), hr (optional ?) in ContractInterfaceInitiator
 */

export default {
  name: "Home",
  components: {
    ContractInterfaceInitiator,
  },
  data() {
    return {
      methodGroupingKeys,
      methodIDs,
      registrationCheckDone: false,
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
      console.log(process.env);
      const payload = {
        content: "big content. massive even",
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
