import axios from "axios";
import { BACKEND_URL, DEFAULT_HEADERS, ENDPOINTS } from "../constants/http";
import { apiCallIDs } from "../constants/apiInterfaceConfig";
import store from "../store/store.js";
import { FIELD_NAMES } from "../store/modules/backend";
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
const apiCall_challenge = async (payload) => {
  const url = `${BACKEND_URL}/${ENDPOINTS.TOKEN}`;
  const data = JSON.stringify(payload);
  const config = {
    headers: DEFAULT_HEADERS,
  };
  try {
    await axios.post(url, data, config).then(async (response) => {
      console.log("response for url", url, response);
      if (response.status === 200) {
        // TODO: maybe set the token to localStorage/sessionStorage so it can also be checked for?
        //  -> avoids having to resign upon refresh of the page -> discuss
        await store.dispatch("appState/setBearerToken", response.data.token);
        await store.dispatch("contracts/setUserRegistered", true);
      }
    });
  } catch (e) {
    console.log("error whilst performing call to", url, "error:", e);
  }
};

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
        fieldName: FIELD_NAMES.RESPONSE,
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
        fieldName: FIELD_NAMES.RESPONSE,
      });
    });
  } catch (e) {
    console.log("error whilst performing call to", url, "error:", e);
  }
  store.commit("appState/setIsLoading", false);
};

export {
  apiCall_challenge,
  apiCall_GET_vnfds,
  apiCall_POST_vnfd,
  apiCall_GET_vnfd,
};
