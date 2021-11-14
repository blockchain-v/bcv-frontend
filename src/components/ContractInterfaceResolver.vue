<template>
  <div class="contract-interface-resolver">
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
 */

import RegisterUser from "./contractInterfaces/RegisterUser";

export default {
  name: "ContractInterfaceResolver",
  components: {
    RegisterUser,
  },
  props: {
    methodId: {
      default: "",
      type: String,
    },
  },
};
</script>

<style scoped></style>
