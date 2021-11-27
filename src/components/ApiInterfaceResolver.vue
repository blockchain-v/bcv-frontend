<template>
  <div class="api-interface-resolver">
    <div v-if="apiCallIdIsValid">
      <HeaderText :text="headerText" />
    </div>

    <div v-if="apiCallId === apiCallIDs.GET_VNFDS">
      <GetVNFDs :interface-specification="apiCallUISpecification" />
    </div>
    <div v-else-if="apiCallId === apiCallIDs.GET_VNFD">TODO</div>
    <div v-else-if="apiCallId === apiCallIDs.POST_VNFD">TODO</div>
    <div v-else-if="apiCallId === apiCallIDs.DELETE_VNFD">TODO</div>
    <div v-else-if="apiCallId === apiCallIDs.GET_VNFS">TODO</div>
    <div v-else-if="apiCallId === apiCallIDs.GET_VNF_INSTANCE">TODO</div>
    <!--    TODO-->
    <div v-else>TODO: Error Page or smth.</div>
  </div>
</template>

<script>
import HeaderText from "./atoms/HeaderText";
import GetVNFDs from "./apiInterfaces/GetVNFDs";
import { apiCallList, apiCallIDs } from "../constants/apiInterfaceConfig";
import { isNil as _isNil, find as _find } from "lodash";

export default {
  name: "ApiInterfaceResolver",
  components: {
    // call UIs
    GetVNFDs,
    // others
    HeaderText,
  },
  props: {
    apiCallId: {
      default: null,
      type: String,
    },
    apiCallListIDs: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return { apiCallList, apiCallIDs };
  },
  computed: {
    apiCallIdIsValid() {
      /*
      everything that gets resolved dynamically through the apiCallList will
      ofc. be valid. this just catches cases where the component is not used properly.
      */
      return this.apiCallListIDs.includes(this.apiCallId);
    },
    apiCallUISpecification() {
      // get entire specification for given api call
      return _find(this.apiCallList, (item) => {
        return item.id === this.apiCallId;
      });
    },
    headerText() {
      return !_isNil(this.apiCallId)
        ? this.apiCallUISpecification.infoText
        : null;
    },
  },
};
</script>

<style scoped></style>
