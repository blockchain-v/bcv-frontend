const methodIDs = {
  REGISTER: "REGISTER",
  UNREGISTER: "UNREGISTER",
  DEPLOY_VNF: "DEPLOY_VNF",
  DELETE_VNF: "DELETE_VNF",
  DEV__GET_VNFS: "DEV__GET_VNFS",
  DEV__GET_VNF_DETAILS: "DEV__GET_VNF_DETAILS",
};

const methodGroupings = {
  all: Object.values(methodIDs),
  register: [methodIDs.REGISTER],
  main: Object.values(methodIDs).reduce((filtered, method) => {
    if (method !== methodIDs.REGISTER) {
      filtered.push(method);
    }
    return filtered;
  }, []),
};

// lmao :D :D :D
// there has to be a cleaner way to do this...
// create object where methodGroupings.keys are mapped to both key and value, so they can be
// utilized as an "enum"
const methodGroupingKeys = Object.assign(
  {},
  ...Object.keys(Object.keys(methodGroupings)).map((k) => ({
    [Object.keys(methodGroupings)[k]]: Object.keys(methodGroupings)[k],
  }))
);

const getGroupingsPerMethod = (methodId) => {
  const groupingArrays = Object.values(methodGroupings);
  const groupingsOfMethod = [];
  groupingArrays.forEach((array, index) => {
    if (array.includes(methodId)) {
      groupingsOfMethod.push(Object.keys(methodGroupings)[index]);
    }
  });
  return groupingsOfMethod;
};

const contractMethodList = [
  {
    id: methodIDs.REGISTER,
    groupings: getGroupingsPerMethod(methodIDs.REGISTER),
    displayText: "Register as new user",
    actionText: "Register",
    infoText: "(register) imagine a longer text explanation here",
  },
  {
    id: methodIDs.UNREGISTER,
    groupings: getGroupingsPerMethod(methodIDs.UNREGISTER),
    displayText: "Unregister current user",
    buttonText: "Unregister",
    infoText: "(unregister) imagine a longer text explanation here",
  },
  {
    id: methodIDs.DEPLOY_VNF,
    groupings: getGroupingsPerMethod(methodIDs.DEPLOY_VNF),
    displayText: "Request VNF deployment",
    buttonText: "Deploy VNF",
    infoText: "(deployVNF) imagine a longer text explanation here",
    inputPlaceholder: "Enter/paste your VNF Descriptor here.",
  },
  {
    id: methodIDs.DELETE_VNF,
    groupings: getGroupingsPerMethod(methodIDs.DELETE_VNF),
    displayText: "Request Deletion of selected VNF",
    buttonText: "Delete VNF",
    infoText: "(deleteVNF) imagine a longer text explanation here",
    inputPlaceholder: "Enter/paste the ID of the VNF you wish to delete.",
  },
  {
    id: methodIDs.DEV__GET_VNFS,
    groupings: getGroupingsPerMethod(methodIDs.DEV__GET_VNFS),
    displayText: "(DEV only) Get VNFs of calling user",
    buttonText: "Get VNFs",
    infoText: "(DEV-getVNF) imagine a longer text explanation here",
  },
  {
    id: methodIDs.DEV__GET_VNF_DETAILS,
    groupings: getGroupingsPerMethod(methodIDs.DEV__GET_VNF_DETAILS),
    displayText: "(DEV only) Get Details of specified VNF",
    buttonText: "Get VNF Details",
    infoText: "(DEV-getVNF Details) imagine a longer text explanation here",
    inputPlaceholder: "Enter/paste ID of the VNF",
  },
];

export { methodGroupingKeys, contractMethodList, methodGroupings, methodIDs };
