/*
Store module for managing contract call data globally
*/
import {
  actionIDs,
  BACKEND_STORE_FIELD_NAMES,
} from "../../constants/interfaceConfig";
import { v4 as uuidv4 } from "uuid";
import { remove as _remove, cloneDeep as _cloneDeep } from "lodash";

// initial state
const state = {
  userETHAccount: null,
  userRegistered: false,
  eventNotifications: [],
  [actionIDs.DEPLOY_VNF]: {
    [BACKEND_STORE_FIELD_NAMES.VNFDID]: null,
    [BACKEND_STORE_FIELD_NAMES.NAME]: null,
    [BACKEND_STORE_FIELD_NAMES.DESCRIPTION]: null,
    [BACKEND_STORE_FIELD_NAMES.ATTRIBUTES]: null,
    [BACKEND_STORE_FIELD_NAMES.RESPONSE]: null,
    [BACKEND_STORE_FIELD_NAMES.CONFIG]: null,
    /* decided against nesting config in 'ATTRIBUTES' too, because the updating becomes a
    pain with the possible combinations of config/no config/params/no params/no attributes */
  },
  eventNotificationQueue: [],
  // DEV only
  currentVNFDetailsID: null, // TODO CLEANUP
};

// getters
const getters = {
  getUserETHAccount() {
    return state.userETHAccount;
  },
  getUserRegistered() {
    return state.userRegistered;
  },
  getDeployVnfData() {
    return state[actionIDs.DEPLOY_VNF];
  },
};

// actions
const actions = {
  setUserETHAccount({ commit }, account) {
    commit("setUserETHAccount", account);
  },
  setUserRegistered({ commit }, bool) {
    commit("setUserRegistered", bool);
  },
  setEventNotifications({ commit }, { eventType, notification, message }) {
    commit("setEventNotifications", {
      eventType: eventType,
      notification: notification,
      message: message,
    });
  },
  writeToEventNotificationQueue({ commit }, { eventType, isError, body, msg }) {
    commit("writeToEventNotificationQueue", { eventType, isError, body, msg });
  },
  purgeEventNotification({ commit }, id) {
    commit("purgeEventNotification", id);
  },
  setContractCallData({ commit }, { actionId, data, fieldName }) {
    commit("setContractCallData", { actionId, data, fieldName });
  },
  // async getter via actions
  getAccountStatus() {
    return new Promise((resolve) => {
      resolve({
        ethAccount: state.userETHAccount,
        userRegistered: state.userRegistered,
      });
    });
  },
};

// mutations
const mutations = {
  setUserETHAccount(state, account) {
    state.userETHAccount = account;
  },
  setUserRegistered(state, bool) {
    state.userRegistered = bool;
  },
  setEventNotifications(state, { eventType, notification, message }) {
    state.eventNotifications[eventType] = {
      notification: notification,
      message: message,
    };
  },
  writeToEventNotificationQueue(state, { eventType, isError, body, msg }) {
    state.eventNotificationQueue.push(
      createEventNotificationEntry(eventType, isError, body, msg)
    );
  },
  purgeEventNotification(state, id) {
    console.log("supposed to purge with id:", id);
    const clone = _cloneDeep(state.eventNotificationQueue);
    _remove(clone, (entry) => {
      return entry.id === id;
    });
    /*
    bit confusing, but lodash _.remove operates in place on the provided array and
    returns an array of the REMOVED values, hence assign the clone to state.
     */
    state.eventNotificationQueue = clone;
  },
  setContractCallData(state, { actionId, data, fieldName }) {
    state[actionId][fieldName] = data;
  },
  // DEV only
  setCurrentVNFDetailsID(state, id) {
    state.currentVNFDetailsID = id;
  },
};

// helpers
const createEventNotificationEntry = (eventType, isError, body, msg) => {
  return {
    id: uuidv4(),
    eventType,
    isError,
    body,
    msg,
    timestamp: Date.now(),
  };
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
