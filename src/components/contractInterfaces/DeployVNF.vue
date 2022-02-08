<template>
  <div class="deploy-vnf-ui">
    <div class="input-container">
      <div
        class="selection-container"
        :class="{ 'with-selection': hasVnfdSelected }"
      >
        <p class="f-label">{{ texts.selectionLabel }}</p>
        <vSelect label="name" :options="vnfdArray" v-model="selectedVnfd" />
      </div>

      <div class="selection-info" v-if="hasVnfdSelected">
        <p class="f-info-greyed">
          <b>{{ texts.selectionIdLabel }}:</b> {{ selectedVnfd.id }}
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
        <div class="parameter-specification" v-if="selectedVnfdHasParams">
          <hr />
          <div class="f-info info-block">{{ texts.paramInfo }}</div>
          <TextInput
            v-for="param in selectedVnfdParams"
            :key="`${param.id}-${this.updateCycle}`"
            :id="`${param.id}-${this.updateCycle}`"
            :label="`Parameter: ${param.displayText}`"
            :placeholder="placeholderTextParams"
            @input-change="
              handleInputChange($event, fieldNames.ATTRIBUTES, param.id)
            "
          />
        </div>
        <div class="config-action">
          <div class="f-label icon" @click="handleConfigClick">
            <b>{{ configToggleIcon }}</b>
          </div>
          <div class="f-label">{{ configToggleText }}</div>
        </div>
        <div v-if="addConfig" class="configuration-specification">
          <hr class="low-margin" />
          <div class="f-info info-block">{{ texts.configInfo }}</div>
          <MultilineInput
            :text-format="textFormat.JSON"
            :store-as-j-s-o-n="true"
            :placeholder="texts.configPlaceholder"
            :id="`vnf-deployment-${fieldNames.CONFIG}`"
            @input-change="handleInputChange($event, fieldNames.CONFIG)"
          />
        </div>
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
import { apiCall_GET_vnfds } from "../../services/apiCallService";
import CustomButton from "../atoms/CustomButton";
import TextInput from "../atoms/TextInput";
import MultilineInput from "../atoms/MultilineInput";
import { mapState } from "vuex";
import {
  actionIDs,
  BACKEND_STORE_FIELD_NAMES,
} from "../../constants/interfaceConfig";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import {
  isNil as _isNil,
  cloneDeep as _cloneDeep,
  update as _update,
} from "lodash";
import { TEXT_FORMAT } from "../../constants/global";
import { uiTexts } from "../../constants/texts";

const yaml = require("js-yaml");

