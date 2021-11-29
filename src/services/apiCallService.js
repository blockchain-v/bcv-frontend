import axios from "axios";
import { BACKEND_URL, DEFAULT_HEADERS, ENDPOINTS } from "../constants/http";
import { apiCallIDs } from "../constants/apiInterfaceConfig";
import store from "../store/store.js";
import { BACKEND_STORE_FIELD_NAMES } from "../constants/apiInterfaceConfig";
import { isNil as _isNil } from "lodash";

// --------------- HELPERS ---------------------------------------------------------------------------------------------
const buildHeaderWithAuth = (bearerToken) => {
  return {
    ...DEFAULT_HEADERS,
    Authentication: bearerToken,
  };
};

/*
TODO:
  large parts of the calls are generic, there surely is a way to generalize and reduce
  duplicate code
 */

// --------------- API CALLS -------------------------------------------------------------------------------------------
// AUTHENTICATION
const apiCall_POST_token = (payload) => {
  const url = `${BACKEND_URL}/${ENDPOINTS.TOKEN}`;
  const data = JSON.stringify({
    [BACKEND_STORE_FIELD_NAMES.NONCE]: payload[0],
    [BACKEND_STORE_FIELD_NAMES.SIGNED_NONCE]: payload[1],
    [BACKEND_STORE_FIELD_NAMES.ADDRESS]: payload[2],
  });
  const config = {
    headers: DEFAULT_HEADERS,
  };
  axios
    .post(url, data, config)
    .then(async (response) => {
      console.log("response for url", url, response);
      if (response.status === 200 || response.status === 204) {
        // TODO: maybe set the token to localStorage/sessionStorage so it can also be checked for?
        //  -> avoids having to resign upon refresh of the page -> discuss
        await store.dispatch("appState/setBearerToken", response.data.token);
        await store.dispatch(
          "contracts/setUserRegistered",
          response.data.isRegistered
        );
      }
    })
    .catch(async (error) => {
      console.log(
        "error whilst performing call to",
        url,
        "error:",
        error.response
      );
      if (error.response.status === 401) {
        await store.dispatch("contracts/setUserRegistered", false);
      }
    });
};

const apiCall_PUT_token = async (address) => {
  const url = `${BACKEND_URL}/${ENDPOINTS.TOKEN}`;
  const data = JSON.stringify({
    [BACKEND_STORE_FIELD_NAMES.ADDRESS]: address,
  });
  const config = {
    headers: DEFAULT_HEADERS,
  };
  try {
    axios.put(url, data, config).then(async (response) => {
      console.log("response for url", url, response);
      if (response.status === 200) {
        store.commit("appState/setNonce", response.data.nonce);
      }
    });
  } catch (e) {
    console.log("error whilst performing call to", url, "error:", e);
  }
};

// DATA CALLS
const apiCall_POST_vnfd = async (payload) => {
  store.commit("appState/setIsLoading", true);
  const bearerToken = await store.getters["appState/getBearerToken"];
  if (_isNil(bearerToken)) {
    console.log("no bearertoken, rejecting...");
    return;
  }
  const url = `${BACKEND_URL}/${ENDPOINTS.VNFD}`;
  const data = JSON.stringify(payload);
  const config = {
    headers: buildHeaderWithAuth(bearerToken),
  };
  try {
    await axios.post(url, data, config).then(async (response) => {
      console.log("response for url", url, response);
      store.commit("backend/setApiCallData", {
        callId: apiCallIDs.POST_VNFD,
        data: response,
        fieldName: BACKEND_STORE_FIELD_NAMES.RESPONSE,
      });
    });
  } catch (e) {
    console.log("error whilst performing call to", url, "error:", e);
  }
  store.commit("appState/setIsLoading", false);
};

