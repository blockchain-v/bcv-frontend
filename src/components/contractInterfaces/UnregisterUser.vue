<template>
  <div class="unregister-user-ui">
    <CustomButton
      @button-click="initiateContractCall"
      :button-text="buttonText"
    />
  </div>
</template>

<script>
import { performContractCall } from "../../services/contractCallService";
import CustomButton from "../atoms/CustomButton";

// TODO: currently identical to RegisterUser -> maybe consolidate

export default {
  name: "UnregisterUser",
  components: { CustomButton },
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
      return this.methodSpecification.actionText;
    },
  },
  methods: {
    initiateContractCall() {
      performContractCall(this.methodId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/global.scss";

.unregister-user-ui {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: $method-specific-ui-margin;
}
</style>
