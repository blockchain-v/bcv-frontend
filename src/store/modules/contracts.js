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
  },
  currentVNFDescriptorInput: null, // TODO: refactor away and delete -> use structure like for backend in store
  currentVNFToDelete: null, // TODO: refactor away and delete -> use structure like for backend in store
  // DEV only
  currentVNFDetailsID: null, // TODO CLEANUP
};

/*
TODO
  - (potentially) unified act/mut/get for the eventStatuses, e.g. some map object as state
  so setting can be done through the key for all statuses
 */

// getters
const getters = {
  getUserETHAccount() {
    return state.userETHAccount;
  },
  getUserRegistered() {
    return state.userRegistered;
  },
  getCurrentVNFDescriptorInput() {
    return state.currentVNFDescriptorInput;
  },
  getCurrentVNFToDelete() {
    return state.currentVNFToDelete;
  },
  getContractCallData() {
    /* returns all data, designed to be used like in e.g. 'contractCallService'
      because getters (unfortunately) cannot receive arguments
      alternatively, one might write individual getters, e.g. getDeployVNFData() */
    return state;
  },
  // DEV only
  getCurrentVNFDetailsID() {
    return state.currentVNFDetailsID;
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
  setCurrentVNFDescriptorInput({ commit }, input) {
    commit("setCurrentVNFDescriptorInput", input);
  },
  setCurrentVNFToDelete({ commit }, input) {
    commit("setCurrentVNFToDelete", input);
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
  // DEV only
  setCurrentVNFDetailsID({ commit }, id) {
    commit("setCurrentVNFDetailsID", id);
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
  setCurrentVNFDescriptorInput(state, input) {
    state.currentVNFDescriptorInput = input;
  },
  setCurrentVNFToDelete(state, input) {
    state.currentVNFToDelete = input;
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
