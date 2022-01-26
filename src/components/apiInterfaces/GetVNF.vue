<template>
  <div class="get-vnf-ui">
    <div class="input-container">
      <TextInput
        :id="apiCallId"
        :placeholder="placeholderText"
        @input-change="handleInputChange"
      />
    </div>
    <div class="button-container">
      <CustomButton @button-click="performApiCall" :button-text="buttonText" />
    </div>
  </div>
</template>

<script>
import CustomButton from "../atoms/CustomButton";
import TextInput from "../atoms/TextInput";
import { BACKEND_STORE_FIELD_NAMES } from "../../constants/interfaceConfig";
import { apiCall_GET_vnf } from "../../services/apiCallService";

export default {
  name: "GetVNF",
  components: { CustomButton, TextInput },
  props: {
    interfaceSpecification: {
      type: Object,
    },
  },
  data() {
    return {
      inputFieldName: BACKEND_STORE_FIELD_NAMES.VNFID,
    };
  },
  computed: {
    apiCallId() {
      return this.interfaceSpecification.id;
    },
    buttonText() {
      return this.interfaceSpecification.actionText;
    },
    placeholderText() {
      return this.interfaceSpecification.inputPlaceholder;
    },
    vnfId() {
      return this.$store.state.backend[this.apiCallId][this.inputFieldName];
    },
  },
  methods: {
    performApiCall() {
      apiCall_GET_vnf(this.vnfId);
    },
    handleInputChange(input) {
      this.$store.dispatch("backend/setApiCallData", {
        callId: this.apiCallId,
        data: input,
        fieldName: this.inputFieldName,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/global.scss";

.get-vnf-ui {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: $api-call-specific-ui-margin;
  flex-direction: column;

  .input-container {
    width: 100%;
  }

  .button-container {
    margin-top: 30px;
  }
}
</style>
