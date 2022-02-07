<template>
  <div class="vnfd-view">
    <div class="container">
      <h1 class="title">VNFD Controls</h1>
      <hr class="horizontal-divider" />
      <InterfaceInitiator :action-list="vnfdActionList" />
    </div>
  </div>
</template>

<script>
import InterfaceInitiator from "../components/InterfaceInitiator";
import { vnfdActionList } from "../constants/interfaceConfig";

export default {
  name: "VNFDView",
  components: {
    InterfaceInitiator,
  },
  data() {
    return {
      vnfdActionList,
    };
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.vnfd-view {
  .container {
    border: 2px solid $green-cadetblue;
    margin: 40px 100px;
    padding: 20px 50px;

    &.error {
      border: 2px solid $red;
      background-color: $red-salmon;
    }

    .subtitle {
      font-size: 18px;
    }

    .title {
      margin-bottom: 40px;

      &.has-subtext {
        margin-bottom: unset;
      }
    }

    .horizontal-divider {
      margin-bottom: 20px;
      font-size: 10px;
      background-color: $green-white;
    }
  }
}
</style>
