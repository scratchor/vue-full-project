import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import auth from "./auth/authService";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/secret",
      name: "secret",
      component: () => import("./views/Secret.vue")
    },
    {
      path: "/callback",
      name: "callback",
      component: () => import("./views/Сallback.vue")
    },
    {
      path: "/notauthorized",
      name: "notauthorized",
      component: () => import("./views/NotAuthorized.vue")
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("./views/Profile.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path === "/" || to.path === "/callback" || auth.isAuthenticated()) {
    return next();
  }
  if (auth.isExpired()) {
    auth.renewTokens();
    return next();
  }

  // Specify the current path as the customState parameter, meaning it
  // will be returned to the application after auth
  return auth.login({ target: `${to.fullPath}` });
});

export default router;
