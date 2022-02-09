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
import { actionIDs } from "../../constants/interfaceConfig";
import {
  attachEventListener,
  EventTypes,
} from "../../services/eventListenerService";

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
      methodId: actionIDs.UNREGISTER,
      listener: null,
      eventTypes: EventTypes,
    };
  },
  methods: {
    async initiateContractCall() {
      await this.$store.dispatch("appState/setIsLoading", true);
      await performContractCall(this.methodId);
      this.listener = attachEventListener(
        this.eventTypes.UnregistrationStatus,
        this.handleUnregisterFeedback
      );
    },
    handleUnregisterFeedback() {
      this.listener.unsubscribe();
      setTimeout(() => {
        this.$store.dispatch("appState/setIsLoading", false);
      }, 1000);
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
