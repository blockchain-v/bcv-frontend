<template>
  <div class="home">
    <div class="container">
      <h1 class="title has-subtext">Register User with Contract</h1>
      <p class="subtitle"><b>address to register:</b> {{ ethereumAccount }}</p>
      <hr class="horizontal-divider" />
      <ContractInterfaceInitiator
        :resolver-index="methodGroupingKeys.register"
        :expand-all-items="true"
      />
    </div>

<!--    <button @click="handleClick"></button>-->
  </div>
</template>

<script>
import ContractInterfaceInitiator from "../components/ContractInterfaceInitiator";
import { methodGroupingKeys } from "../constants/contractInterfaceConfig";

export default {
  name: "Home",
  components: {
    ContractInterfaceInitiator,
  },
  data() {
    return {
      methodGroupingKeys,
    };
  },
  computed: {
    ethereumAccount() {
      return this.$store.state.contracts.userETHAccount;
    },
  },
  // methods: {
  //   handleClick() {
  //
  //   }
  // }
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
