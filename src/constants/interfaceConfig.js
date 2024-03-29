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
  PARAM_VALUES: "param_values",
  CONFIG: "config",
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

// const unusedActionList = [
//   {
//     id: apiCallIDs.DELETE_VNFD,
//     displayText: "Delete VNFD (pending - DEV only)",
//     actionText: "Toddo",
//     infoText: "Toddo long Toddo",
//   },
//   {
//     id: contractMethodIDs.DEV__GET_VNFS,
//     groupings: [],
//     displayText: "(DEV only) Get VNFs of calling user",
//     buttonText: "Get VNFs",
//     infoText: "(DEV-getVNF) imagine a longer text explanation here",
//   },
//   {
//     id: contractMethodIDs.DEV__GET_VNF_DETAILS,
//     groupings: [],
//     displayText: "(DEV only) Get Details of specified VNF",
//     buttonText: "Get VNF Details",
//     infoText: "(DEV-getVNF Details) imagine a longer text explanation here",
//     inputPlaceholder: "Enter/paste ID of the VNF",
//   },
// ];

// const actionList = [...contractMethodList, ...apiCallList];

/* 4 distinct lists
  - just register -> on home.vue
  - just unregister -> user-related
  - vnf-related
  - vnfd-related
*/

const homeActionList = [
  {
    id: contractMethodIDs.REGISTER,
    groupings: [],
    displayText: "Register as new user",
    actionText: "Register",
    infoText: "Register a new user using the currently active address",
  },
];

const userActionList = [
  {
    id: contractMethodIDs.UNREGISTER,
    groupings: [],
    displayText: "Unregister current user",
    buttonText: "Unregister",
    infoText: "Remove the currently active user from the BCV system",
  },
];

const vnfActionList = [
  {
    id: apiCallIDs.GET_VNFS,
    displayText: "Get VNF List",
    actionText: "Refresh",
    infoText: "Get a list of your current VNFs",
  },
  // {
  //   id: apiCallIDs.GET_VNF_INSTANCE,
  //   displayText: "Get VNF",
  //   actionText: "Get specific VNF",
  //   infoText: "Get information about a specific VNF Descriptor",
  //   inputPlaceholder: "VNF ID",
  // },
  {
    id: contractMethodIDs.DEPLOY_VNF,
    groupings: [],
    displayText: "Request VNF deployment",
    buttonText: "Deploy VNF",
    infoText: "Deploy a VNF based on a selected VNF Descriptor",
    inputPlaceholder: {
      genericMultiline: "{}",
      genericParameter: "Enter parameter value...",
    },
  },
];

const vnfdActionList = [
  {
    id: apiCallIDs.GET_VNFDS,
    displayText: "Get VNFD List",
    actionText: "Refresh",
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
  // {
  //   id: apiCallIDs.GET_VNFD,
  //   displayText: "Get VNFD",
  //   actionText: "Get specific VNFD",
  //   infoText: "Get information about a specific VNF Descriptor",
  //   inputPlaceholder: "VNFD ID",
  // },
];

export {
  actionIDs,
  homeActionList,
  userActionList,
  vnfActionList,
  vnfdActionList,
  BACKEND_STORE_FIELD_NAMES,
};
