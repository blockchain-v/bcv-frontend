<template>
  <div class="deploy-vnf-ui">
    <div class="input-container">
      <MultilineInput
        :id="methodId"
        :placeholder="placeholderText"
        @input-change="handleInputChange"
        :format-j-s-o-n="true"
        :store-as-j-s-o-n="false"
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
import MultilineInput from "../atoms/MultilineInput";

/*
TODO:
  - check if valid json for multilineinputs like parameters etc.
    - do that here in the parent, simply pass a boolean into the MultilineInput to trigger error styling
 */

export default {
  name: "DeployVNF",
  components: { CustomButton, MultilineInput },
  props: {
    interfaceSpecification: {
      type: Object,
    },
  },
  computed: {
    methodId() {
      return this.interfaceSpecification.id;
    },
    buttonText() {
      return this.interfaceSpecification.buttonText;
    },
    placeholderText() {
      return this.interfaceSpecification.inputPlaceholder;
    },
  },
  methods: {
    initiateContractCall() {
      performContractCall(this.methodId);
    },
    handleInputChange(input) {
      this.$store.dispatch("contracts/setCurrentVNFDescriptorInput", input);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/global.scss";

.deploy-vnf-ui {
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
