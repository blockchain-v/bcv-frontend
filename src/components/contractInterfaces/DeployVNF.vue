<template>
  <div class="deploy-vnf-ui">
    <div class="input-container">
      <div
        class="selection-container"
        :class="{ 'with-selection': hasVnfdSelected }"
      >
        <p class="f-label">{{ texts.selectionLabel }}</p>
        <vSelect label="id" :options="vnfdArray" v-model="selectedVnfd" />
      </div>

      <div class="selection-info" v-if="hasVnfdSelected">
        <p class="f-info-greyed">
          <b>{{ texts.selectionNameLabel }}:</b> {{ selectedVnfd.name }}
        </p>
        <p class="f-info-greyed">
          <b>{{ texts.selectionDescriptionLabel }}:</b>
          {{ selectedVnfd.description }}
        </p>
      </div>

      <div class="vnf-specification" v-if="hasVnfdSelected">
        <TextInput
          :label="texts.vnfSpecificationNameLabel"
          id="vnf-specification-name"
          :placeholder="texts.vnfSpecificationNamePlaceholder"
          @input-change="handleInputChange($event, fieldNames.NAME)"
        />
        <TextInput
          :label="texts.vnfSpecificationDescriptionLabel"
          id="vnf-specification-description"
          :placeholder="texts.vnfSpecificationDescriptionPlaceholder"
          @input-change="handleInputChange($event, fieldNames.DESCRIPTION)"
        />
        <!--      TODO: determine if still needed-->
        <MultilineInput
          :id="actionId"
          label="TODO - Dynamic & determine if actually needed"
          :placeholder="placeholderText"
          @input-change="handleInputChange($event, fieldNames.ATTRIBUTES)"
          :format-j-s-o-n="true"
          :store-as-j-s-o-n="false"
        />
      </div>
    </div>
    <div class="button-container">
      <CustomButton
        @button-click="initiateContractCall"
        :button-text="buttonText"
        :disabled="!isReadyForDeployment"
      />
    </div>
  </div>
</template>

<script>
import { performContractCall } from "../../services/contractCallService";
import CustomButton from "../atoms/CustomButton";
import MultilineInput from "../atoms/MultilineInput";
import TextInput from "../atoms/TextInput";
import { mapState } from "vuex";
import {
  actionIDs,
  BACKEND_STORE_FIELD_NAMES,
} from "../../constants/interfaceConfig";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { isNil as _isNil } from "lodash";

export default {
  name: "DeployVNF",
  components: { CustomButton, MultilineInput, vSelect, TextInput },
  props: {
    interfaceSpecification: {
      type: Object,
    },
  },
  data() {
    return {
      selectedVnfd: null,
      fieldNames: BACKEND_STORE_FIELD_NAMES,
      texts: {
        selectionLabel: "Select / paste VNF Descriptor ID",
        selectionNameLabel: "VNFD Name",
        selectionDescriptionLabel: "VNFD Description",
        vnfSpecificationNameLabel: "VNF Name",
        vnfSpecificationNamePlaceholder: "Enter VNF Name...",
        vnfSpecificationDescriptionLabel: "VNF Description",
        vnfSpecificationDescriptionPlaceholder: "Enter VNF Description...",
      },
    };
  },
  watch: {
    selectedVnfd(newVal) {
      const fieldVal = _isNil(newVal?.id) ? null : newVal.id;
      this.handleInputChange(fieldVal, this.fieldNames.VNFDID);
    },
  },
  computed: {
    ...mapState("backend", {
      vnfds: (state) => state[actionIDs.GET_VNFDS].response,
      /* TODO: consider to insert a field which is a combination of
          id & name -> do in computed property -> would make 'search' in selector
          more useful */
    }),
    ...mapState("contracts", {
      deployVnfState: (state) => state[actionIDs.DEPLOY_VNF],
    }),
    hasVnfdSelected() {
      return !_isNil(this.selectedVnfd);
    },
    hasVnfName() {
      return !_isNil(this.deployVnfState[this.fieldNames.NAME]);
    },
    hasVnfDescription() {
      return !_isNil(this.deployVnfState[this.fieldNames.DESCRIPTION]);
    },
    hasVnfAttributes() {
      return !_isNil(this.deployVnfState[this.fieldNames.ATTRIBUTES]);
    },
    isReadyForDeployment() {
      return (
        this.hasVnfdSelected &&
        this.hasVnfName &&
        this.hasVnfDescription &&
        this.hasVnfAttributes
      );
    },
    vnfdArray() {
      // TODO: reinstate actual
      // return this.vnfds ? this.vnfds : [];

      return [
        {
          id: "first",
          name: "big VNF",
          description: "i am big",
        },
        {
          id: "second",
          name: "small VNF",
          description: "i am small",
        },
        {
          id: "third",
          name: "thicc VNF",
          description: "i am thicc",
        },
        {
          id: "fourth",
          name: "slim VNF",
          description: "i am slim",
        },
        {
          id: "fifth",
          name: "the real slim shady",
          description: "will the real slim shady please stand up",
        },
      ];
    },
    actionId() {
      return this.interfaceSpecification.id;
    },
    buttonText() {
      return this.interfaceSpecification.buttonText;
    },
    placeholderText() {
      return this.interfaceSpecification.inputPlaceholder;
    },
  },
  methods: {
    initiateContractCall() {
      performContractCall(this.actionId);
    },
    handleInputChange(input, fieldName) {
      console.log(fieldName, ": ", input); // TODO: CLEANUP
      if (Object.values(this.fieldNames).includes(fieldName)) {
        this.$store.dispatch("contracts/setContractCallData", {
          actionId: this.actionId,
          data: input,
          fieldName,
        });
      } else {
        console.warn(`invalid store field in use (${fieldName})! investigate`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/global.scss";

.deploy-vnf-ui {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: $method-specific-ui-margin;
  flex-direction: column;

  .input-container {
    width: 100%;

    .label {
    }

    .selection-container {
      display: flex;
      margin: $margin-non-flex-self-center;
      align-items: flex-start;
      flex-direction: column;
      width: 50%;

      > div:first-of-type {
        width: 100%;
      }
      .v-select {
        background-color: $white;
      }
    }

    .selection-info {
      display: flex;
      margin: $margin-non-flex-self-center;
      align-items: flex-start;
      flex-direction: column;
      width: 50%;
    }

    .vnf-specification {
      .multiline-input {
        margin-top: $margin-m;
      }
    }
  }

  .button-container {
    margin-top: $margin-m;
  }
}
</style>
