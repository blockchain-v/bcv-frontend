/*
Store module for managing app state data globally
*/

// initial state
const state = {
  isLoading: false,
  bearerToken: null,
  nonce: null,
};

// getters
const getters = {
  getIsLoading() {
    return state.isLoading;
  },
  getBearerToken() {
    return state.bearerToken;
  },
  getNonce() {
    return state.nonce;
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
  setNonce({ commit }, nonce) {
    return new Promise((resolve) => {
      resolve(commit("setNonce", nonce));
    });
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
  setNonce(state, nonce) {
    state.nonce = nonce;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
