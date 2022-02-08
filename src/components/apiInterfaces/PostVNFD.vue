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
      <div class="template-popup-backdrop" v-if="showTemplatePopup"></div>
      <div class="template-popup" v-if="showTemplatePopup">
        <div class="f-label">{{ texts.selectTemplateLabel }}</div>
        <div class="f-info">
          {{ texts.selectTemplateExplanation }}<br /><a
            :href="texts.selectTemplateLink"
            target="_blank"
            >{{ texts.selectTemplateLinkText }}</a
          >
        </div>
        <vSelect
          label="name"
          :options="vnfdTemplates"
          v-model="selectedTemplate"
        />
        <CustomButton
          :button-text="templateButtonText"
          @button-click="handleTemplateClick(false)"
        />
      </div>
      <MultilineInput
        :id="apiCallId"
        :label="labelTexts[fieldName_attributes]"
        :placeholder="placeholderTexts[fieldName_attributes]"
        @input-change="handleInputChange($event, fieldName_attributes)"
        :text-format="selectedTextFormatOption"
        :store-as-j-s-o-n="true"
      >
        <div class="switch-button-container">
          <SwitchButton
            :options="textFormatOptions"
            :label="textFormatSelectionLabel"
            :selected-option="selectedTextFormatOption"
            @selection="handleTextFormatSelection"
          />
          <div class="template-buttons">
            <div
              class="f-info template-button"
              :class="{ disabled: showTemplatePopup }"
              v-if="hasSelectedTemplate"
              @click="clearTemplate"
            >
              {{ texts.clearTemplate }}
            </div>
            <div
              class="f-info template-button"
              :class="{ disabled: showTemplatePopup }"
              @click="handleTemplateClick(true)"
            >
              {{ texts.startFromTemplate }}
            </div>
          </div>
        </div>
      </MultilineInput>
    </div>
    <div class="button-container">
      <CustomButton
        @button-click="performApiCall"
        :button-text="buttonText"
        :disabled="!isReadyForCall"
      />
    </div>
  </div>
</template>

<script>
import CustomButton from "../atoms/CustomButton";
import SwitchButton from "../atoms/SwitchButton";
import TextInput from "../atoms/TextInput";
import MultilineInput from "../atoms/MultilineInput";
import vSelect from "vue-select";
import { BACKEND_STORE_FIELD_NAMES } from "../../constants/interfaceConfig";
import {
  apiCall_POST_vnfd,
  apiCall_GET_vnfds,
} from "../../services/apiCallService";
import { POST_FIELDNAMES } from "../../constants/http";
import { TEXT_FORMAT } from "../../constants/global";
import { uiTexts } from "../../constants/texts";
import { vnfdTemplates } from "../../constants/vnfds";
import { isNil as _isNil } from "lodash";

