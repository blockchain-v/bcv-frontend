<template>
  <div class="vnfs-container">
    <div v-if="vnfs.length > 0">
      <Accordion v-for="vnf in vnfs" :key="vnf.id">
        <template v-slot:title>
          <span class="vnf-title">{{ vnf.name }}</span
          >: <span> {{ vnf.description }}</span>
        </template>
        <template v-slot:content>
          <DetailsView
            :item="vnf"
            :baseFields="getBaseFields(vnf)"
            :isVnf="true"
            :key="`${vnf.id}-details-view-${iteration}`"
          />
        </template>
      </Accordion>
    </div>
    <div v-else>
      <span class="no-vnfs">You haven't got any VNFs at the moment.</span>
    </div>
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
  name: "VNFDetails",
  components: {
    DetailsView,
    Accordion,
  },
  data() {
    return {
      iteration: 0,
    };
  },
  watch: {
    vnfs() {
      this.iteration += 1;
    },
  },
  computed: {
    vnfs() {
      const vnfResults =
        this.$store.state.backend[actionIDs.GET_VNFS][
          BACKEND_STORE_FIELD_NAMES.RESPONSE
        ];

      if (_isNil(vnfResults) || _isNil(vnfResults.data)) {
        return [];
      }

      return vnfResults.data;
    },
  },
  methods: {
    getBaseFields(vnf) {
      return [
        {
          label: "Name",
          id: `name-${vnf.id}`,
          text: vnf.name,
        },
        {
          label: "Description",
          id: `description-${vnf.id}`,
          text: vnf.description,
        },
        {
          label: "ID",
          id: `id-${vnf.id}`,
          text: vnf.id,
        },
        {
          label: "Created",
          id: `created-${vnf.id}`,
          text: vnf.created_at,
        },
        {
          label: "Updated",
          id: `updated-${vnf.id}`,
          text: vnf.updated_at,
        },
        {
          label: "Tenant ID",
          id: `tenant-${vnf.id}`,
          text: vnf.tenant_id,
        },
        {
          label: "Instance ID",
          id: `instance-${vnf.id}`,
          text: vnf.instance_id,
        },
        {
          label: "VIM ID",
          id: `vim-id-${vnf.id}`,
          text: vnf.vim_id,
        },
        {
          label: "VIM Name",
          id: `vim-name-${vnf.id}`,
          text: vnf.placement_attr.vim_name,
        },
        {
          label: "Region",
          id: `region-${vnf.id}`,
          text: vnf.placement_attr.region_name,
        },
        {
          label: "VNFD ID",
          id: `vnfd-${vnf.id}`,
          text: vnf.vnfd_id,
        },
        {
          label: "Status",
          id: `status-${vnf.id}`,
          text: vnf.status,
        },
        {
          label: "Management IP",
          id: `mgmt-${vnf.id}`,
          text: vnf.mgmt_ip_address,
        },
        {
          label: "Error Reason",
          id: `error-${vnf.id}`,
          text: vnf.error_reason,
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.vnf-title {
  font-weight: bold;
}

.vnfs-container {
  padding: 10px;
}

.no-vnfs {
  font-style: italic;
  color: $vue-darkblue-pale;
}
</style>
