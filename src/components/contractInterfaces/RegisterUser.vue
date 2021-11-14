<template>
  <div class="register-user-ui">
    <CustomButton @click="initiateContractCall" button-text="TODOTODOTODO"
      >aaaa</CustomButton
    >
  </div>
</template>

<script>
import { performContractCall } from "../../services/contractCallService";
import CustomButton from "../atoms/CustomButton";

export default {
  name: "RegisterUser",
  components: { CustomButton },
  props: {
    methodId: {
      type: String,
    },
  },
  async mounted() {
    // TODO: CLEANUP - is only example
    await this.$store.dispatch("contracts/setTest", "TEST TEST").then(() => {
      console.log("after dispatch:", this.$store.state.contracts.test);
    });
  },
  methods: {
    handleClick() {
      performContractCall(this.methodId);
    },
    initiateContractCall() {
      performContractCall(this.methodId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/global.scss";

.register-user-ui {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: $method-specific-ui-margin;
}
</style>
