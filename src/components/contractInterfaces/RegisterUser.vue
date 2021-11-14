<template>
  <div class="register-user-ui">
    <button @click="handleClick">aaaa</button>
  </div>
</template>

<script>
import { performContractCall } from "../../services/contractCallService";

export default {
  name: "RegisterUser",
  props: {
    methodId: {
      default: "",
      type: String,
    },
  },
  async mounted() {
    await this.$store.dispatch("contracts/setTest", "TEST TEST").then(() => {
      console.log("after dispatch:", this.$store.state.contracts.test);
    });
  },
  methods: {
    handleClick() {
      performContractCall(this.methodId);
    },
  },
};
</script>

<style scoped lang="scss"></style>
