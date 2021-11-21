<template>
  <div
    class="contract-call-item-container"
    v-for="method in contractMethods"
    :key="method.id"
  >
    <div
      class="contract-call-item"
      :class="{ expanded: expandItemList[method.id] }"
    >
      <div
        class="item-title"
        :class="{ expanded: expandItemList[method.id] }"
        @click="toggleItemExpand(method.id)"
      >
        {{ method.displayText }}
      </div>

      <div v-if="expandItemList[method.id]" class="details">
        <ContractInterfaceResolver :method-id="method.id" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  contractMethodList,
  methodGroupings,
  methodGroupingKeys,
} from "../constants/contractInterfaceConfig";
import ContractInterfaceResolver from "./ContractInterfaceResolver";

export default {
  name: "ContractInterfaceInitiator",
  components: {
    ContractInterfaceResolver,
  },
  props: {
    resolverIndex: {
      type: String,
      default: methodGroupingKeys.all,
    },
    expandAllItems: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      contractMethodList,
      expandItemList: {},
    };
  },
  created() {
    this.populateItemList();
  },
  computed: {
    contractMethods() {
      return contractMethodList.reduce((filtered, method) => {
        if (methodGroupings[this.resolverIndex].includes(method.id)) {
          filtered.push(method);
        }
        return filtered;
      }, []);
    },
  },
  methods: {
    populateItemList() {
      contractMethodList.forEach(
        (method) => (this.expandItemList[method.id] = !!this.expandAllItems)
      );
    },
    toggleItemExpand(methodId) {
      this.expandItemList[methodId] = !this.expandItemList[methodId];
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.contract-call-item-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .contract-call-item {
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
