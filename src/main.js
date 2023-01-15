import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import hljs from "highlight.js/lib/core";
import plaintext from "highlight.js/lib/languages/plaintext.js";
import hljsVuePlugin from "@highlightjs/vue-plugin";

loadFonts();
hljs.registerLanguage("plaintext", plaintext);
createApp(App).use(vuetify).use(hljsVuePlugin).mount("#app");
