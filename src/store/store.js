import { createStore } from "vuex";

// import store modules
import contracts from "./modules/contracts";
import appState from "./modules/appState";

// Vue.use(Vuex);

const store = createStore({
  // list modules
  modules: {
    contracts,
    appState,
  },
});

export default store;
