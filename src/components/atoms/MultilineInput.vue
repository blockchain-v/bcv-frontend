<template>
  <div class="multiline-input">
    <p class="label" v-if="hasLabel">{{ label }}</p>
    <slot></slot>
    <textarea
      :id="areaId"
      @input="handleInput"
      :style="customStyle"
      :placeholder="placeholder"
    ></textarea>
    <div v-if="showWarning" class="warning-text">
      {{ warningText }}
    </div>
  </div>
</template>

<script>
import { debounce as _debounce, isNil as _isNil } from "lodash";
import { uiTexts } from "../../constants/texts";
import { TEXT_FORMAT } from "../../constants/global";

const yaml = require("js-yaml");

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
    textFormat: {
      type: String,
      default: TEXT_FORMAT.NONE,
    },
    storeAsJSON: {
      type: Boolean,
      required: true,
    },
    label: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      inputText: null,
      validJSON: true,
      validYAML: true,
      warningTextJSON: uiTexts.multilineInput.warningTextJSON,
      warningTextYAML: uiTexts.multilineInput.warningTextYAML,
    };
  },
  watch: {
    textFormat(newVal, oldVal) {
      console.log(`changed input format from ${oldVal} to ${newVal}`);
      // force value to be re-parsed on changing the textFormat
      const area = document.querySelector(`#${this.areaId}`);
      area.dispatchEvent(new Event("input", { bubbles: true }));
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
    hasLabel() {
      return !_isNil(this.label);
    },
    formatJSON() {
      return this.textFormat === TEXT_FORMAT.JSON;
    },
    formatYAML() {
      return this.textFormat === TEXT_FORMAT.YAML;
    },
    warningText() {
      return this.formatYAML
        ? this.warningTextYAML
        : this.formatJSON
        ? this.warningTextJSON
        : "";
    },
    hasInput() {
      return this.inputText !== "" && !_isNil(this.inputText);
    },
    showWarning() {
      // don't show warning if no input yet
      return (
        (this.formatJSON && !this.validJSON && this.hasInput) ||
        (this.formatYAML && !this.validYAML && this.hasInput)
      );
    },
  },
  methods: {
    handleInput(event) {
      if (this.formatJSON) {
        this.prettifyJSON();
      }
      // no need to treat YAML here, is just raw multiline text basically
      const input = event.target.value;
      this.propagateChange(input);
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
        console.warn(
          "JSON parsing error, ignoring. area input will remain unformatted..."
        );
        this.validJSON = false;
      }
    }, 500),
    yaml2Json(value) {
      if (this.isJsonString(value)) {
        /*
        catch case where already in json (annoyingly, yaml.load() will load json too), but we
        need the appropriate user feedback, so...
        */
        this.validYAML = false;
        return value;
      }

      const jsonVal = yaml.load(value);
      /* 
      yaml.load takes raw input (yaml, so basically text) and TRIES to read it in as json
      - if successful -> result is json
      - else -> result will be plain text / undefined
       */
      if (typeof jsonVal !== "object") {
        /*
        either 'undefined' if not defined, or 'string' if unable to format as json
         */
        console.warn(
          "unable to parse yaml to json. check your input for errors"
        );
        this.validYAML = false;
      } else {
        this.validYAML = true;
      }
      return jsonVal;
    },
    tolerantParseJson(value) {
      let parsedJson = value;
      try {
        parsedJson = JSON.parse(value);
      } catch (e) {
        /*
        this is a bit of a hack, but basically if formatJSON, then the prettifyJSON
        method will try to apply formatting and takes care of the warning message if need be.

        However, to store the value of the input as JSON we have to parse it AGAIN here, and
        we might run into invalid json, therefore we have to try-catch. But this time, we don't
        have to actually deal with verifying the JSON for user feedback, since already done
        in the aforementioned prettifyJSON, thus just wave any errors through here.
        
        I'm sure there are ways to solve this elegantly, but I don't have the nerve for it now.
        */
      }
      return parsedJson;
    },
    isJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    propagateChange: _debounce(function (input) {
      let value = input;

      if (this.storeAsJSON) {
        if (this.formatJSON) {
          value = this.tolerantParseJson(value);
        } else if (this.formatYAML) {
          value = this.yaml2Json(value);
        } else {
          console.warn(
            "invalid prop combination: standard text formatting (plain text) and 'storeAsJson' = true"
          );
        }
      }
      this.$emit("inputChange", value);
      this.inputText = value;
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
    left: $text-area-width-based-centering-offset;
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
