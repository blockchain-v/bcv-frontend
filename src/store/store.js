import { createStore } from "vuex";

// import store modules
import contracts from "./modules/contracts";
import appState from "./modules/appState";
import backend from "./modules/backend";

// Vue.use(Vuex);

const store = createStore({
  // list modules
  modules: {
    contracts,
    appState,
    backend,
  },
});

export default store;
