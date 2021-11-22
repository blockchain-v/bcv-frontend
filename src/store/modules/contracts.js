/*
Store module for managing contract call data globally
*/

// initial state
const state = {
  userETHAccount: null,
  currentVNFDescriptorInput: null,
  currentVNFToDelete: null,
  eventNotifications: [],
  // DEV only
  currentVNFDetailsID: null,
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
  getCurrentVNFDescriptorInput() {
    return state.currentVNFDescriptorInput;
  },
  getCurrentVNFToDelete() {
    return state.currentVNFToDelete;
  },
  getEventNotifications(eventType){
    return state.eventNotifications[eventType];
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
  setCurrentVNFDescriptorInput({ commit }, input) {
    commit("setCurrentVNFDescriptorInput", input);
  },
  setCurrentVNFToDelete({ commit }, input) {
    commit("setCurrentVNFToDelete", input);
  },
  setEventNotifications( { commit }, {eventType, notification}){
    commit("setEventNotifications", {eventType: eventType, notification: notification});
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
  setCurrentVNFDescriptorInput(state, input) {
    state.currentVNFDescriptorInput = input;
  },
  setCurrentVNFToDelete(state, input) {
    state.currentVNFToDelete = input;
  },
  setEventNotifications(state, {eventType, notification}) {
    state.eventNotifications[eventType] = notification;
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
