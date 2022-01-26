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
import { methodIDs } from "../../constants/contractInterfaceConfig";

export default {
  name: "UnregisterUser",
  components: { CustomButton },
  props: {
    interfaceSpecification: {
      type: Object,
    },
  },
  data() {
    return {
      buttonText: "Unregister",
      methodId: methodIDs.UNREGISTER,
    };
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
