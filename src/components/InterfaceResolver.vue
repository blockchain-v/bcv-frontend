<template>
  <div class="interface-resolver">
    <div v-if="actionIdIsValid">
      <HeaderText :text="headerText" />
    </div>

    <div v-if="actionId === actionIDs.GET_VNFDS">
      <GetVNFDs :interface-specification="actionUISpecification" />
    </div>
    <div v-else-if="actionId === actionIDs.GET_VNFD">
      <GetVNFD :interface-specification="actionUISpecification" />
    </div>
    <div v-else-if="actionId === actionIDs.POST_VNFD">
      <PostVNFD :interface-specification="actionUISpecification" />
    </div>
    <div v-else-if="actionId === actionIDs.GET_VNFS">
      <GetVNFs :interface-specification="actionUISpecification" />
    </div>
    <div v-else-if="actionId === actionIDs.GET_VNF_INSTANCE">
      <GetVNF :interface-specification="actionUISpecification" />
    </div>
    <div v-else-if="actionId === actionIDs.DEPLOY_VNF">
      <DeployVNF :interface-specification="actionUISpecification" />
    </div>
    <div v-else-if="actionId === actionIDs.REGISTER">
      <RegisterUser :interface-specification="actionUISpecification" />
    </div>
    <div v-else-if="actionId === actionIDs.UNREGISTER">
      <UnregisterUser :interface-specification="actionUISpecification" />
    </div>
    <div v-else>Oops, something went wrong!</div>
  </div>
</template>

<script>
// apiInterfaces
import HeaderText from "./atoms/HeaderText";
import GetVNFDs from "./apiInterfaces/GetVNFDs";
import GetVNFD from "./apiInterfaces/GetVNFD";
import GetVNFs from "./apiInterfaces/GetVNFs";
import GetVNF from "./apiInterfaces/GetVNF";
import PostVNFD from "./apiInterfaces/PostVNFD";
// contractInterfaces
import DeployVNF from "./contractInterfaces/DeployVNF";
import RegisterUser from "./contractInterfaces/RegisterUser";
import UnregisterUser from "./contractInterfaces/UnregisterUser";

import { actionIDs } from "../constants/interfaceConfig";
import { isNil as _isNil, find as _find } from "lodash";

export default {
  name: "InterfaceResolver",
  components: {
    // call UIs
    GetVNFDs,
    GetVNFD,
    PostVNFD,
    GetVNFs,
    GetVNF,
    // contract UIs
    DeployVNF,
    RegisterUser,
    UnregisterUser,
    // others
    HeaderText,
  },
  props: {
    actionId: {
      default: null,
      type: String,
    },
    actionList: {
      required: true,
      type: Array,
    },
    actionListIDs: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return { actionIDs };
  },
  computed: {
    actionIdIsValid() {
      /*
      everything that gets resolved dynamically through the apiCallList will
      ofc. be valid. this just catches cases where the component is not used properly.
      */
      return this.actionListIDs.includes(this.actionId);
    },
    actionUISpecification() {
      // get entire specification for given api call
      return _find(this.actionList, (item) => {
        return item.id === this.actionId;
      });
    },
    headerText() {
      return !_isNil(this.actionId)
        ? this.actionUISpecification.infoText
        : null;
    },
  },
};
</script>

<style scoped></style>
