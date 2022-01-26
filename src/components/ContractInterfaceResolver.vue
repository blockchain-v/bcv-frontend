<template>
  <div class="contract-interface-resolver">
    <div v-if="methodIdIsValid">
      <HeaderText :text="headerText" />
    </div>

    <div v-if="methodId === methodIDs.REGISTER">
      <RegisterUser
        :interface-specification="callMethodSpecification"
        :propagate-events="propagateEvents"
        @contract-call="propagateContractCallEvent"
      />
    </div>
    <div v-else-if="methodId === methodIDs.UNREGISTER">
      <UnregisterUser :interface-specification="callMethodSpecification" />
    </div>
    <div v-else-if="methodId === methodIDs.DEPLOY_VNF">
      <DeployVNF :interface-specification="callMethodSpecification" />
    </div>
    <div v-else-if="methodId === methodIDs.DELETE_VNF">
      <DeleteVNF :interface-specification="callMethodSpecification" />
    </div>
    <div v-else-if="methodId === methodIDs.DEV__GET_VNFS">
      <DEV_getVNFs :interface-specification="callMethodSpecification" />
    </div>
    <div v-else-if="methodId === methodIDs.DEV__GET_VNF_DETAILS">
      <DEV_getVNFDetails :interface-specification="callMethodSpecification" />
    </div>
    <!--    TODO-->
    <div v-else>TODO: Error Page or smth.</div>
  </div>
</template>

<script>
/*
Purpose of this component is to dynamically map a method id from the
contractMethodList to a UI component specific to that method.
Think of it as a switch of some sort.

TODO: state persistence for input fields
WHen e.g. minimizing one of the call-items, the input is cleared.
implement mechanism to reinstate from store.
*/

import RegisterUser from "./contractInterfaces/RegisterUser";
import UnregisterUser from "./contractInterfaces/UnregisterUser";
import DeployVNF from "./contractInterfaces/DeployVNF";
import DeleteVNF from "./contractInterfaces/DeleteVNF";
import DEV_getVNFs from "./contractInterfaces/DEV_getVNFs";
import DEV_getVNFDetails from "./contractInterfaces/DEV_getVNFDetails";
import HeaderText from "./atoms/HeaderText";
import {
  contractMethodList,
  methodIDs,
} from "../constants/contractInterfaceConfig";
import { isNil as _isNil, find as _find } from "lodash";

export default {
  name: "ContractInterfaceResolver",
  components: {
    // call UIs
    RegisterUser,
    UnregisterUser,
    DeployVNF,
    DeleteVNF,
    DEV_getVNFs,
    DEV_getVNFDetails,
    // others
    HeaderText,
  },
  props: {
    methodId: {
      default: null,
      type: String,
    },
    propagateEvents: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      contractMethodList,
      methodIDs,
    };
  },
  computed: {
    methodListIDs() {
      const methodList = [];
      this.contractMethodList.forEach((method) => {
        methodList.push(method.id);
      });
      return methodList;
    },
    methodIdIsValid() {
      /*
      everything that gets resolved dynamically through the contractMethodList will
      ofc. be valid. this just catches cases where the component is not used properly.
       */
      return this.methodListIDs.includes(this.methodId);
    },
    callMethodSpecification() {
      return _find(this.contractMethodList, (item) => {
        return item.id === this.methodId;
      });
    },
    headerText() {
      return !_isNil(this.methodId)
        ? this.callMethodSpecification.infoText
        : null;
    },
  },
  methods: {
    propagateContractCallEvent(methodId) {
      if (this.propagateEvents) {
        this.$emit("contractCall", methodId);
      }
    },
  },
};
</script>

<style scoped></style>
