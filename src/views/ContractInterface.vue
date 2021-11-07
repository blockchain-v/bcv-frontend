<template>
  <div class="contract-interface">
    <h1>TEST TEST TEST</h1>
    <button @click="performTestCall">click here for large boom</button>
  </div>
</template>

<script>
import { VNFContract } from "../services/truffleService";

export default {
  name: "ContractInterface",
  methods: {
    async performTestCall() {
      console.log("registered button press, performing call...");
      console.log("contract data:", VNFContract);

      const accounts = await window.web3.eth.getAccounts();
      const account = accounts[0];

      console.log("accs:", accounts);

      const registerRequest = VNFContract.methods.register("jaldsfjaslkdfalkj");
      const registerResult = await registerRequest.send({
        from: account,
        gasPrice: window.web3.gasPrice,
        gasLimit: "500000",
      });

      console.log("resigterResult", registerResult);
    },
  },
};
</script>

<style scoped lang="scss"></style>
