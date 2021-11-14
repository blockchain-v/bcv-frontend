<template>
  <div class="get-vnf-details-ui">
    <div class="input-container">
      <TextInput
        :id="methodId"
        :placeholder="placeholderText"
        @input-change="handleInputChange"
      />
    </div>
    <div class="button-container">
      <CustomButton
        @button-click="initiateContractCall"
        :button-text="buttonText"
      />
    </div>
  </div>
</template>

<script>
import { performContractCall } from "../../services/contractCallService";
import CustomButton from "../atoms/CustomButton";
import TextInput from "../atoms/TextInput";

export default {
  name: "DEV_getVNFDetails",
  components: { CustomButton, TextInput },
  props: {
    methodSpecification: {
      type: Object,
    },
  },
  computed: {
    methodId() {
      return this.methodSpecification.id;
    },
    buttonText() {
      return this.methodSpecification.buttonText;
    },
    placeholderText() {
      return this.methodSpecification.inputPlaceholder;
    },
  },
  methods: {
    initiateContractCall() {
      performContractCall(this.methodId);
    },
    handleInputChange(input) {
      this.$store.dispatch("contracts/setCurrentVNFDetailsID", input);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/global.scss";

.get-vnf-details-ui {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: $method-specific-ui-margin;
  flex-direction: column;

  .input-container {
    width: 100%;
  }

  .button-container {
    margin-top: 30px;
  }
}
</style>
