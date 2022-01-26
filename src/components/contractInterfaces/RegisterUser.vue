<template>
  <div class="register-user-ui">
    <CustomButton
      @button-click="initiateContractCall"
      :button-text="buttonText"
    />
  </div>
</template>

<script>
import { performContractCall } from "../../services/contractCallService";
import CustomButton from "../atoms/CustomButton";

export default {
  name: "RegisterUser",
  components: { CustomButton },
  props: {
    interfaceSpecification: {
      type: Object,
    },
    propagateEvents: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    methodId() {
      return this.interfaceSpecification.id;
    },
    buttonText() {
      return this.interfaceSpecification.actionText;
    },
  },
  methods: {
    initiateContractCall() {
      if (this.propagateEvents) {
        this.$emit("contractCall", this.methodId);
      }
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
