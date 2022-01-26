<template>
  <div class="item-container" v-for="action in actionList" :key="action.id">
    <div class="item" :class="{ expanded: expandItemList[action.id] }">
      <div
        class="item-title"
        :class="{ expanded: expandItemList[action.id] }"
        @click="toggleItemExpand(action.id)"
      >
        {{ action.displayText }}
      </div>

      <div v-if="expandItemList[action.id]" class="details">
        <InterfaceResolver
          :action-id="action.id"
          :action-list="actionList"
          :action-list-i-ds="actionListIDs"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceResolver from "./InterfaceResolver";

export default {
  name: "InterfaceInitiator",
  components: {
    InterfaceResolver,
  },
  props: {
    actionList: {
      required: true,
      type: Array,
    },
    autoExpand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expandItemList: {},
    };
  },
  created() {
    this.populateItemList();
  },
  computed: {
    actionListIDs() {
      /*
      compile list of actionIDs which are present in the actionList
      allows for validation of ids, in case the components are not used as intended,
      will prevent ui errors
      */
      const actionIDs = [];
      this.actionList.forEach((action) => {
        actionIDs.push(action.id);
      });
      return actionIDs;
    },
  },
  methods: {
    toggleItemExpand(apiCallId) {
      this.expandItemList[apiCallId] = !this.expandItemList[apiCallId];
    },
    populateItemList() {
      this.actionList.forEach(
        (action) => (this.expandItemList[action.id] = !!this.autoExpand)
      );
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.item-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .item {
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
