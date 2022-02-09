/* 
contains the "default templates" available as starting point when creating a vnfd 
*/

export const vnfdTemplates = [
  {
    id: "vnfd-template-http-monitor",
    name: "HTTP monitoring Template",
    vnfd: `tosca_definitions_version: tosca_simple_profile_for_nfv_1_0_0

description: Demo example

metadata:
  template_name: sample-tosca-vnfd

topology_template:
  node_templates:
    VDU1:
      type: tosca.nodes.nfv.VDU.Tacker
      capabilities:
        nfv_compute:
          properties:
            num_cpus: 1
            mem_size: 2 GB
            disk_size: 20 GB
      properties:
        image: ubuntu
        availability_zone: nova
        mgmt_driver: noop
        config: |
          param0: key1
          param1: key2
        monitoring_policy:
          name: http_ping
          parameters:
            retry: 5
            timeout: 10
            port: 8000
          actions:
            failure: respawn

    CP1:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        management: true
        order: 0
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL1
        - virtualBinding:
            node: VDU1

    CP2:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        order: 1
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL2
        - virtualBinding:
            node: VDU1

    CP3:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        order: 2
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL3
        - virtualBinding:
            node: VDU1

    VL1:
      type: tosca.nodes.nfv.VL
      properties:
        network_name: net_mgmt
        vendor: Tacker

    VL2:
      type: tosca.nodes.nfv.VL
      properties:
        network_name: net0
        vendor: Tacker

    VL3:
      type: tosca.nodes.nfv.VL
      properties:
        network_name: net1
        vendor: Tacker`,
  },
  {
    id: "vnfd-template-many-params",
    name: "Template with multiple parametrized inputs",
    vnfd: `tosca_definitions_version: tosca_simple_profile_for_nfv_1_0_0

description: VNF TOSCA template with input parameters

metadata:
  template_name: sample-tosca-vnfd

topology_template:
  inputs:
    image_name:
      type: string
      description: Image Name

    image_source:
      type: string
      description: Image source

    flavor:
      type: string
      description: Flavor Information

    zone:
      type: string
      description: Zone Information

    network:
      type: string
      description: management network

    management:
      type: string
      description: management network

    pkt_in_network:
      type: string
      description: In network

    pkt_out_network:
      type: string
      description: Out network

    vendor:
      type: string
      description: Vendor information

  node_templates:
    VDU1:
      type: tosca.nodes.nfv.VDU.Tacker
      properties:
        image: { get_input: image_name }
        flavor: { get_input: flavor }
        availability_zone: { get_input: zone }
        mgmt_driver: noop
        config: |
          param0: key1
          param1: key2

    CP11:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        management: { get_input: management }
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL1
        - virtualBinding:
            node: VDU1

    CP12:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL2
        - virtualBinding:
            node: VDU1

    CP13:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL3
        - virtualBinding:
            node: VDU1

    VDU2:
      type: tosca.nodes.nfv.VDU.Tacker
      properties:
        flavor: { get_input: flavor }
        availability_zone: { get_input: zone }
        mgmt_driver: noop
        config: |
          param0: key1
          param1: key2
      artifacts:
        VNFImage:
          type: tosca.artifacts.Deployment.Image.VM
          file: { get_input: image_source }

    CP21:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        management: { get_input: management }
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL1
        - virtualBinding:
            node: VDU2

    CP22:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL2
        - virtualBinding:
            node: VDU2

    CP23:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL3
        - virtualBinding:
            node: VDU2

    VL1:
      type: tosca.nodes.nfv.VL
      properties:
        network_name: { get_input: network }
        vendor: { get_input: vendor }

    VL2:
      type: tosca.nodes.nfv.VL
      properties:
        network_name: { get_input: pkt_in_network }
        vendor: { get_input: vendor }

    VL3:
      type: tosca.nodes.nfv.VL
      properties:
        network_name: { get_input: pkt_out_network }
        vendor: { get_input: vendor }`,
  },
  {
    id: "vnfd-template-scaling",
    name: "Template for scaling",
    vnfd: `tosca_definitions_version: tosca_simple_profile_for_nfv_1_0_0

description: sample-tosca-vnfd-scaling

metadata:
  template_name: sample-tosca-vnfd-scaling

topology_template:
  node_templates:
    VDU1:
      type: tosca.nodes.nfv.VDU.Tacker
      properties:
        image: cirros-0.5.2-x86_64-disk
        mgmt_driver: noop
        availability_zone: nova
        flavor: m1.tiny

    CP1:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        management: true
        order: 0
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL1
        - virtualBinding:
            node: VDU1

    VDU2:
      type: tosca.nodes.nfv.VDU.Tacker
      properties:
        image: cirros-0.5.2-x86_64-disk
        mgmt_driver: noop
        availability_zone: nova
        flavor: m1.tiny

    CP2:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        management: true
        order: 0
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL1
        - virtualBinding:
            node: VDU2

    VL1:
      type: tosca.nodes.nfv.VL
      properties:
        network_name: net_mgmt
        vendor: Tacker

  policies:
    - SP1:
        type: tosca.policies.tacker.Scaling
        properties:
          targets: [VDU1, VDU2]
          increment: 1
          cooldown: 120
          min_instances: 1
          max_instances: 3
          default_instances: 2`,
  },
  {
    id: "vnfd-template-hello-world",
    name: "Basic Template (Hello World)",
    vnfd: `tosca_definitions_version: tosca_simple_profile_for_nfv_1_0_0

description: Demo example

metadata:
  template_name: sample-tosca-vnfd

topology_template:
  node_templates:
    VDU1:
      type: tosca.nodes.nfv.VDU.Tacker
      capabilities:
        nfv_compute:
          properties:
            num_cpus: 1
            mem_size: 512 MB
            disk_size: 1 GB
      properties:
        image: cirros-0.5.2-x86_64-disk
        availability_zone: nova
        mgmt_driver: noop
        config: |
          param0: key1
          param1: key2

    CP1:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        management: true
        order: 0
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL1
        - virtualBinding:
            node: VDU1

    CP2:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        order: 1
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL2
        - virtualBinding:
            node: VDU1

    CP3:
      type: tosca.nodes.nfv.CP.Tacker
      properties:
        order: 2
        anti_spoofing_protection: false
      requirements:
        - virtualLink:
            node: VL3
        - virtualBinding:
            node: VDU1

    VL1:
      type: tosca.nodes.nfv.VL
      properties:
        network_name: net_mgmt
        vendor: Tacker

    VL2:
      type: tosca.nodes.nfv.VL
      properties:
        network_name: net0
        vendor: Tacker

    VL3:
      type: tosca.nodes.nfv.VL
      properties:
        network_name: net1
        vendor: Tacker`,
  },
];
