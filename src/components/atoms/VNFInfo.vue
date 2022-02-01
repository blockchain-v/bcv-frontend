<template>
  <div class="vnf-info">
    <p class="section-label">General</p>

    <div v-for="field in getBaseFields" :key="field.id">
      <div class="form-element">
        <label class="vnf-label" :for="field.id">{{ field.label }}</label>
        <input
          class="vnf-property"
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
        <label class="vnf-label" :for="attr[0]">{{ attr[0] }}</label>
        <div v-if="!containsLineBreak(attr[1])">
          <input
            class="vnf-property"
            :id="attr[0]"
            v-model="attr[1]"
            disabled
          />
        </div>
        <div v-else>
          <textarea
            class="vnf-property"
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
  name: "VNFInfo",
  props: {
    vnf: {
      type: Object,
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
        element.classList.contains("vnf-property")
      );

      txts.forEach((element) => {
        const srclHeight = element.scrollHeight;
                
        element.style.height = `${srclHeight + 2}px`;
      });
    },
  },
  computed: {
    getVnf() {
      return this.$props.vnf;
    },
    getBaseFields() {
      return [
        {
          label: "Name",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.name,
        },
        {
          label: "Description",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.description,
        },
        {
          label: "Created",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.created_at,
        },
        {
          label: "Updated",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.updated_at,
        },
        {
          label: "Tenant ID",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.tenant_id,
        },
        {
          label: "Instance ID",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.instance_id,
        },
        {
          label: "VIM ID",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.vim_id,
        },
        {
          label: "VIM Name",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.placement_attr.vim_name,
        },
        {
          label: "Region",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.placement_attr.region_name,
        },
        {
          label: "VNFD ID",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.vnfd_id,
        },
        {
          label: "Status",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.status,
        },
        {
          label: "Management IP",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.mgmt_ip_address,
        },
        {
          label: "Error Reason",
          id: `${this.$props.vnf.id}`,
          text: this.$props.vnf.error_reason,
        },
      ];
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

.vnf-label {
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

.vnf-property {
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