const apiCall_GET_vnfds = async () => {
  store.commit("appState/setIsLoading", true);
  const bearerToken = await store.getters["appState/getBearerToken"];
  if (_isNil(bearerToken)) {
    console.log("no bearertoken, rejecting...");
    return;
  }
  const url = `${BACKEND_URL}/${ENDPOINTS.VNFD}`;
  const config = {
    headers: buildHeaderWithAuth(bearerToken),
  };
  try {
    await axios.get(url, config).then(async (response) => {
      console.log("response for url", url, response); // TODO: CLEANUP logs
      store.commit("backend/setApiCallData", {
        callId: apiCallIDs.GET_VNFDS,
        data: response,
        fieldName: BACKEND_STORE_FIELD_NAMES.RESPONSE,
      });
    });
  } catch (e) {
    console.log("error whilst performing call to", url, "error:", e);
  }
  store.commit("appState/setIsLoading", false);
};

const apiCall_GET_vnfd = async (vnfdId) => {
  store.commit("appState/setIsLoading", true);
  const bearerToken = await store.getters["appState/getBearerToken"];
  if (_isNil(bearerToken)) {
    console.log("no bearertoken, rejecting...");
    return;
  }
  const url = `${BACKEND_URL}/${ENDPOINTS.VNFD}/${vnfdId}`;
  const config = {
    headers: buildHeaderWithAuth(bearerToken),
  };
  try {
    await axios.get(url, config).then(async (response) => {
      console.log("response for url", url, response); // TODO: CLEANUP logs
      store.commit("backend/setApiCallData", {
        callId: apiCallIDs.GET_VNFD,
        data: response,
        fieldName: BACKEND_STORE_FIELD_NAMES.RESPONSE,
      });
    });
  } catch (e) {
    console.log("error whilst performing call to", url, "error:", e);
  }
  store.commit("appState/setIsLoading", false);
};

const apiCall_GET_vnfs = async () => {
  store.commit("appState/setIsLoading", true);
  const bearerToken = await store.getters["appState/getBearerToken"];
  if (_isNil(bearerToken)) {
    console.log("no bearertoken, rejecting...");
    return;
  }
  const url = `${BACKEND_URL}/${ENDPOINTS.VNF}`;
  const config = {
    headers: buildHeaderWithAuth(bearerToken),
  };
  try {
    await axios.get(url, config).then(async (response) => {
      console.log("response for url", url, response); // TODO: CLEANUP logs
      store.commit("backend/setApiCallData", {
        callId: apiCallIDs.GET_VNFS,
        data: response,
        fieldName: BACKEND_STORE_FIELD_NAMES.RESPONSE,
      });
    });
  } catch (e) {
    console.log("error whilst performing call to", url, "error:", e);
  }
  store.commit("appState/setIsLoading", false);
};

const apiCall_GET_vnf = async (vnfId) => {
  store.commit("appState/setIsLoading", true);
  const bearerToken = await store.getters["appState/getBearerToken"];
  if (_isNil(bearerToken)) {
    console.log("no bearertoken, rejecting...");
    return;
  }
  const url = `${BACKEND_URL}/${ENDPOINTS.VNF}/${vnfId}`;
  const config = {
    headers: buildHeaderWithAuth(bearerToken),
  };
  try {
    await axios.get(url, config).then(async (response) => {
      console.log("response for url", url, response); // TODO: CLEANUP logs
      store.commit("backend/setApiCallData", {
        callId: apiCallIDs.GET_VNF_INSTANCE,
        data: response,
        fieldName: BACKEND_STORE_FIELD_NAMES.RESPONSE,
      });
    });
  } catch (e) {
    console.log("error whilst performing call to", url, "error:", e);
  }
  store.commit("appState/setIsLoading", false);
};

export {
  apiCall_POST_token,
  apiCall_PUT_token,
  apiCall_GET_vnfds,
  apiCall_POST_vnfd,
  apiCall_GET_vnfd,
  apiCall_GET_vnfs,
  apiCall_GET_vnf,
};
