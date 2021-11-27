/*
Store module for managing api call data globally
*/
import {
  apiCallIDs,
  BACKEND_STORE_FIELD_NAMES,
} from "../../constants/apiInterfaceConfig";

/*
TODO:
    - consider: currently store entire response, could be more elegant, such as
    e.g. just status code & data OR just data -> only set when successful
 */

// initial state
const state = {
  [apiCallIDs.GET_VNFDS]: {
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
  },
  [apiCallIDs.GET_VNFD]: {
    [BACKEND_STORE_FIELD_NAMES.VNFDID]: null,
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
  },
  [apiCallIDs.POST_VNFD]: {
    [BACKEND_STORE_FIELD_NAMES.NAME]: null,
    [BACKEND_STORE_FIELD_NAMES.DESCRIPTION]: null,
    [BACKEND_STORE_FIELD_NAMES.ATTRIBUTES]: null,
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
  },
  [apiCallIDs.GET_VNFS]: {
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
  },
  [apiCallIDs.GET_VNF_INSTANCE]: {
    [BACKEND_STORE_FIELD_NAMES.VNFID]: null,
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
  },
};

// getters
const getters = {
  getApiCallData(callId) {
    return state[callId] || undefined;
  },
};

// actions
const actions = {
  setApiCallData({ commit }, { callId, data, fieldName }) {
    commit("setApiCallData", { callId, data, fieldName });
  },
};

// mutations
const mutations = {
  setApiCallData(state, { callId, data, fieldName }) {
    state[callId][fieldName] = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};