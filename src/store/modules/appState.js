/*
Store module for managing app state data globally
*/

// initial state
const state = {
  isLoading: false,
};

// getters
const getters = {
  getIsLoading() {
    return state.isLoading;
  },
};

// actions
const actions = {
  setIsLoading({ commit }, status) {
    commit("setIsLoading", status);
  },
};

// mutations
const mutations = {
  setIsLoading(state, status) {
    state.isLoading = status;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
