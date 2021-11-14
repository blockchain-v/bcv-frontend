<template>
  <div class="contract-interface-resolver">
    <div v-if="methodIdIsValid">
      <HeaderText :text="headerText" />
    </div>

    <div v-if="methodId === 'REGISTER'">
      <RegisterUser :method-specification="callMethodSpecification" />
    </div>
    <div v-else-if="methodId === 'UNREGISTER'">
      <UnregisterUser :method-specification="callMethodSpecification" />
    </div>
    <div v-else-if="methodId === 'DEPLOY_VNF'">
      <DeployVNF :method-specification="callMethodSpecification" />
    </div>
    <div v-else-if="methodId === 'DELETE_VNF'">
      <DeleteVNF :method-specification="callMethodSpecification" />
    </div>
    <div v-else-if="methodId === 'DEV__GET_VNFS'">
      <DEV_getVNFs :method-specification="callMethodSpecification" />
    </div>
    <div v-else-if="methodId === 'DEV__GET_VNF_DETAILS'">
      <DEV_getVNFDetails :method-specification="callMethodSpecification" />
    </div>
    <div v-else>TODO: Error Page or smth.</div>
  </div>
</template>

<script>
/*
Purpose of this component is to dynamically map a method id from the
contractMethodList to a UI component specific to that method.
Think of it as a switch of some sort.

TODO: investigate - v-for option with dynamic component resolution
see if there is a way to dynamically instantiate a component, because currently
they all only the 'method-specification'

TODO: state persistance for input fields
WHen e.g. mimizing one of the call-items, the input is cleared.
implement mechanism to reinstate from store.

TODO: account management
So I'm thinking about the following:
  - have at the top of the ContractView the account info (active acc. : address) smth like that
    - could even be global evalauted at app level
    - as computed property, could it be written to the store?
      => i guess a watcher could write to store whenever the value changes
  - shows no active account of no account connected + maybe instructions to do so on MM
  - if a call is attempted to trigger either:
    - block and alert
    - continue to MM and let the user fail there
 */

import RegisterUser from "./contractInterfaces/RegisterUser";
import UnregisterUser from "./contractInterfaces/UnregisterUser";
import DeployVNF from "./contractInterfaces/DeployVNF";
import DeleteVNF from "./contractInterfaces/DeleteVNF";
import DEV_getVNFs from "./contractInterfaces/DEV_getVNFs";
import DEV_getVNFDetails from "./contractInterfaces/DEV_getVNFDetails";
import HeaderText from "./atoms/HeaderText";
import { contractMethodList } from "../constants/contractInterfaceConfig";
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
      default: "",
      type: String,
    },
  },
  data() {
    return {
      contractMethodList: contractMethodList,
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
};
</script>

<style scoped></style>
