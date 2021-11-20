/*
Store module for managing contract call data globally
*/

// initial state
const state = {
  userETHAccount: null,
  currentVNFDescriptorInput: null,
  currentVNFToDelete: null,
  deploymentStatus: null,
  registrationStatus: null,
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
  getDeploymentStatus() {
    return state.deploymentStatus;
  },
  getRegistrationStatus() {
    return state.registrationStatus;
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
  setDeploymentStatus({ commit }, deploymentStatus) {
    commit("setDeploymentStatus", deploymentStatus);
  },
  setRegistrationStatus({ commit }, registrationStatus) {
    commit("setRegistrationStatus", registrationStatus);
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
  setDeploymentStatus(state, deploymentStatus) {
    state.deploymentStatus = deploymentStatus;
  },
  setRegistrationStatus(state, registrationStatus) {
    state.registrationStatus = registrationStatus;
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
