/*
Store module for managing api call data globally
*/
import {
  actionIDs,
  BACKEND_STORE_FIELD_NAMES,
} from "../../constants/interfaceConfig";

/*
TODO:
    - consider: currently store entire response, could be more elegant, such as
    e.g. just status code & data OR just data -> only set when successful
 */

// initial state
const state = {
  [actionIDs.GET_VNFDS]: {
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
  },
  [actionIDs.GET_VNFD]: {
    [BACKEND_STORE_FIELD_NAMES.VNFDID]: null,
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
  },
  [actionIDs.POST_VNFD]: {
    [BACKEND_STORE_FIELD_NAMES.NAME]: null,
    [BACKEND_STORE_FIELD_NAMES.DESCRIPTION]: null,
    [BACKEND_STORE_FIELD_NAMES.ATTRIBUTES]: null,
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
  },
  [actionIDs.GET_VNFS]: {
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
  },
  [actionIDs.GET_VNF_INSTANCE]: {
    [BACKEND_STORE_FIELD_NAMES.VNFID]: null,
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
  },
};

// getters
const getters = {
  getApiCallData(actionId) {
    // NOTE: invalid, getters cannot receieve parameters, do like in contracts (filter/access
    // from whole data after the fact, or write individual getters)
    return state[actionId] || undefined;
  },
};

// actions
const actions = {
  setApiCallData({ commit }, { actionId, data, fieldName }) {
    commit("setApiCallData", { actionId, data, fieldName });
  },
};

// mutations
const mutations = {
  setApiCallData(state, { actionId, data, fieldName }) {
    state[actionId][fieldName] = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
