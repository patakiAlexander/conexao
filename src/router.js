import Vue from "vue";
import VueRouter from "vue-router";
import AuthRequired from "./utils/AuthRequired";



Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("./views/home"),
    beforeEnter: AuthRequired,
  },
  {
    path: "/user",
    component: () => import("./views/user"),
    redirect: "/user/login",
    children: [
      {
        path: "login",
        component: () =>
          import("./views/user/Login")
      },
    ]
  },
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history",
});
export default router;
