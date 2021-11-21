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
          next("/");
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

// const routesToCheck = [
// TODO: use in beforeEach guard
//  -> send back to /home if user not registered
//  -> (if also no eth account, then /home will push to /)
//   routeNames.BACKEND_VIEW,
//   routeNames.CONTRACT_VIEW,
//   routeNames.ABOUT,
// ];

router.beforeEach(async (to, from, next) => {
  if (Object.values(routeNames).includes(to.name)) {
    // if called a valid route
    console.log("valid route", to.path);
    next();
  } else {
    console.log("invalid route", to.path);
    next("/");
  }
});


export default router;
