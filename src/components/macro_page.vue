<template>
  <v-container class="h-100">
    <v-header>
      <h1>Dwarf Fortress Macro</h1>
    </v-header>
    <v-row class="h-25">
      <v-col>
        <v-form ref="form">
          <v-file-input
            @change="readFile($event)"
            type="file"
            label="Upload Image"
            prepend-icon="mdi-image"
          ></v-file-input>
          <color_list :colors_used="colors_used"></color_list>
        </v-form>
      </v-col>

      <v-col>
        <v-title>Uploaded Image</v-title><br />
        <canvas
          id="showCanvas"
          :width="showCanvas_width"
          :height="showCanvas_height"
        ></canvas>
      </v-col>
      <v-col>
        <v-title>Macro Text</v-title>
        <highlightjs
          overflow-auto
          id="MacroText"
          v-if="MacroText"
          language="javascript"
          :code="MacroText"
        /><br />
        <v-btn @click="download_macro" color="primary"
          >Download .mak File</v-btn
        >
      </v-col>
    </v-row>
    <canvas id="readCanvas" style="visibility: hidden"></canvas>
  </v-container>
</template>
<script>
import { makemacro } from "../scripts/macromaker.js";
import { get_colors_used } from "../scripts/colors_used.js";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import color_list from "./color_list.vue";

export default {
  name: "HelloWorld",
  components: {
    highlightjs: hljsVuePlugin.component,
    color_list,
  },
  data: function () {
    return {
      MacroText: "Upload image file to generate macro...",
      pixelData: null,
      readCanvas: null,
      showCanvas: null,
      image: null,
      img: new Image(),
      img_width: null,
      img_height: null,
      file_name: null,
      image_display_width: 300,
      showCanvas_width: 300,
      showCanvas_height: 300,
      colors_used: null,
    };
  },
  props: {
    msg: String,
  },
  methods: {
    readFile(e) {
      let reader = new FileReader();
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      reader.readAsDataURL(files[0]); // Read file from input form
      this.file_name = e.target.value.match(/^.*?([^\\/.]*)[^\\/]*$/)[1];

      reader.onload = (e) => {
        // get pixels once image is loaded

        this.img.src = e.target.result; // create DOM image from reader result
        this.img.onload = () => {
          let ar = this.img.width / this.img.height;
          let draw_height = 0;
          let draw_width = 0;
          if (ar > 0) {
            draw_height = 300;
            draw_width = 300 * ar;
          } else {
            draw_height = 300 * ar;
            draw_width = 300;
          }
          this.image = this.img.src;
          this.img_width = this.img.width;
          this.img_height = this.img.height;
          let draw_config = [this.img, 0, 0];
          this.readCanvas.drawImage(...draw_config); // put image into dom once loaded
          this.showCanvas.drawImage(...draw_config, draw_width, draw_height); // put image into dom once loaded
          let imgData = this.readCanvas.getImageData(
            0,
            0,
            this.img.width,
            this.img.height
          );
          this.MacroText = this.file_name + "\n";
          this.MacroText += makemacro(imgData);
          this.colors_used = get_colors_used(imgData);
        };
      };
    },
    download_macro() {
      const content = this.MacroText;
      const file = new Blob([content], { type: "text/plain" });
      let link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = this.file_name + ".mak";
      link.click();
      URL.revokeObjectURL(link.href);
    },
  },
  mounted() {
    const c = document.getElementById("readCanvas");
    const ctx = c.getContext("2d");
    this.readCanvas = ctx;

    const cS = document.getElementById("showCanvas");
    const ctxS = cS.getContext("2d");
    ctxS.imageSmoothingEnabled = false;
    this.showCanvas = ctxS;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "highlight.js/styles/atom-one-dark.css";
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
#MacroText,
#MacroText > * {
  text-align: left;
  font-size: 0.85em;
  height: 300px;
  padding: 10px;
}
</style>
