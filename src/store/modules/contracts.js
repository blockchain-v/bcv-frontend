/*
Store module for managing contract call data globally
*/

// initial state
const state = {
  test: "test",
  userETHAccount: null,
};

// getters
const getters = {
  getTest() {
    return state.test;
  },
  getUserETHAccount() {
    return state.userETHAccount;
  },
};

// actions
const actions = {
  setTest({ commit }, value) {
    console.log("in action, received value:", value);
    commit("setTest", value);
  },
  setUserETHAccount({ commit }, account) {
    commit("setUserETHAccount", account);
  },
};

// mutations
const mutations = {
  setTest(state, value) {
    console.log("in mutation, value:", value);
    state.test = value;
  },
  setUserETHAccount(state, account) {
    state.userETHAccount = account;
    console.log("set userETHAccount to", account, "in store");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
