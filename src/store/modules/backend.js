/*
Store module for managing api call data globally
*/
import { apiCallIDs } from "../../constants/apiInterfaceConfig";

/*
TODO:
    - consider: currently store entire response, could be more elegant, such as
    e.g. just status code & data OR just data -> only set when successful
 */

export const FIELD_NAMES = {
  RESPONSE: "response",
  VNFDID: "vnfdId",
  VNFID: "vnfId",
};

// initial state
const state = {
  [apiCallIDs.GET_VNFDS]: {
    [FIELD_NAMES.RESPONSE]: null,
  },
  [apiCallIDs.GET_VNFD]: {
    [FIELD_NAMES.VNFDID]: null,
    [FIELD_NAMES.RESPONSE]: null,
  },
  [apiCallIDs.GET_VNFS]: {
    [FIELD_NAMES.RESPONSE]: null,
  },
  [apiCallIDs.GET_VNF_INSTANCE]: {
    [FIELD_NAMES.VNFID]: null,
    [FIELD_NAMES.RESPONSE]: null,
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
