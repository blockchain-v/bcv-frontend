/*
Store module for managing contract call data globally
*/

// initial state
const state = {
  userETHAccount: null,
  currentVNFDescriptorInput: null,
};

// getters
const getters = {
  getUserETHAccount() {
    return state.userETHAccount;
  },
  getCurrentVNFDescriptorInput() {
    return state.currentVNFDescriptorInput;
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
    console.log("set currentVNFDescriptorinput to", input, "in store");
    // TODO: CLEANUP logs
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
