<template>
  <Accordion v-for="vnf in this.exampleVnfs" :key="vnf.id">
    <template v-slot:title>
      <span class="vnf-title">{{ vnf.name }}</span
      >: <span> {{ vnf.description }}</span>
    </template>
    <template v-slot:content>
      <DetailsView v-bind:vnf="vnf" v-bind:baseFields="getBaseFields(vnf)" />
    </template>
  </Accordion>
</template>

<script>
import DetailsView from "../atoms/DetailsView.vue";
import Accordion from "../atoms/Accordion.vue";
export default {
  name: "VNFDetails",
  props: {
    vnfs: {
      type: Array,
    },
  },
  components: {
    DetailsView,
    Accordion,
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
  data() {
    return {
      attributes: [],
      exampleVnfs: [
        {
          attributes: {
            param_values:
              "vdus:\n  vdu1:\n    param:\n      vdu-name: openwrt_vdu1\n",
            config:
              "vdus:\n  vdu1:\n    config:\n      firewall: 'package firewall\n\n        '\n",
          },
          id: "5e45b6e3-0dd4-40e9-a181-025c495540d2",
          tenant_id: "0506addd081049429e860305166bb7bd",
          name: "OpenWRT 1234",
          description: "OpenWRT with services",
          instance_id: null,
          vim_id: "d8a819e9-5742-4d2e-b4f4-f7ded1b18282",
          placement_attr: {
            region_name: "RegionOne",
            vim_name: "DefaultVIM",
          },
          vnfd_id: "5ef87b99-4608-4465-a9c5-f11cd750b1e6",
          status: "PENDING_CREATE",
          mgmt_ip_address: null,
          error_reason: null,
          created_at: "2021-10-12 12:04:16",
          updated_at: null,
        },
        {
          attributes: {
            maintenance_url:
              "http://openstacktacker:9890/v1.0/vnfs/181f3006-1b04-485f-8837-fba0262e7e61/maintenance/0506addd081049429e860305166bb7bd",
            config:
              "vdus:\n  vdu1:\n    config:\n      firewall: 'package firewall\n\n        '\n",
            param_values:
              "vdus:\n  vdu1:\n    param:\n      vdu-name: openwrt_vdu1\n",
            maintenance: '{"ALL": "lst412e8"}',
            heat_template:
              "heat_template_version: 2013-05-23\ndescription: 'Demo example\n\n  '\nparameters: {}\nresources:\n  CP1:\n    type: OS::Neutron::Port\n    properties:\n      port_security_enabled: false\n      network: net2\n  VDU1:\n    type: OS::Nova::Server\n    properties:\n      flavor:\n        get_resource: VDU1_flavor\n      user_data_format: SOFTWARE_CONFIG\n      image: cirros-0.5.2-x86_64-disk\n      config_drive: false\n      networks:\n      - port:\n          get_resource: CP1\n  VDU1_flavor:\n    properties:\n      disk: 1\n      ram: 512\n      vcpus: 1\n    type: OS::Nova::Flavor\n  ALL_maintenance:\n    properties:\n      alarm_actions:\n      - http://openstacktacker:9890/v1.0/vnfs/181f3006-1b04-485f-8837-fba0262e7e61/maintenance/0506addd081049429e860305166bb7bd/lst412e8\n      event_type: maintenance.scheduled\n    type: OS::Aodh::EventAlarm\noutputs:\n  mgmt_ip-VDU1:\n    value:\n      get_attr:\n      - CP1\n      - fixed_ips\n      - 0\n      - ip_address\n",
            maintenance_group: "d28e293d-7059-4c72-9d3a-267fd6b2b35d",
          },
          id: "181f3006-1b04-485f-8837-fba0262e7e61",
          tenant_id: "0506addd081049429e860305166bb7bd",
          name: "Test VNF 2",
          description: "Sample",
          instance_id: "1c76f4a3-7528-4c0e-a271-cc58f596b357",
          vim_id: "d8a819e9-5742-4d2e-b4f4-f7ded1b18282",
          placement_attr: {
            region_name: "RegionOne",
            vim_name: "DefaultVIM",
          },
          vnfd_id: "c5022863-2186-4cbf-8976-47802139a8b5",
          status: "ACTIVE",
          mgmt_ip_address: '{"VDU1": "10.0.1.98"}',
          error_reason: null,
          created_at: "2021-10-26 15:52:21",
          updated_at: "2021-10-26 15:53:30",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.vnf-title {
  font-weight: bold;
}
</style>
