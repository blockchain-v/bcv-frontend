<template>
  <div class="deploy-vnf-ui">
    <div class="input-container">
      <div class="selection-container">
        <vSelect :options="vnfdIds" />
      </div>
      <MultilineInput
        :id="methodId"
        :placeholder="placeholderText"
        @input-change="handleInputChange"
        :format-j-s-o-n="true"
        :store-as-j-s-o-n="false"
      />
    </div>
    <div class="button-container">
      <CustomButton
        @button-click="initiateContractCall"
        :button-text="buttonText"
      />
    </div>
  </div>
</template>

<script>
import { performContractCall } from "../../services/contractCallService";
import CustomButton from "../atoms/CustomButton";
import MultilineInput from "../atoms/MultilineInput";
import { mapState } from "vuex";
import { actionIDs } from "../../constants/interfaceConfig";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

/*
TODO:
  - check if valid json for multilineinputs like parameters etc.
    - do that here in the parent, simply pass a boolean into the MultilineInput to trigger error styling
 */

export default {
  name: "DeployVNF",
  components: { CustomButton, MultilineInput, vSelect },
  props: {
    interfaceSpecification: {
      type: Object,
    },
  },
  data() {
    return {
      movie: "godfather",
    };
  },
  computed: {
    ...mapState("backend", {
      vnfds: (state) => state[actionIDs.GET_VNFDS].response,
    }),
    vnfdIds() {
      return this.vnfds.map((vnfd) => {
        return vnfd.id;
      });
    },
    methodId() {
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
      performContractCall(this.methodId);
    },
    handleInputChange(input) {
      this.$store.dispatch("contracts/setCurrentVNFDescriptorInput", input);
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

    //.selection-container {
    //  align-self: center;
    //  width: 50%;
      > div:first-of-type {
        width: 50%;
      }
      .v-select {
        background-color: $white;
      }
    //}
  }

  .button-container {
    margin-top: 30px;
  }
}
</style>
