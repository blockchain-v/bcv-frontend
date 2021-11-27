<template>
  <div class="multiline-input">
    <p class="label" v-if="hasLabel">{{ label }}</p>
    <textarea
      :id="areaId"
      @input="handleInput"
      :style="customStyle"
      :placeholder="placeholder"
    ></textarea>
    <div v-if="formatJSON && !validJSON" class="warning-text">
      {{ warningText }}
    </div>
  </div>
</template>

<script>
import { debounce as _debounce, isNil as _isNil } from "lodash";
import { uiTexts } from "../../constants/texts";

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
    formatJSON: {
      type: Boolean,
      default: false,
    },
    label: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      validJSON: true,
      warningText: uiTexts.multilineInput.warningText,
    };
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
    hasLabel() {
      return !_isNil(this.label);
    },
  },
  methods: {
    handleInput(event) {
      if (this.formatJSON) {
        this.prettifyJSON();
      }
      this.propagateChange(event);
    },
    prettifyJSON: _debounce(function () {
      // NOTE: cannot use arrow function here, else we lose the .this context
      const area = document.querySelector(`#${this.areaId}`);
      try {
        const parsed = JSON.parse(area.value);
        const prettified = JSON.stringify(parsed, undefined, 4);
        this.validJSON = true;
        area.value = prettified;
      } catch (e) {
        console.log(
          "JSON parsing error, ignoring. area input will remain unformatted..."
        );
        this.validJSON = false;
      }
    }, 500),
    propagateChange: _debounce(function (event) {
      this.$emit("inputChange", event.target.value);
    }, 500),
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.multiline-input {
  width: 100%;

  .label {
    position: relative;
    display: flex;
    left: calc((100% - #{$text-area-width}) / 2);
  }

  textarea {
    border: 2px solid $green-aquamarine;
    border-radius: 10px;
    padding: 20px 20px;
    width: $text-area-width;
    height: 200px;
    font-size: 16px;

    &:focus {
      outline: none !important;
      border: 2px solid $green-active;
    }
  }

  .warning-text {
    color: $red;
    font-size: 16px;
  }
}
</style>
