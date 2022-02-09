/*
Store module for managing app state data globally
*/

// initial state
const state = {
  isLoading: false,
  waitingForContractFeedback: false,
  /*this state is specifically for the auth flow in ROOT/HOME, hence a separate
  generic state for use with user feedback, spinner text etc. */
  awaitingContract: false,
  registrationCheckDone: false,
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
  getWaitingForContractFeedback() {
    return state.waitingForContractFeedback;
  },
  getRegistrationCheckDone() {
    return state.registrationCheckDone;
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
  setWaitingForContractFeedback({ commit }, value) {
    commit("setWaitingForContractFeedback", value);
  },
  setRegistrationCheckDone({ commit }, value) {
    commit("setRegistrationCheckDone", value);
  },
  setAwaitingContract({ commit }, value) {
    commit("setAwaitingContract", value);
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
  setWaitingForContractFeedback(state, value) {
    state.waitingForContractFeedback = value;
  },
  setAwaitingContract(state, value) {
    state.awaitingContract = value;
  },
  setRegistrationCheckDone(state, value) {
    state.registrationCheckDone = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
