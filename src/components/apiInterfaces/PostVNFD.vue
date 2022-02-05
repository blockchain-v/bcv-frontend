<template>
  <div class="post-vnfd-ui">
    <div class="input-container">
      <TextInput
        :id="inputIds[fieldName_name]"
        :label="labelTexts[fieldName_name]"
        :placeholder="placeholderTexts[fieldName_name]"
        @input-change="handleInputChange($event, fieldName_name)"
      />
    </div>
    <div class="input-container">
      <TextInput
        :id="inputIds[fieldName_description]"
        :label="labelTexts[fieldName_description]"
        :placeholder="placeholderTexts[fieldName_description]"
        @input-change="handleInputChange($event, fieldName_description)"
      />
    </div>
    <div class="input-container">
      <MultilineInput
        :id="apiCallId"
        :label="labelTexts[fieldName_attributes]"
        :placeholder="placeholderTexts[fieldName_attributes]"
        @input-change="handleInputChange($event, fieldName_attributes)"
        :format-j-s-o-n="true"
        :store-as-j-s-o-n="true"
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
import MultilineInput from "../atoms/MultilineInput";
import { BACKEND_STORE_FIELD_NAMES } from "../../constants/interfaceConfig";
import { apiCall_POST_vnfd, apiCall_GET_vnfds } from "../../services/apiCallService";
import { POST_FIELDNAMES } from "../../constants/http";

export default {
  name: "PostVNFD",
  components: { CustomButton, TextInput, MultilineInput },
  props: {
    interfaceSpecification: {
      type: Object,
    },
  },
  data() {
    return {
      fieldName_attributes: BACKEND_STORE_FIELD_NAMES.ATTRIBUTES,
      fieldName_name: BACKEND_STORE_FIELD_NAMES.NAME,
      fieldName_description: BACKEND_STORE_FIELD_NAMES.DESCRIPTION,
    };
  },
  computed: {
    apiCallId() {
      return this.interfaceSpecification.id;
    },
    inputIds() {
      return {
        [this.fieldName_name]: `${this.apiCallId}-${this.fieldName_name}`,
        [this
          .fieldName_description]: `${this.apiCallId}-${this.fieldName_description}`,
      };
    },
    placeholderTexts() {
      return {
        [this.fieldName_name]:
          this.interfaceSpecification.inputPlaceholder[this.fieldName_name],
        [this.fieldName_description]:
          this.interfaceSpecification.inputPlaceholder[
            this.fieldName_description
          ],
        [this.fieldName_attributes]:
          this.interfaceSpecification.inputPlaceholder[
            this.fieldName_attributes
          ],
      };
    },
    labelTexts() {
      return {
        [this.fieldName_name]:
          this.interfaceSpecification.inputLabels[this.fieldName_name],
        [this.fieldName_description]:
          this.interfaceSpecification.inputLabels[this.fieldName_description],
        [this.fieldName_attributes]:
          this.interfaceSpecification.inputLabels[this.fieldName_attributes],
      };
    },
    buttonText() {
      return this.interfaceSpecification.actionText;
    },
    vnfdName() {
      return this.$store.state.backend[this.apiCallId][this.fieldName_name];
    },
    vnfdDescription() {
      return this.$store.state.backend[this.apiCallId][
        this.fieldName_description
      ];
    },
    vnfdAttributes() {
      return this.$store.state.backend[this.apiCallId][
        this.fieldName_attributes
      ];
    },
  },
  methods: {
    performApiCall() {
      apiCall_POST_vnfd({
        [POST_FIELDNAMES[this.apiCallId].NAME]: this.vnfdName,
        [POST_FIELDNAMES[this.apiCallId].DESCRIPTION]: this.vnfdDescription,
        [POST_FIELDNAMES[this.apiCallId].ATTRIBUTES]: this.vnfdAttributes,
      }).then(() => {
        apiCall_GET_vnfds();
      });
    },
    handleInputChange(input, fieldName) {
      this.$store.dispatch("backend/setApiCallData", {
        callId: this.apiCallId,
        data: input,
        fieldName: fieldName,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/global.scss";

.post-vnfd-ui {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: $api-call-specific-ui-margin;
  flex-direction: column;

  .input-container {
    width: 100%;
    margin: 15px 0;
  }

  .button-container {
    margin-top: 30px;
  }
}
</style>
