<template>
  <div class="get-vnfs-ui">
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
  name: "DEV_getVNFs",
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
      return this.methodSpecification.buttonText;
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

.get-vnfs-ui {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: $method-specific-ui-margin;
}
</style>
