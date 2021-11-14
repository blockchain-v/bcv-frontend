/*
Store module for managing contract call data globally
*/

// initial state
const state = {
  test: "test",
};

// getters
const getters = {
  getTest() {
    return state.test;
  },
};

// actions
const actions = {
  setTest({ commit }, value) {
    console.log("in action, received value:", value);
    commit("setTest", value);
  },
};

// mutations
const mutations = {
  setTest(state, value) {
    console.log("in mutation, value:", value);
    state.test = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
