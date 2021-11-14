<template>
  <div class="contract-interface-resolver">
    <div v-if="methodIdIsValid">
      <HeaderText :text="headerText" />
    </div>

    <div v-if="methodId === 'REGISTER'">
      <RegisterUser :method-id="methodId" />
    </div>
    <div v-else-if="methodId === 'UNREGISTER'">TODO: Unregister UI</div>
    <div v-else-if="methodId === 'DEPLOY_VNF'">TODO: Deploy VNF UI</div>
    <div v-else-if="methodId === 'DELETE_VNF'">TODO: Delete VNF UI</div>
    <div v-else-if="methodId === 'DEV__GET_VNFS'">TODO: (DEV) Get VNFs UI</div>
    <div v-else-if="methodId === 'DEV__GET_VNF_DETAILS'">
      TODO: (DEV) GET VNF Details UI
    </div>
    <div v-else>TODO: Error Page or smth.</div>
  </div>
</template>

<script>
/*
Purpose of this component is to dynamically map a method id from the
contractMethodList to a UI component specific to that method.
Think of it as a switch of some sort.

TODO: decide on variant
Communication of data is performed with one of two options:
  (a)   Event Propagation
  (b)   Vuex Store & computed properties

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
import HeaderText from "./atoms/HeaderText";
import { contractMethodList } from "../constants/contractInterfaceConfig";
import { isNil as _isNil, find as _find } from "lodash";

export default {
  name: "ContractInterfaceResolver",
  components: {
    RegisterUser,
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
