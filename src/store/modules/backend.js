/*
Store module for managing api call data globally
*/
import {
  actionIDs,
  BACKEND_STORE_FIELD_NAMES,
} from "../../constants/interfaceConfig";
import { v4 as uuidv4 } from "uuid";
import { remove as _remove, cloneDeep as _cloneDeep } from "lodash";

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
  apiNotificationQueue: [],
};

// getters
const getters = {
  getApiNotification() {
    return state.apiNotificationQueue;
  },
  getHasApiNotification() {
    return state.apiNotificationQueue.length > 0;
  },
};

// actions
const actions = {
  setApiCallData({ commit }, { actionId, data, fieldName }) {
    commit("setApiCallData", { actionId, data, fieldName });
  },
  writeToApiNotificationQueue({ commit }, { actionId, isError, body }) {
    commit("writeToApiNotificationQueue", { actionId, isError, body });
  },
  purgeNotification({ commit }, id) {
    commit("purgeNotification", id);
  },
};

// mutations
const mutations = {
  setApiCallData(state, { actionId, data, fieldName }) {
    state[actionId][fieldName] = data;
  },
  writeToApiNotificationQueue(state, { actionId, isError, body }) {
    state.apiNotificationQueue.push(
      createApiNotificationEntry(actionId, isError, body)
    );
  },
  purgeNotification(state, id) {
    console.log("supposed to purge with id:", id);
    const clone = _cloneDeep(state.apiNotificationQueue);
    _remove(clone, (entry) => {
      return entry.id === id;
    });
    /*
    bit confusing, but lodash _.remove operates in place on the provided array and
    returns an array of the REMOVED values, hence assign the clone to state.
     */
    state.apiNotificationQueue = clone;
  },
};

// helpers
const createApiNotificationEntry = (actionId, isError, body) => {
  return {
    id: uuidv4(),
    actionId,
    isError,
    body,
  };
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
