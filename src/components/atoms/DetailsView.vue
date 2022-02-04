<template>
  <div class="details-info">
    <p class="section-label">General</p>
    <div v-for="field in this.baseFields" :key="field.id">
      <div class="form-element">
        <label class="detail-label" :for="field.id">{{ field.label }}</label>
        <input
          class="detail-property"
          :id="field.id"
          v-model="field.text"
          disabled
        />
        <button
          class="btn-copy"
          :id="`btn-${field.id}`"
          @click="copyToClipboard(field.id)"
        >
          Copy
        </button>
      </div>
    </div>
    <hr class="horizontal-divider" />
    <p class="section-label">Attributes</p>
    <div v-for="attr in getAttributes" :key="attr[0]">
      <div class="form-element">
        <label class="detail-label" :for="attr[0]">{{ attr[0] }}</label>
        <div v-if="!containsLineBreak(attr[1])">
          <input
            class="detail-property"
            :id="attr[2]"
            v-model="attr[1]"
            disabled
          />
          <button
            class="btn-copy"
            :id="`btn-${attr[2]}`"
            @click="copyToClipboard(attr[2])"
          >
            Copy
          </button>
        </div>
        <div v-else>
          <textarea
            class="detail-property"
            :id="attr[2]"
            v-model="attr[1]"
            disabled
          />
          <button
            class="btn-copy textarea"
            :id="`btn-${attr[2]}`"
            @click="copyToClipboard(attr[2])"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailsView",
  props: {
    item: {
      type: Object,
    },
    baseFields: {
      type: Array,
    },
  },
  mounted() {
    this.resizeTextareas();
  },
  methods: {
    containsLineBreak(str) {
      return str.match(/\n/);
    },
    resizeTextareas() {
      const allTxts = Array.from(document.getElementsByTagName("textarea"));

      const txts = allTxts.filter((element) =>
        element.classList.contains("detail-property")
      );

      txts.forEach((element) => {
        const scrlHeight = element.scrollHeight;
        const btn = this.getCopyButton(element.id);
        const height = `${scrlHeight + 2}px`;

        element.style.height = height;
        btn.style.height = height;
      });
    },
    async copyToClipboard(id) {
      const element = document.getElementById(id);

      await navigator.clipboard.writeText(element.value);

      const btn = this.getCopyButton(element.id);

      const originalValue = btn.textContent;

      btn.textContent = "Copied!";

      setTimeout(() => {
        btn.textContent = originalValue;
      }, 2000);
    },
    getCopyButton(id) {
      return document.getElementById(`btn-${id}`);
    },
  },
  computed: {
    getAttributes() {
      let attributes = Object.entries(this.item.attributes);

      attributes.forEach((element) => {
        element.push(`${element[0]}-${this.item.id}`);
      });

      return attributes;
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.form-element {
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
}

.detail-label {
  position: relative;
  display: inline;
  width: 20%;
  float: left;
  text-align: left;
  padding-left: 12px;
  min-width: 40px;
  margin-top: 10px;
  inline-size: 200px;
}

.detail-property {
  position: relative;
  display: inline;
  padding: 12px;
  border: 1px solid $green-cadetblue;
  width: 60%;
  border-radius: 10px 0 0 10px;
}

.horizontal-divider {
  margin-bottom: 20px;
  font-size: 10px;
  background-color: $green-mint-tulip;
}

.section-label {
  text-align: left;
  padding-left: 12px;
  font-weight: bold;
}

.btn-copy {
  background: $green-mint-tulip;
  border: 1px solid $green-cadetblue;
  border-radius: 0 10px 10px 0;
  position: absolute;
  width: 60px;
  height: 42px;
}

.btn-copy.textarea {
  margin-top: 1px;
  height: auto;
}

.btn-copy:hover {
  background: $green-cadetblue;
}

</style>
