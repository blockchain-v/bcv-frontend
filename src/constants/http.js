import { apiCallIDs } from "./apiInterfaceConfig";

const BACKEND_URL = process.env.VUE_APP_BACKEND_URL;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const ENDPOINTS = {
  TOKEN: "token",
  VNFD: "tacker/vnfds",
  VNF: "tacker/vnfs",
};

const POST_FIELDNAMES = {
  [apiCallIDs.POST_VNFD]: {
    ATTRIBUTES: "attributes",
    NAME: "name",
    DESCRIPTION: "description",
  },
};

export { BACKEND_URL, DEFAULT_HEADERS, ENDPOINTS, POST_FIELDNAMES };
