const BACKEND_STORE_FIELD_NAMES = {
  RESPONSE: "response",
  VNFDID: "vnfdId",
  VNFID: "vnfId",
  ATTRIBUTES: "attributes",
  NAME: "name",
  DESCRIPTION: "description",
  ADDRESS: "address",
  NONCE: "nonce",
  SIGNED_NONCE: "signedNonce",
};

const apiCallIDs = {
  // VNF Descriptors
  GET_VNFDS: "GET_VNFDS",
  POST_VNFD: "POST_VNFD",
  GET_VNFD: "GET_VNFD",
  DELETE_VNFD: "DELETE_VNFD",
  // VNF Instances
  GET_VNFS: "GET_VNFS",
  GET_VNF_INSTANCE: "GET_VNF_INSTANCE",
};

const apiCallList = [
  {
    id: apiCallIDs.GET_VNFDS,
    displayText: "Get VNFD List",
    actionText: "Get VNFDs",
    infoText: "Get a list of all currently existing VNF Descriptors",
  },
  {
    id: apiCallIDs.POST_VNFD,
    displayText: "Create new VNFD",
    actionText: "Create VNFD",
    infoText:
      "Create a new VNFD, which is then available as a template for VNF deployments",
    inputLabels: {
      [BACKEND_STORE_FIELD_NAMES.NAME]: "Name",
      [BACKEND_STORE_FIELD_NAMES.DESCRIPTION]: "Description",
      [BACKEND_STORE_FIELD_NAMES.ATTRIBUTES]: "Attributes",
    },
    inputPlaceholder: {
      [BACKEND_STORE_FIELD_NAMES.NAME]: "Enter a name",
      [BACKEND_STORE_FIELD_NAMES.DESCRIPTION]: "Enter a description",
      [BACKEND_STORE_FIELD_NAMES.ATTRIBUTES]: "Enter/Paste the attributes",
    },
  },
  {
    id: apiCallIDs.GET_VNFD,
    displayText: "Get VNFD",
    actionText: "Get specific VNFD",
    infoText: "Get information about a specific VNF Descriptor",
    inputPlaceholder: "VNFD ID",
  },
  {
    id: apiCallIDs.DELETE_VNFD,
    displayText: "Delete VNFD (pending - DEV only)",
    actionText: "Todo",
    infoText: "Todo long Todo",
  },
  {
    id: apiCallIDs.GET_VNFS,
    displayText: "Get VNF List",
    actionText: "Get VNFs",
    infoText: "Get a list of your current VNFs",
  },
  {
    id: apiCallIDs.GET_VNF_INSTANCE,
    displayText: "Get VNF",
    actionText: "Get specific VNF",
    infoText: "Get information about a specific VNF Descriptor",
    inputPlaceholder: "VNF ID",
  },
];

export { apiCallList, apiCallIDs, BACKEND_STORE_FIELD_NAMES };
