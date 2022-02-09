<template>
  <div class="loading-container" :class="{ 'lock-background': lockBackground }">
    <div v-if="awaitingContract">AWAIIIIITING YOYOYOYOY</div>
    <PulseLoader />
  </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
  name: "Spinner",
  components: {
    PulseLoader,
  },
  props: {
    lockBackground: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    awaitingContract() {
      return this.$store.state.appState.awaitingContract;
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.loading-container {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $white;
  opacity: 0.6;
  &.lock-background {
    z-index: 4;
  }
}
</style>
