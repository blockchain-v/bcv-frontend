// import Vue from "vue";
import { createStore } from "vuex";
// import Vuex from "vuex";

// import store modules
import contracts from "./modules/contracts";

// Vue.use(Vuex);

const store = createStore({
  // list modules
  modules: {
    contracts,
  },
});

export default store;
