import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";
import "@/scss/index.scss";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

import ElementPlus from "element-plus";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.directive("disable-validation", {
  mounted(el) {
    if (el.tagName === "FORM") {
      el.setAttribute("novalidate", "");
    }
  },
});

app.mixin({
  mounted() {
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.setAttribute("novalidate", "");
    });
  },
});

app.mount("#app");
