/*
Store module for managing contract call data globally
*/
import {
  actionIDs,
  BACKEND_STORE_FIELD_NAMES,
} from "../../constants/interfaceConfig";

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
    console.log("set userETHAccount to", account, "in store");
    // TODO: CLEANUP logs
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
  setContractCallData(state, { actionId, data, fieldName }) {
    state[actionId][fieldName] = data;
  },
  // DEV only
  setCurrentVNFDetailsID(state, id) {
    state.currentVNFDetailsID = id;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
