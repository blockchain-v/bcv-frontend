<template>
  <div class="multiline-input">
    <input :id="inputId" @input="handleInput" :placeholder="placeholder" />
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
    placeholder: {
      default: "",
      type: String,
    },
  },
  computed: {
    inputId() {
      return `${this.id}-text-input`;
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

  input {
    border: 2px solid $green-aquamarine;
    border-radius: 10px;
    padding: 20px 20px;
    width: 50%;
    font-size: 16px;

    &:focus {
      outline: none !important;
      border: 2px solid $green-active;
    }
  }
}
</style>
