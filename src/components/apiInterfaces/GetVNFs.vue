<template>
  <div class="get-vnfs-ui">
    <CustomButton @button-click="performApiCall" :button-text="buttonText" />
  </div>
  <VNFDetails />
</template>

<script>
import CustomButton from "../atoms/CustomButton";
import { apiCall_GET_vnfs } from "../../services/apiCallService";
import VNFDetails from "../molecules/VNFDetails.vue";
import {
  attachEventListener,
  removeListenerAfterFeedback,
  EventTypes,
} from "../../services/eventListenerService";

export default {
  name: "GetVNFs",
  components: { CustomButton, VNFDetails },
  props: {
    interfaceSpecification: {
      type: Object,
    },
  },
  data() {
    return {
      listener: null,
    };
  },
  created() {
    this.performApiCall();
    this.listenToContract();
  },
  beforeUnmount() {
    removeListenerAfterFeedback(this.listener);
  },
  computed: {
    buttonText() {
      return this.interfaceSpecification.actionText;
    },
  },
  methods: {
    performApiCall() {
      apiCall_GET_vnfs();
    },
    async listenToContract() {
      this.listener = attachEventListener(
        EventTypes.DeploymentStatus,
        async (err, event) => {
          if (event.returnValues.success) {
            this.performApiCall();
          }
        }
      );
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
  margin: $api-call-specific-ui-margin;
}
</style>
