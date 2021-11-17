/*
Store module for managing contract call data globally
*/

// initial state
const state = {
  userETHAccount: null,
  currentVNFDescriptorInput: null,
  currentVNFToDelete: null,
  deploymentStatus: null,
  // DEV only
  currentVNFDetailsID: null,
};

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
  getDeploymentStatus(){
    return state.deploymentStatus;
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
  setDeploymentStatus({commit}, deploymentStatus){
    commit("setDeploymentStatus", deploymentStatus);
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
  setDeploymentStatus(state, deploymentStatus){
    state.deploymentStatus = deploymentStatus;
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
