import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// Import the plugin here
import AuthPlugin from "./plugins/auth";

// Install the authentication plugin here
Vue.use(AuthPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
