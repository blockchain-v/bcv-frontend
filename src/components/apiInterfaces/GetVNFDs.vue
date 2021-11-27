<template>
  <div class="get-vnfds-ui">
    <CustomButton @button-click="performApiCall" :button-text="buttonText" />
  </div>
</template>

<script>
import CustomButton from "../atoms/CustomButton";
import { apiCall_GET_vnfds } from "../../services/apiCallService";

export default {
  name: "GetVNFDs",
  components: { CustomButton },
  props: {
    interfaceSpecification: {
      type: Object,
    },
  },
  computed: {
    buttonText() {
      return this.interfaceSpecification.actionText;
    },
  },
  methods: {
    performApiCall() {
      apiCall_GET_vnfds();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/global.scss";

.get-vnfds-ui {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: $api-call-specific-ui-margin;
}
</style>
