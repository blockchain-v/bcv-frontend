import { methodIDs } from "./contractInterfaceConfig";

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

const contractMethodIDs = {
  REGISTER: "REGISTER",
  UNREGISTER: "UNREGISTER",
  DEPLOY_VNF: "DEPLOY_VNF",
  DELETE_VNF: "DELETE_VNF",
  DEV__GET_VNFS: "DEV__GET_VNFS",
  DEV__GET_VNF_DETAILS: "DEV__GET_VNF_DETAILS",
};

const actionIDs = {
  ...contractMethodIDs,
  ...apiCallIDs,
};

const actionGroupings = {
  // TODO
};

const getGroupingsPerAction = (actionID) => {
  // TODO
  console.log(actionID);
  return [];
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

const contractMethodList = [
  {
    id: methodIDs.REGISTER,
    groupings: getGroupingsPerAction(methodIDs.REGISTER),
    displayText: "Register as new user",
    actionText: "Register",
    infoText: "(register) imagine a longer text explanation here",
  },
  {
    id: methodIDs.UNREGISTER,
    groupings: getGroupingsPerAction(methodIDs.UNREGISTER),
    displayText: "Unregister current user",
    buttonText: "Unregister",
    infoText: "(unregister) imagine a longer text explanation here",
  },
  {
    id: methodIDs.DEPLOY_VNF,
    groupings: getGroupingsPerAction(methodIDs.DEPLOY_VNF),
    displayText: "Request VNF deployment",
    buttonText: "Deploy VNF",
    infoText: "(deployVNF) imagine a longer text explanation here",
    inputPlaceholder: "Enter/paste your VNF Descriptor here.",
  },
  {
    id: methodIDs.DELETE_VNF,
    groupings: getGroupingsPerAction(methodIDs.DELETE_VNF),
    displayText: "Request Deletion of selected VNF",
    buttonText: "Delete VNF",
    infoText: "(deleteVNF) imagine a longer text explanation here",
    inputPlaceholder: "Enter/paste the ID of the VNF you wish to delete.",
  },
  {
    id: methodIDs.DEV__GET_VNFS,
    groupings: getGroupingsPerAction(methodIDs.DEV__GET_VNFS),
    displayText: "(DEV only) Get VNFs of calling user",
    buttonText: "Get VNFs",
    infoText: "(DEV-getVNF) imagine a longer text explanation here",
  },
  {
    id: methodIDs.DEV__GET_VNF_DETAILS,
    groupings: getGroupingsPerAction(methodIDs.DEV__GET_VNF_DETAILS),
    displayText: "(DEV only) Get Details of specified VNF",
    buttonText: "Get VNF Details",
    infoText: "(DEV-getVNF Details) imagine a longer text explanation here",
    inputPlaceholder: "Enter/paste ID of the VNF",
  },
];

const actionList = [...contractMethodList, ...apiCallList];

export { actionIDs, actionGroupings, actionList, BACKEND_STORE_FIELD_NAMES };
