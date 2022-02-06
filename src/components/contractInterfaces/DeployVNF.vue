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
          :text-format="textFormat.JSON"
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
import { apiCall_GET_vnfds } from "../../services/apiCallService";
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
import { TEXT_FORMAT } from "../../constants/global";

const yaml = require("js-yaml");

/*
TODO:
  -fetch VNFDs on created
 */

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
      selectedVnfdParams: [],
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
      textFormat: TEXT_FORMAT,
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
      return this.vnfds?.response?.data ? this.vnfds.response.data : [];
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
