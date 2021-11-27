<template>
  <div
    class="api-call-item-container"
    v-for="apiCall in apiCallList"
    :key="apiCall.id"
  >
    <div
      class="api-call-item"
      :class="{ expanded: expandItemList[apiCall.id] }"
    >
      <div
        class="item-title"
        :class="{ expanded: expandItemList[apiCall.id] }"
        @click="toggleItemExpand(apiCall.id)"
      >
        {{ apiCall.displayText }}
      </div>

      <div v-if="expandItemList[apiCall.id]" class="details">
        <ApiInterfaceResolver
          :api-call-id="apiCall.id"
          :api-call-list-i-ds="apiCallListIDs"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { apiCallList, apiCallIDs } from "../constants/apiInterfaceConfig";
import ApiInterfaceResolver from "./ApiInterfaceResolver";

export default {
  name: "ApiInterfaceInitiator",
  components: {
    ApiInterfaceResolver,
  },
  props: {},
  data() {
    return {
      apiCallIDs,
      apiCallList,
      expandItemList: {},
    };
  },
  computed: {
    apiCallListIDs() {
      /*
      compile list of apiCallIds which are present in the apiCallList
      allows for validation of ids, in case the components are not used as intended,
      will prevent ui errors
      */
      const callIDs = [];
      this.apiCallList.forEach((call) => {
        callIDs.push(call.id);
      });
      return callIDs;
    },
  },
  methods: {
    toggleItemExpand(apiCallId) {
      this.expandItemList[apiCallId] = !this.expandItemList[apiCallId];
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.api-call-item-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .api-call-item {
    cursor: pointer;
    margin: 10px 30px 50px;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: fit-content;

    &.expanded {
      background-color: $green-white;
      border: 2px solid $green-aquamarine;
      width: 100%;
      cursor: unset;
    }

    .item-title {
      cursor: pointer;

      &.expanded {
        font-weight: bold;
        color: $vue-darkblue;
        border-bottom: 1px solid $vue-darkblue;
        padding: 0 4px 4px;
      }
    }

    .details {
      margin: 10px 0 30px 0;
      width: 100%;
      height: fit-content;
    }
  }
}
</style>
