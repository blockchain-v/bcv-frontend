<template>
  <div class="details-info">
    <div class="section-header">
      <p class="section-label">{{ texts.sectionLabelGeneral }}</p>
      <div v-if="isVnf" class="delete-button-container">
        <div v-if="vnfInCreatePending" class="v-info pending-create-info">
          {{ texts.deleteVnfButtonPendingCreate }}
        </div>
        <CustomButton
          :button-text="texts.deleteVnfButton"
          @button-click="handleDelete"
          theme-class="red"
          :disabled="vnfInCreatePending"
        />
      </div>
    </div>
    <div v-for="field in nonEmptyBaseFields" :key="field.id">
      <div class="form-element">
        <label class="detail-label" :for="field.id">{{ field.label }}</label>
        <input
          class="detail-property"
          :id="field.id"
          v-model="field.text"
          disabled
        />
        <button
          class="btn-copy"
          :id="`btn-${field.id}`"
          @click="copyToClipboard(field.id)"
        >
          {{ texts.buttonTextCopy }}
        </button>
      </div>
    </div>
    <hr class="horizontal-divider" />
    <p class="section-label">{{ texts.sectionLabelAttributes }}</p>
    <div v-for="attr in getAttributes" :key="attr[0]">
      <div class="form-element">
        <label class="detail-label" :for="attr[0]">{{ attr[0] }}</label>
        <div v-if="!containsLineBreak(attr[1])">
          <input
            class="detail-property"
            :id="attr[2]"
            v-model="attr[1]"
            disabled
          />
          <button
            class="btn-copy"
            :id="`btn-${attr[2]}`"
            @click="copyToClipboard(attr[2])"
          >
            {{ texts.buttonTextCopy }}
          </button>
        </div>
        <div v-else>
          <textarea
            class="detail-property"
            :id="attr[2]"
            v-model="attr[1]"
            disabled
          />
          <button
            class="btn-copy textarea"
            :id="`btn-${attr[2]}`"
            @click="copyToClipboard(attr[2])"
          >
            {{ texts.buttonTextCopy }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isNil as _isNil, find as _find } from "lodash";
import CustomButton from "./CustomButton";
import { uiTexts } from "../../constants/texts";
import { performContractCall } from "../../services/contractCallService";
import { actionIDs } from "../../constants/interfaceConfig";
import { apiCall_GET_vnfs } from "../../services/apiCallService";
import {
  attachEventListener,
  removeListenerAfterFeedback,
  EventTypes,
} from "../../services/eventListenerService";

export default {
  name: "DetailsView",
  components: {
    CustomButton,
  },
  props: {
    isVnf: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
    },
    baseFields: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.resizeTextareas();
  },
  data() {
    return {
      texts: uiTexts.detailsView,
      actionIDs,
      eventTypes: EventTypes,
      listener: null,
    };
  },
  methods: {
    containsLineBreak(str) {
      return str.match(/\n/);
    },
    resizeTextareas() {
      const allTxts = Array.from(document.getElementsByTagName("textarea"));

      const txts = allTxts.filter((element) =>
        element.classList.contains("detail-property")
      );

      txts.forEach((element) => {
        const scrlHeight = element.scrollHeight;
        const btn = this.getCopyButton(element.id);
        const height = `${scrlHeight + 2}px`;

        element.style.height = height;
        btn.style.height = height;
      });
    },
    async copyToClipboard(id) {
      const element = document.getElementById(id);

      await navigator.clipboard.writeText(element.value);

      const btn = this.getCopyButton(element.id);

      const originalValue = btn.textContent;

      btn.textContent = this.texts.buttonTextCopied;

      setTimeout(() => {
        btn.textContent = originalValue;
      }, 2000);
    },
    getCopyButton(id) {
      return document.getElementById(`btn-${id}`);
    },
    async handleDelete() {
      await this.$store.dispatch("appState/setIsLoading", true);
      await performContractCall(this.actionIDs.DELETE_VNF, {
        deploymentId: this.item?.deploymentID,
      });
      this.listener = attachEventListener(
        this.eventTypes.DeletionStatus,
        this.handleDeletionFeedback
      );
    },
    handleDeletionFeedback() {
      apiCall_GET_vnfs();
      setTimeout(() => {
        removeListenerAfterFeedback(this.listener, true);
      }, 1000);
    },
  },
  computed: {
    vnfInCreatePending() {
      const statusField = _find(this.baseFields, (field) => {
        return field.label === "Status";
      });
      return statusField.text === "PENDING_CREATE";
    },
    nonEmptyBaseFields() {
      if (this.baseFields.length === 0) {
        return [];
      }
      return this.baseFields.filter((field) => {
        return field.text !== "" && !_isNil(field.text);
      });
    },
    getAttributes() {
      let attributes = Object.entries(this.item.attributes);

      attributes.forEach((element) => {
        element.push(`${element[0]}-${this.item.id}`);
      });

      return attributes;
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.form-element {
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
}

.detail-label {
  position: relative;
  display: inline;
  width: 20%;
  float: left;
  text-align: left;
  padding-left: 12px;
  min-width: 40px;
  margin-top: 10px;
  inline-size: 200px;
}

.detail-property {
  position: relative;
  display: inline;
  padding: 12px;
  border: 1px solid $green-cadetblue;
  width: 60%;
  border-radius: 10px 0 0 10px;
}

.horizontal-divider {
  margin-bottom: 20px;
  font-size: 10px;
  background-color: $green-mint-tulip;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-label {
  text-align: left;
  padding-left: 12px;
  font-weight: bold;
}

.delete-button-container {
  position: relative;
  right: 95px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.btn-copy {
  background: $green-mint-tulip;
  border: 1px solid $green-aquamarine-medium;
  border-radius: 0 10px 10px 0;
  position: absolute;
  width: 60px;
  height: 42px;
  cursor: pointer;

  &:hover {
    background-color: $green-hover;
  }
  &:hover:active {
    background-color: $green-active;
  }
}

.btn-copy.textarea {
  margin-top: 1px;
  height: auto;
}
</style>