export default {
  name: "PostVNFD",
  components: {
    CustomButton,
    TextInput,
    MultilineInput,
    SwitchButton,
    vSelect,
  },
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
      textFormat: TEXT_FORMAT,
      texts: uiTexts.postVnf,
      textFormatSelectionLabel: "Change input format:",
      selectedTextFormatOption: TEXT_FORMAT.YAML,
      textFormatOptions: [
        {
          id: TEXT_FORMAT.JSON,
          displayText: "JSON",
        },
        {
          id: TEXT_FORMAT.YAML,
          displayText: "YAML",
        },
      ],
      showTemplatePopup: false,
      selectedTemplate: null,
      selectedTemplateChange: false,
      vnfdTemplates: vnfdTemplates,
    };
  },
  watch: {
    selectedTemplate(newVal, oldVal) {
      console.log("new template selection", newVal);
      console.log("old ts", oldVal);
      if (_isNil(newVal)) {
        // template cleared -> have to treat directly, as not tied to popup
        this.writeTemplateToTextArea();
      } else if (oldVal !== newVal) {
        // change to any actual template
        this.selectedTemplateChange = true;
      }
    },
    showTemplatePopup(newVal) {
      console.log("show popup:", newVal);
      if (newVal === false) {
        if (this.selectedTemplateChange) {
          // selectedTemplate has actually changed -> write to textarea
          this.writeTemplateToTextArea();
        }
      }
    },
  },
  computed: {
    apiCallId() {
      return this.interfaceSpecification.id;
    },
    textAreaId() {
      return `${this.apiCallId}-text-area`;
    },
    hasSelectedTemplate() {
      return this.selectedTemplate !== "" && !_isNil(this.selectedTemplate);
    },
    selectedTemplateValue() {
      return this.hasSelectedTemplate ? this.selectedTemplate.vnfd : null;
    },
    templateButtonText() {
      return this.hasSelectedTemplate
        ? this.texts.selectTemplateButton
        : this.texts.selectTemplateButtonNone;
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
    hasName() {
      return !_isNil(this.vnfdName);
    },
    hasDescription() {
      return !_isNil(this.vnfdDescription);
    },
    hasAttributes() {
      return !_isNil(this.vnfdAttributes);
    },
    isReadyForCall() {
      return this.hasName && this.hasDescription && this.hasAttributes;
    },
  },
  methods: {
    performApiCall() {
      apiCall_POST_vnfd({
        [POST_FIELDNAMES[this.apiCallId].NAME]: this.vnfdName,
        [POST_FIELDNAMES[this.apiCallId].DESCRIPTION]: this.vnfdDescription,
        [POST_FIELDNAMES[this.apiCallId].ATTRIBUTES]: {
          [POST_FIELDNAMES.GENERAL.VNFD]: this.vnfdAttributes,
        },
      }).then(() => {
        apiCall_GET_vnfds();
      });
    },
    handleInputChange(input, fieldName) {
      this.$store.dispatch("backend/setApiCallData", {
        actionId: this.apiCallId,
        data: input,
        fieldName: fieldName,
      });
    },
    handleTextFormatSelection(selection) {
      this.selectedTextFormatOption = selection;
    },
    handleTemplateClick(value) {
      this.showTemplatePopup = value;
    },
    clearTemplate() {
      if (!this.showTemplatePopup) {
        this.selectedTemplate = null;
      }
    },
    writeTemplateToTextArea() {
      this.selectedTextFormatOption = this.textFormat.YAML;
      // programmatically write template value to area and then trigger the input event
      const area = document.querySelector(`#${this.textAreaId}`);
      area.value = this.selectedTemplateValue;
      area.dispatchEvent(new Event("input", { bubbles: true }));
      // reset for future change detection
      this.selectedTemplateChange = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/global.scss";
$template-popup-width: 45%;

.post-vnfd-ui {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: $api-call-specific-ui-margin;
  flex-direction: column;

  .input-container {
    width: 100%;
    margin: 15px 0;
    position: relative;

    .template-popup-backdrop {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 4;
      background-color: $grey-disabled-alpha;
    }

    .template-popup {
      background-color: $white;
      width: $template-popup-width;
      height: fit-content;
      position: absolute;
      top: 80px;
      padding: $margin-l $margin-xxl;
      left: calc((100% - #{$template-popup-width}) / 2);
      border: 2px solid $green-aquamarine;
      border-radius: $border-radius;
      z-index: 5;

      .f-label {
        left: 0;
        text-align: start;
        margin-bottom: $margin-sm;
      }

      .f-info {
        text-align: start;
        margin-bottom: $margin-m;
      }

      .custom-button {
        margin: $margin-m auto 0;
      }
    }

    .switch-button-container {
      position: relative;
      width: $text-area-width;
      left: $text-area-width-based-centering-offset;
      margin-bottom: $margin-xxs;
      display: flex;
      justify-content: space-between;

      .switch-button {
        margin-top: auto;
      }

      .template-buttons {
        right: 0;
        bottom: 0;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        width: fit-content;
        height: 55px; // need to accommodate both buttons such that layout does not shift

        .template-button {
          margin-top: auto;
          cursor: pointer;

          &.disabled {
            cursor: unset;
            color: $grey-disabled-dark;
          }
        }
      }
    }
  }

  .button-container {
    margin-top: 30px;
  }
}
</style>
