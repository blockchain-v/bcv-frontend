import axios from "axios";
import { BACKEND_URL, DEFAULT_HEADERS, ENDPOINTS } from "../constants/http";
import store from "../store/store.js";

const apiCall_challenge = async (payload) => {
  const url = `${BACKEND_URL}/${ENDPOINTS.TOKEN}`;
  const data = JSON.stringify(payload);
  const config = {
    headers: DEFAULT_HEADERS,
  };
  try {
    await axios.post(url, data, config).then(async (response) => {
      console.log("response:", response);
      // TODO: set token
      // TODO: set isRegistered to store if correct status
      if (response.status === 200) {
        console.log("i just lied - TODO: actual user register check");
        await store.dispatch("contracts/setUserRegistered", true);
      }
    });
  } catch (e) {
    console.log("error whilst performing call to", url);
  }
};

export { apiCall_challenge };
