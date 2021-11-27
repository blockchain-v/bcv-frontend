/*
Store module for managing app state data globally
*/

// initial state
const state = {
  isLoading: false,
  bearerToken: null,
};

// getters
const getters = {
  getIsLoading() {
    return state.isLoading;
  },
  getBearerToken() {
    return state.bearerToken;
  },
};

// actions
const actions = {
  setIsLoading({ commit }, status) {
    commit("setIsLoading", status);
  },
  setBearerToken({ commit }, token) {
    commit("setBearerToken", token);
  },
};

// mutations
const mutations = {
  setIsLoading(state, status) {
    state.isLoading = status;
  },
  setBearerToken(state, token) {
    state.bearerToken = token;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
