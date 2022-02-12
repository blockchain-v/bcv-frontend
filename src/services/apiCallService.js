import axios from "axios";
import { BACKEND_URL, DEFAULT_HEADERS, ENDPOINTS } from "../constants/http";
import store from "../store/store.js";
import {
  BACKEND_STORE_FIELD_NAMES,
  actionIDs,
} from "../constants/interfaceConfig";
import { isNil as _isNil } from "lodash";
import add from "date-fns/add";

// --------------- HELPERS ---------------------------------------------------------------------------------------------
const buildHeaderWithAuth = (bearerToken) => {
  return {
    ...DEFAULT_HEADERS,
    Authorization: bearerToken,
  };
};

const writeToNotificaitonQueue = (actionId, isError, body) => {
  // only use for calls where useful to get feedback (data calls)
  store.commit("backend/writeToApiNotificationQueue", {
    actionId,
    isError,
    body,
  });
};

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
      if (response.status === 200 || response.status === 201) {
        if (response.data.isRegistered) {
          document.cookie = `token=${response.data.token}; expires=${add(
            new Date(),
            { days: 1 }
          ).toUTCString()}`;
        }

        await store.dispatch("appState/setBearerToken", response.data.token);
        store
          .dispatch("contracts/setUserRegistered", response.data.isRegistered)
          .then(() => {
            store.commit("appState/setRegistrationCheckDone", true);
          });
      }
    })
    .catch(async (error) => {
      console.log(`error whilst performing call to ${url}, error:`, error);
      if (error.response.status === 401) {
        store.dispatch("contracts/setUserRegistered", false).then(() => {
          store.commit("appState/setRegistrationCheckDone", true);
        });
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
      if (response.status === 201) {
        store.commit("appState/setNonce", response.data.nonce);
      }
    });
  } catch (e) {
    console.log(`error whilst performing call to ${url}, error:`, e);
  }
};

// DATA CALLS
const apiCall_GET_errorMsg = async (params) => {
  store.commit("appState/setIsLoading", true);
  const bearerToken = await store.getters["appState/getBearerToken"];
  if (_isNil(bearerToken)) {
    console.warn("no bearertoken, rejecting...");
    return;
  }
  const url = `${BACKEND_URL}/${ENDPOINTS.ERROR_MSG}`;
  const config = {
    headers: buildHeaderWithAuth(bearerToken),
    params,
  };
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.log(`error whilst performing call to ${url}, error:`, error);
  }
};

const apiCall_POST_vnfd = async (payload) => {
  store.commit("appState/setIsLoading", true);
  const bearerToken = await store.getters["appState/getBearerToken"];
  if (_isNil(bearerToken)) {
    console.warn("no bearertoken, rejecting...");
    return;
  }
  const url = `${BACKEND_URL}/${ENDPOINTS.VNFD}`;
  const data = JSON.stringify(payload);
  const config = {
    headers: buildHeaderWithAuth(bearerToken),
  };
  const id = actionIDs.POST_VNFD;

  axios
    .post(url, data, config)
    .then(async (response) => {
      store.commit("backend/setApiCallData", {
        actionId: id,
        data: response,
        fieldName: BACKEND_STORE_FIELD_NAMES.RESPONSE,
      });
      writeToNotificaitonQueue(id, false, response);
    })
    .catch((error) => {
      writeToNotificaitonQueue(id, true, error.response);
    });

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
      store.commit("backend/setApiCallData", {
        actionId: actionIDs.GET_VNFDS,
        data: response,
        fieldName: BACKEND_STORE_FIELD_NAMES.RESPONSE,
      });
    });
  } catch (e) {
    console.log(`error whilst performing call to ${url}, error:`, e);
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
      store.commit("backend/setApiCallData", {
        actionId: actionIDs.GET_VNFD,
        data: response,
        fieldName: BACKEND_STORE_FIELD_NAMES.RESPONSE,
      });
    });
  } catch (e) {
    console.log(`error whilst performing call to ${url}, error:`, e);
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
      store.commit("backend/setApiCallData", {
        actionId: actionIDs.GET_VNFS,
        data: response,
        fieldName: BACKEND_STORE_FIELD_NAMES.RESPONSE,
      });
    });
  } catch (e) {
    console.log(`error whilst performing call to ${url}, error:`, e);
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
      store.commit("backend/setApiCallData", {
        actionId: actionIDs.GET_VNF_INSTANCE,
        data: response,
        fieldName: BACKEND_STORE_FIELD_NAMES.RESPONSE,
      });
    });
  } catch (e) {
    console.log(`error whilst performing call to ${url}, error:`, e);
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
  apiCall_GET_errorMsg,
};