export default {
  name: "DeployVNF",
  components: { CustomButton, vSelect, TextInput, MultilineInput },
  props: {
    interfaceSpecification: {
      type: Object,
    },
  },
  data() {
    return {
      updateCycle: 0,
      selectedVnfd: null,
      selectedVnfdParams: [],
      fieldNames: BACKEND_STORE_FIELD_NAMES,
      texts: uiTexts.deployVnf,
      textFormat: TEXT_FORMAT,
      addConfig: false,
    };
  },
  mounted() {
    this.fetchVnfdsIfMissing();
  },
  watch: {
    selectedVnfd(newVal) {
      const fieldVal = _isNil(newVal?.id) ? null : newVal.id;
      this.handleInputChange(fieldVal, this.fieldNames.VNFDID);
      this.selectedVnfdParams = this.scanForVnfdParams();
      this.createStoreFieldsForParams();
      this.updateCycle += 1;
      // updateCycle needs to be updated, such that the textFields don't maintain their value
      // if in the new selectedVnf parameters are present that have previously been filled in
      // Note, that this is just concerning the UI, the store is fully reset by the
      // method 'createStoreFieldsForParams();
    },
  },
  computed: {
    ...mapState("backend", {
      vnfds: (state) => state[actionIDs.GET_VNFDS],
      /* TODO: (maybe/low prio) consider to insert a field which is a combination of
          id & name -> do in computed property -> would make 'search' in selector
          more useful */
    }),
    ...mapState("contracts", {
      deployVnfState: (state) => state[actionIDs.DEPLOY_VNF],
    }),
    hasVnfdSelected() {
      return !_isNil(this.selectedVnfd);
    },
    selectedVnfdHasParams() {
      return this.selectedVnfdParams.length > 0;
    },
    hasVnfName() {
      const state = this.deployVnfState[this.fieldNames.NAME];
      return !_isNil(state) && state !== "";
    },
    hasVnfDescription() {
      const state = this.deployVnfState[this.fieldNames.DESCRIPTION];
      return !_isNil(state) && state !== "";
    },
    hasVnfAttributes() {
      if (!this.selectedVnfdHasParams) {
        // no attributes need to be specified
        return true;
      }
      const paramObject = this.vnfdAttributes[this.fieldNames.PARAM_VALUES];
      if (_isNil(paramObject)) {
        return false;
      }
      return Object.values(paramObject).every(
        (val) => !_isNil(val) && val !== ""
      );
    },
    hasVnfConfiguration() {
      if (!this.addConfig) {
        // since optional, if not enabled return true
        return true;
      }
      return !_isNil(this.vnfdConfiguration) && this.vnfdConfiguration !== "";
    },
    isReadyForDeployment() {
      return (
        this.hasVnfdSelected &&
        this.hasVnfName &&
        this.hasVnfDescription &&
        this.hasVnfAttributes &&
        this.hasVnfConfiguration
      );
    },
    vnfdArray() {
      return this.vnfds?.response?.data ? this.vnfds.response.data : [];
    },
    actionId() {
      return this.interfaceSpecification.id;
    },
    buttonText() {
      return this.interfaceSpecification.buttonText;
    },
    placeholderTextMultiline() {
      return this.interfaceSpecification.inputPlaceholder.genericMultiline;
    },
    placeholderTextParams() {
      return this.interfaceSpecification.inputPlaceholder.genericParameter;
    },
    configToggleText() {
      return this.addConfig ? this.texts.configTrue : this.texts.configFalse;
    },
    configToggleIcon() {
      return this.addConfig
        ? this.texts.configTrueIcon
        : this.texts.configFalseIcon;
    },
    vnfdAttributes() {
      return this.$store.state.contracts[this.actionId][
        this.fieldNames.ATTRIBUTES
      ];
    },
    vnfdConfiguration() {
      return this.$store.state.contracts[this.actionId][this.fieldNames.CONFIG];
    },
  },
  methods: {
    initiateContractCall() {
      performContractCall(this.actionId);
    },
    handleConfigClick() {
      this.addConfig = !this.addConfig;
      if (this.addConfig === false) {
        // purge store state of config
        this.$store.dispatch("contracts/setContractCallData", {
          actionId: this.actionId,
          data: null,
          fieldName: this.fieldNames.CONFIG,
        });
      }
    },
    fetchVnfdsIfMissing() {
      /* if call to api has not been made yet (state -> null), perform call */
      if (_isNil(this.vnfds.response)) {
        apiCall_GET_vnfds();
      }
    },
    scanForVnfdParams() {
      const params = [];
      if (
        _isNil(this.selectedVnfd) ||
        _isNil(this.selectedVnfd.attributes) ||
        _isNil(this.selectedVnfd.attributes.vnfd)
      ) {
        // not actual descriptor attributes, return empty array
        return params;
      }

      // 1. convert yaml (fetched VNFDs from tacker are ALWAYS in yaml) to json (object)
      let attributesObject;
      try {
        attributesObject = yaml.load(this.selectedVnfd.attributes.vnfd);
      } catch (e) {
        console.warn(
          "unable to parse yaml to json when searching for parametrized inputs"
        );
        // return empty
        return params;
      }
      console.log("jsonified yaml.", attributesObject); // TODO CLEANUP

      /*
      2. check if ANY 'get_input' field is present in object ('get_input' is the reserved
      keyword for parametrization in vnfds:
      https://docs.openstack.org/tacker/latest/contributor/vnfd_template_parameterization.html#parameterized-vnfd-template
      */
      const getInputInstances = this.deepSearchByKey(
        attributesObject,
        "get_input"
      );
      if (getInputInstances.length === 0) {
        // return empty
        return params;
      }
      /* 3. check if 'inputs' objects present in object ('inputs' contains the specification for
      the 'get_input' params. We are unsure if the specification is optional, so we have to assume it is,
      therefore fetch for 'get_input' instances and match them against (if present) 'inputs' to get
      metadata.
       */
      const inputInstances = this.deepSearchByKey(attributesObject, "inputs");
      // 4. create param specification array
      return this.matchParamsMetadata(getInputInstances, inputInstances);
    },
    createParamSpec(field, spec) {
      return {
        id: field,
        displayText: field,
        description: spec ? spec.description : "",
      };
    },
    matchParamsMetadata(getInputArray, inputArray) {
      const inputSpec = inputArray.length === 1 ? inputArray[0] : null;
      // eliminate duplicates: https://stackoverflow.com/a/14438954
      const uniqueGetInputs = [...new Set(getInputArray)];

      const paramSpecs = [];
      uniqueGetInputs.forEach((gi) => {
        let specification;
        if (inputSpec && inputSpec[gi]) {
          specification = inputSpec[gi];
        }
        paramSpecs.push(this.createParamSpec(gi, specification));
      });

      return paramSpecs;
    },
    deepSearchByKey(object, originalKey, matches = []) {
      // https://stackoverflow.com/a/64559530
      if (object != null) {
        if (typeof object == "object") {
          for (let key of Object.keys(object)) {
            if (key === originalKey) {
              matches.push(object[originalKey]);
            } else {
              this.deepSearchByKey(object[key], originalKey, matches);
            }
          }
        }
      }

      return matches;
    },
    createStoreFieldsForParams() {
      const params = this.selectedVnfdParams;
      let storeVal = null;
      // have to reset attribute if no params
      if (this.selectedVnfdHasParams) {
        const param_values = {};
        params.forEach((param) => {
          param_values[param.id] = null;
        });
        storeVal = param_values;
      }
      this.$store.dispatch("contracts/setContractCallData", {
        actionId: this.actionId,
        data: _isNil(storeVal)
          ? storeVal
          : {
              [this.fieldNames.PARAM_VALUES]: storeVal,
            },
        fieldName: this.fieldNames.ATTRIBUTES,
      });
    },
    updateAttributes(input, fieldName) {
      // all values (even booleans) apparently as string
      const currentAttributes = _cloneDeep(this.vnfdAttributes);
      _update(
        currentAttributes,
        `${this.fieldNames.PARAM_VALUES}.${fieldName}`,
        () => input.toString()
      );
      return currentAttributes;
    },
    handleInputChange(input, fieldName, nestingName = null) {
      if (Object.values(this.fieldNames).includes(fieldName)) {
        let data = input;
        if (fieldName === this.fieldNames.ATTRIBUTES) {
          data = this.updateAttributes(input, nestingName);
        }

        this.$store.dispatch("contracts/setContractCallData", {
          actionId: this.actionId,
          data,
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

      .parameter-specification,
      .configuration-specification {
        > hr {
          width: $input-width;
          margin: $margin-sm auto $margin-xs;
          &.low-margin {
            margin-top: unset;
          }
        }
        .info-block {
          width: $input-width;
          margin-left: auto;
          margin-right: auto;
          text-align: start;
        }
      }

      .config-action {
        width: $input-width;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        .icon {
          cursor: pointer;
          width: 30px;
        }
      }
    }
  }

  .button-container {
    margin-top: $margin-m;
  }
}
</style>
