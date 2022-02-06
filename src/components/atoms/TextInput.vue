<template>
  <div class="text-input">
    <p class="f-label label" v-if="hasLabel">{{ label }}</p>
    <input :id="inputId" @input="handleInput" :placeholder="placeholder" />
  </div>
</template>

<script>
import { debounce as _debounce, isNil as _isNil } from "lodash";

export default {
  name: "TextInput.vue",
  props: {
    id: {
      required: true,
      type: String,
    },
    placeholder: {
      default: "",
      type: String,
    },
    label: {
      default: null,
      type: String,
    },
  },
  computed: {
    inputId() {
      return `${this.id}-text-input`;
    },
    hasLabel() {
      return !_isNil(this.label);
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

.text-input {
  width: 100%;

  .label {
    position: relative;
    display: flex;
    left: $input-width-based-centering-offset;
  }

  input {
    @extend .f-standard;
    border: 2px solid $green-aquamarine;
    border-radius: 10px;
    padding: $input-padding;
    width: $input-width;

    &:focus {
      outline: none !important;
      border: 2px solid $green-active;
    }
  }
}
</style>
