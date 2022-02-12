import { actionIDs } from "./interfaceConfig";

const BACKEND_URL = process.env.VUE_APP_BACKEND_URL;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const ENDPOINTS = {
  TOKEN: "token",
  VNFD: "vnfd",
  VNF: "vnf",
  ERROR_MSG: "errormsg",
};

const QUERY_PARAMS = {
  VNFID: "vnfid",
  DEPLOYMENT_ID: "deploymentId",
};

const POST_FIELDNAMES = {
  GENERAL: {
    VNFD: "vnfd",
  },
  [actionIDs.POST_VNFD]: {
    ATTRIBUTES: "attributes",
    NAME: "name",
    DESCRIPTION: "description",
  },
};

export {
  BACKEND_URL,
  DEFAULT_HEADERS,
  ENDPOINTS,
  POST_FIELDNAMES,
  QUERY_PARAMS,
};
