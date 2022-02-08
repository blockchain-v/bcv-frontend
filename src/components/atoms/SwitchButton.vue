<template>
  <div class="switch-button">
    <div v-if="label" class="label f-info">
      {{ label }}
    </div>
    <div
      v-for="opt in options"
      class="option"
      :class="{ active: selectedOption === opt.id }"
      :key="opt.id"
      @click="handleClick(opt.id)"
    >
      {{ opt.displayText }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SwitchButton.vue",
  props: {
    label: {
      type: String,
      required: false,
    },
    options: {
      type: Array,
      required: true,
      /*
      each option must contain the following fields:
      - id
      - displayText
       */
    },
    selectedOption: {
      type: String,
      required: true,
      /*
      is expected to be the id one of the options.
      selections will be propagated to parent and are expected to be
      updated from there through this prop
       */
    },
  },
  methods: {
    handleClick(optionId) {
      this.$emit("selection", optionId);
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.switch-button {
  display: flex;
  width: fit-content;
  justify-content: flex-start;

  .label {
    margin-right: $margin-xs;
    margin-top: 0;
  }

  .option {
    @extend .f-info-greyed;
    margin-right: $margin-xs;
    margin-top: 0;
    &.active {
      color: $vue-green;
      text-decoration: underline $green-active;
    }
  }
}
</style>
