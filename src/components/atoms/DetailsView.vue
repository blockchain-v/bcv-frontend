<template>
  <div class="details-info">
    <p class="section-label">General</p>
    <div v-for="field in getBaseFields" :key="field.id">
      <div class="form-element">
        <label class="detail-label" :for="field.id">{{ field.label }}</label>
        <input
          class="detail-property"
          :id="field.id"
          v-model="field.text"
          disabled
        />
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
            :id="attr[0]"
            v-model="attr[1]"
            disabled
          />
        </div>
        <div v-else>
          <textarea
            class="detail-property"
            :id="attr[0]"
            v-model="attr[1]"
            disabled
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailsView",
  props: {
    vnf: {
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
        const srclHeight = element.scrollHeight;

        element.style.height = `${srclHeight + 2}px`;
      });
    },
  },
  computed: {
    getBaseFields() {
      return this.$props.baseFields;
    },
    getAttributes() {
      return Object.entries(this.$props.vnf.attributes);
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.form-element {
  margin-top: 10px;
  margin-bottom: 10px;
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
  width: 80%;
  padding: 12px;
  border: 1px solid $green-cadetblue;
  border-radius: 10px;
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
</style>
