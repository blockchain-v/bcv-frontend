<template>
  <div class="loading-container" :class="{ 'lock-background': lockBackground }">
    <div class="loading-text" :class="{ visible: awaitingContract }">
      {{ texts.awaitingContract }}
    </div>
    <PulseLoader />
  </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { uiTexts } from "../../constants/texts";

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
  data() {
    return {
      texts: uiTexts.spinner,
    };
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $white;
  opacity: 0.85;
  &.lock-background {
    // z-index low enough to allow notifications to still overlay the "locked" background
    z-index: 4;
  }

  .loading-text {
    // using visibility to not alter layout / placement of spinner when "toggling"
    visibility: hidden;
    margin-bottom: $margin-xs;
    &.visible {
      visibility: visible;
    }
  }
}
</style>
