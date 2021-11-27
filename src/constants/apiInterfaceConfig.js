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
    displayText: "Todo",
    actionText: "Todo",
    infoText: "Todo long Todo",
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
    displayText: "Todo",
    actionText: "Todo",
    infoText: "Todo long Todo",
  },
  {
    id: apiCallIDs.GET_VNFS,
    displayText: "Todo",
    actionText: "Todo",
    infoText: "Todo long Todo",
  },
  {
    id: apiCallIDs.GET_VNF_INSTANCE,
    displayText: "Todo",
    actionText: "Todo",
    infoText: "Todo long Todo",
  },
];

export { apiCallList, apiCallIDs };
