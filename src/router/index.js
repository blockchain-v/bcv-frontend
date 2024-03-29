import { createRouter, createWebHistory } from "vue-router";
import store from "../store/store.js";
import { isNil as _isNil } from "lodash";
import { getToken } from "../services/appService";

export const routeNames = {
  ROOT: "Root",
  HOME: "Home",
  ABOUT: "About",
  USER: "User",
  VNF: "VNF",
  VNFD: "VNFD",
};

const routes = [
  {
    path: "/about",
    name: routeNames.ABOUT,
    component: () => import("../views/About.vue"),
  },
  {
    path: "/user",
    name: routeNames.USER,
    component: () => import("../views/UserView"),
  },
  {
    path: "/vnf",
    name: routeNames.VNF,
    component: () => import("../views/VNFView"),
  },
  {
    path: "/vnfd",
    name: routeNames.VNFD,
    component: () => import("../views/VNFDView"),
  },
  {
    path: "/home",
    name: routeNames.HOME,
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/",
    name: routeNames.ROOT,
    component: () => import("../views/AppRoot.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const routesToGuard = [routeNames.USER, routeNames.VNF, routeNames.VNFD];

router.beforeEach((to, from, next) => {
  if (!Object.values(routeNames).includes(to.name)) {
    // invalid route
    next({ name: routeNames.ROOT });
    return;
  }

  if (!routesToGuard.includes(to.name)) {
    // let non-guarded routes pass
    next();
    return;
  }

  const token = getToken();

  store.dispatch("contracts/getAccountStatus").then((res) => {
    if (_isNil(res.ethAccount)) {
      // send to root if no metamask account
      resetStore();
      next({ name: routeNames.ROOT });
      return;
    }
    if (!token) {
      // send to /home if user is not registered
      resetStore();
      next({ name: routeNames.HOME });
      return;
    }
    // resolve normally
    next();
  });
});

const resetStore = () => {
  store.commit("contracts/setUserRegistered", false);
  store.commit("appState/setRegistrationCheckDone", false);
};

export default router;
