<template>
  <div class="custom-button" :class="buttonClass" @click="handleClick">
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
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    buttonClass() {
      return this.disabled ? "disabled" : this.themeClass;
    },
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit("buttonClick");
      }
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

  &.disabled {
    border-color: $grey-disabled-dark;
    background-color: $grey-disabled;
    cursor: unset;
  }

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
