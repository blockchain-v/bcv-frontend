<template>
  <div class="vnfds-container">
    <Accordion v-for="vnfd in vnfds" :key="vnfd.id">
      <template v-slot:title>
        <span class="vnfd-title">{{ vnfd.name }}</span>
        : <span> {{ vnfd.description }} </span>
      </template>
      <template v-slot:content>
        <DetailsView :item="vnfd" :baseFields="getBaseFields(vnfd)" />
      </template>
    </Accordion>
  </div>
</template>

<script>
import DetailsView from "../atoms/DetailsView.vue";
import Accordion from "../atoms/Accordion.vue";
import {
  actionIDs,
  BACKEND_STORE_FIELD_NAMES,
} from "../../constants/interfaceConfig";
import { isNil as _isNil } from "lodash";

export default {
  name: "VNFDDetails",
  components: {
    DetailsView,
    Accordion,
  },
  computed: {
    vnfds() {
      const vnfdResults =
        this.$store.state.backend[actionIDs.GET_VNFDS][
          BACKEND_STORE_FIELD_NAMES.RESPONSE
        ];

      if (_isNil(vnfdResults) || _isNil(vnfdResults.data)) {
        return [];
      }

      return vnfdResults.data;
    },
  },
  methods: {
    getBaseFields(vnfd) {
      return [
        {
          label: "VNFD ID",
          id: `id-${vnfd.id}`,
          text: vnfd.id,
        },
        {
          label: "Tenant ID",
          id: `tenant-${vnfd.id}`,
          text: vnfd.tenant_id,
        },
        {
          label: "Name",
          id: `name-${vnfd.id}`,
          text: vnfd.name,
        },
        {
          label: "Created",
          id: `created-${vnfd.id}`,
          text: vnfd.created_at,
        },
        {
          label: "Updated",
          id: `updated-${vnfd.id}`,
          text: vnfd.updated_at,
        },
        {
          label: "Template Source",
          id: `template-source-${vnfd.id}`,
          text: vnfd.template_source,
        },
        {
          label: "Service Types",
          id: `service-types-${vnfd.id}`,
          text: vnfd.service_types,
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.vnfd-title {
  font-weight: bold;
}

.vnfds-container {
  padding: 10px;
}
</style>
