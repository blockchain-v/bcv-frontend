<template>
  <div class="multiline-input">
    <textarea
      :id="areaId"
      @input="handleInput"
      :style="customStyle"
      :placeholder="placeholder"
    ></textarea>
  </div>
</template>

<script>
import { debounce as _debounce } from "lodash";

export default {
  name: "MultilineInput",
  props: {
    id: {
      required: true,
      type: String,
    },
    height: {
      required: false,
      type: Number,
    },
    placeholder: {
      default: "",
      type: String,
    },
  },
  computed: {
    areaId() {
      return `${this.id}-text-area`;
    },
    customStyle() {
      return {
        height: `${this.height}px`,
      };
    },
  },
  methods: {
    handleInput: _debounce(function (event) {
      // NOTE: cannot use arrow function here, else we lose the .this context
      this.$emit("inputChange", event.target.value);
    }, 500),
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.multiline-input {
  width: 100%;

  textarea {
    border: 2px solid $green-aquamarine;
    border-radius: 10px;
    padding: 20px 20px;
    width: 50%;
    height: 200px;
    font-size: 16px;

    &:focus {
      outline: none !important;
      border: 2px solid $green-active;
    }
  }
}
</style>
