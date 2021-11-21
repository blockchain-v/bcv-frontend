import { createRouter, createWebHistory } from "vue-router";
import store from "../store/store.js";
import { isNil as _isNil } from "lodash";

export const routeNames = {
  ROOT: "Root",
  HOME: "Home",
  ABOUT: "About",
  CONTRACT_VIEW: "Contract View",
  BACKEND_VIEW: "Backend View",
};

const routes = [
  {
    path: "/",
    name: routeNames.ROOT,
    component: () => import("../views/AppRoot.vue"),
  },
  {
    path: "/home",
    name: routeNames.HOME,
    component: () => import("../views/Home.vue"),
    beforeEnter: async (to, from, next) => {
      await store.dispatch("contracts/getAccountStatus").then((res) => {
        if (_isNil(res.ethAccount)) {
          next({ name: routeNames.ROOT });
        } else {
          // if account present, resolve normally
          next();
        }
      });
    },
  },
  {
    path: "/about",
    name: routeNames.ABOUT,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/contract-view",
    name: routeNames.CONTRACT_VIEW,
    component: () => import("../views/ContractView.vue"),
  },
  {
    path: "/backend-view",
    name: routeNames.BACKEND_VIEW,
    component: () => import("../views/BackendCallView"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const routesToGuard = [routeNames.BACKEND_VIEW, routeNames.CONTRACT_VIEW];

router.beforeEach(async (to, from, next) => {
  if (Object.values(routeNames).includes(to.name)) {
    // if called a valid route
    if (routesToGuard.includes(to.name)) {
      await store.dispatch("contracts/getAccountStatus").then((res) => {
        if (!res.userRegistered) {
          /* 
          send to /home if no user registered
          -> if also no account present, /home will send to /
           */
          next({ name: routeNames.HOME });
        } else {
          next();
        }
      });
    } else {
      // let non-guarded routes pass
      next();
    }
  } else {
    console.log("invalid route", to.path);
    next({ name: routeNames.ROOT });
  }
});

export default router;
