import axios from "axios";
import { BACKEND_URL, DEFAULT_HEADERS, ENDPOINTS } from "../constants/http";
import store from "../store/store.js";
import { isNil as _isNil } from "lodash";

const buildHeaderWithAuth = (bearerToken) => {
  return {
    ...DEFAULT_HEADERS,
    Authentication: bearerToken,
  };
};

const apiCall_challenge = async (payload) => {
  const url = `${BACKEND_URL}/${ENDPOINTS.TOKEN}`;
  const data = JSON.stringify(payload);
  const config = {
    headers: DEFAULT_HEADERS,
  };
  try {
    await axios.post(url, data, config).then(async (response) => {
      console.log("response:", response);
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
};

const apiCall_GET_vnfd = async () => {
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
      console.log("response for url", url, response);
    });
  } catch (e) {
    console.log("error whilst performing call to", url, "error:", e);
  }
};

export { apiCall_challenge, apiCall_GET_vnfd, apiCall_POST_vnfd };
