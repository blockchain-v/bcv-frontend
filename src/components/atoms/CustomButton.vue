<template>
  <div class="custom-button" :class="themeClass" @click="handleClick">
    {{ buttonText }}
  </div>
</template>

<script>
export default {
  name: "CustomButton",
  props: {
    buttonText: {
      default: "",
      type: String,
    },
    themeClass: {
      default: "green",
      type: String,
    },
  },
  methods: {
    handleClick() {
      this.$emit("buttonClick");
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.custom-button {
  border-width: 2px;
  border-radius: 10px;
  border-style: solid;
  padding: $button-padding;
  cursor: pointer;
  width: fit-content;

  &.green {
    border-color: $green-aquamarine-medium;
    background-color: $green-mint-tulip;
  }
  &.green:hover {
    background-color: $green-hover;
  }
  &.green:hover:active {
    // on "click"
    background-color: $green-active;
  }
}
</style>
