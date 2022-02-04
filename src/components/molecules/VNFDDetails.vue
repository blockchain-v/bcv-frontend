<template>
  <Accordion v-for="vnfd in this.exampleVnfds" :key="vnfd.id">
    <template v-slot:title>
      <span class="vnfd-title">{{ vnfd.name }}</span>
      : <span> {{ vnfd.description }} </span>
    </template>
    <template v-slot:content>
      <DetailsView :item="vnfd" :baseFields="getBaseFields(vnfd)" />
    </template>
  </Accordion>
</template>

<script>
import DetailsView from "../atoms/DetailsView.vue";
import Accordion from "../atoms/Accordion.vue";
export default {
  name: "VNFDDetails",
  props: {
    vnfds: {
      type: Array,
    },
  },
  components: {
    DetailsView,
    Accordion,
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
  data() {
    return {
      exampleVnfds: [
        {
          attributes: {
            vnfd: "description: Demo example\nmetadata:\n  template_name: sample-tosca-vnfd\ntopology_template:\n  node_templates:\n    CP1:\n      properties:\n        anti_spoofing_protection: false\n        management: true\n        order: 0\n      requirements:\n      - virtualLink:\n          node: VL1\n      - virtualBinding:\n          node: VDU1\n      type: tosca.nodes.nfv.CP.Tacker\n    VDU1:\n      capabilities:\n        nfv_compute:\n          properties:\n            disk_size: 1 GB\n            mem_size: 512 MB\n            num_cpus: 1\n      properties:\n        image: cirros-0.5.2-x86_64-disk\n      type: tosca.nodes.nfv.VDU.Tacker\n    VL1:\n      properties:\n        network_name: net_mgmt\n        vendor: Tacker\n      type: tosca.nodes.nfv.VL\ntosca_definitions_version: tosca_simple_profile_for_nfv_1_0_0\n",
          },
          service_types: ["vnfd"],
          id: "638530e7-1120-41c1-8a03-149b66247d02",
          tenant_id: "0506addd081049429e860305166bb7bd",
          name: "vnfd-sample test",
          description: "Sample",
          created_at: "2021-10-26 14:45:31",
          updated_at: null,
          template_source: "onboarded",
        },
        {
          attributes: {
            vnfd: "description: Demo example\nmetadata:\n  template_name: sample-tosca-vnfd\ntopology_template:\n  node_templates:\n    CP1:\n      properties:\n        anti_spoofing_protection: false\n        ip_address: 10.10.1.100\n        management: true\n        order: 0\n      requirements:\n      - virtualLink:\n          node: VL1\n      - virtualBinding:\n          node: VDU1\n      type: tosca.nodes.nfv.CP.Tacker\n    VDU1:\n      capabilities:\n        nfv_compute:\n          properties:\n            disk_size: 1 GB\n            mem_size: 512 MB\n            num_cpus: 1\n      properties:\n        image: cirros-0.5.2-x86_64-disk\n      type: tosca.nodes.nfv.VDU.Tacker\n    VL1:\n      properties:\n        network_name: net2\n        vendor: Tacker\n      type: tosca.nodes.nfv.VL\ntosca_definitions_version: tosca_simple_profile_for_nfv_1_0_0\n",
          },
          service_types: ["vnfd"],
          id: "68b346ed-342a-4a2e-8c53-8f45b166ca4f",
          tenant_id: "0506addd081049429e860305166bb7bd",
          name: "vnfd-sample test 2",
          description: "Sample",
          created_at: "2021-10-26 15:50:19",
          updated_at: null,
          template_source: "onboarded",
        },
        {
          attributes: {
            vnfd: "description: VNF TOSCA template with input parameters\nmetadata:\n  template_name: sample-tosca-vnfd\ntopology_template:\n  inputs:\n    flavor:\n      description: Flavor Information\n      type: string\n    image_name:\n      description: Image Name\n      type: string\n    management:\n      description: management network\n      type: string\n    network:\n      description: management network\n      type: string\n    pkt_in_network:\n      description: In network\n      type: string\n    pkt_out_network:\n      description: Out network\n      type: string\n    vendor:\n      description: Vendor information\n      type: string\n    zone:\n      description: Zone Information\n      type: string\n  node_templates:\n    CP1:\n      properties:\n        anti_spoofing_protection: false\n        management:\n          get_input: management\n      requirements:\n      - virtualLink:\n          node: VL1\n      - virtualBinding:\n          node: VDU1\n      type: tosca.nodes.nfv.CP.Tacker\n    CP2:\n      properties:\n        anti_spoofing_protection: false\n      requirements:\n      - virtualLink:\n          node: VL2\n      - virtualBinding:\n          node: VDU1\n      type: tosca.nodes.nfv.CP.Tacker\n    CP3:\n      properties:\n        anti_spoofing_protection: false\n      requirements:\n      - virtualLink:\n          node: VL3\n      - virtualBinding:\n          node: VDU1\n      type: tosca.nodes.nfv.CP.Tacker\n    VDU1:\n      properties:\n        availability_zone:\n          get_input: zone\n        config: 'param0: key1\n\n          param1: key2\n\n          '\n        flavor:\n          get_input: flavor\n        image:\n          get_input: image_name\n        mgmt_driver: noop\n      type: tosca.nodes.nfv.VDU.Tacker\n    VL1:\n      properties:\n        network_name:\n          get_input: network\n        vendor:\n          get_input: vendor\n      type: tosca.nodes.nfv.VL\n    VL2:\n      properties:\n        network_name:\n          get_input: pkt_in_network\n        vendor:\n          get_input: vendor\n      type: tosca.nodes.nfv.VL\n    VL3:\n      properties:\n        network_name:\n          get_input: pkt_out_network\n        vendor:\n          get_input: vendor\n      type: tosca.nodes.nfv.VL\ntosca_definitions_version: tosca_simple_profile_for_nfv_1_0_0\n",
          },
          service_types: ["vnfd"],
          id: "bcc793a5-e613-40e5-a5e3-0f23bd8d7442",
          tenant_id: "e754412e49bc4aed84184e85362c981b",
          name: "cirros test",
          description: "VNF TOSCA template with input parameters",
          created_at: "2021-10-26 15:29:05",
          updated_at: null,
          template_source: "onboarded",
        },
        {
          attributes: {
            vnfd: "description: Demo example\nmetadata:\n  template_name: sample-tosca-vnfd\ntopology_template:\n  node_templates:\n    CP1:\n      properties:\n        anti_spoofing_protection: false\n        management: true\n        order: 0\n      requirements:\n      - virtualLink:\n          node: VL1\n      - virtualBinding:\n          node: VDU1\n      type: tosca.nodes.nfv.CP.Tacker\n    VDU1:\n      capabilities:\n        nfv_compute:\n          properties:\n            disk_size: 1 GB\n            mem_size: 512 MB\n            num_cpus: 1\n      properties:\n        image: cirros-0.5.2-x86_64-disk\n      type: tosca.nodes.nfv.VDU.Tacker\n    VL1:\n      properties:\n        network_name: net2\n        vendor: Tacker\n      type: tosca.nodes.nfv.VL\ntosca_definitions_version: tosca_simple_profile_for_nfv_1_0_0\n",
          },
          service_types: ["vnfd"],
          id: "c5022863-2186-4cbf-8976-47802139a8b5",
          tenant_id: "0506addd081049429e860305166bb7bd",
          name: "vnfd-sample test 3",
          description: "Sample",
          created_at: "2021-10-26 15:51:58",
          updated_at: null,
          template_source: "onboarded",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.vnfd-title {
    font-weight: bold;
}
</style>
