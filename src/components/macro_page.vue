<template>
  <v-container>
    <v-header>
      <h1>Dwarf Fortress Macro Generator</h1>
    </v-header>
    <v-sub-header>
      <h3>Upload a .png of your layout. Each pixel equals a tile in game.</h3>
    </v-sub-header>
    <span>
      I recommend using a graphics editor like Photoshop or an online pixel art
      tool like
      <a href="https://www.pixilart.com/draw">pixilart.com</a> to design your
      fortress.
      <br />
      <br />
    </span>
    <v-row>
      <v-col class="d-flex justify-center">
        <v-form ref="form" class="w-25">
          <v-file-input
            type="file"
            label="Upload Image"
            prepend-icon="mdi-image"
            @change="uploadFile($event)"
          ></v-file-input>
        </v-form>
        <v-btn class="ml-10 mt-2" @click="readFile($event)">UPLOAD</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-checkbox label=""></v-checkbox>
      </v-col>
    </v-row>
    <color_legend></color_legend>
    <v-row>
      <v-col>
        <v-row>
          <v-col><v-title>Uploaded Image</v-title><br /> </v-col>
        </v-row>
        <v-row class="d-flex justify-center">
          <v-img
            id="image-preview"
            :src="image"
            :max-width="showCanvas_width"
            :height="showCanvas_height"
          >
            <template v-slot:placeholder>
              <v-row
                v-if="file_name"
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-row>
        <v-row v-if="colors_used">
          <v-col>
            Colors used in this image (that match the color legend)
          </v-col>
        </v-row>
        <color_list :colors_used="colors_used"></color_list>
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
import color_legend from "./color_legend.vue";

export default {
  components: {
    highlightjs: hljsVuePlugin.component,
    color_list,
    color_legend,
  },
  data: function () {
    return {
      MacroText: "Upload image file to generate macro...",
      pixelData: null,
      imageFile: null,
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
    uploadFile(e) {
      // this.imageFile = e.target.files || e.dataTransfer.files;
      this.imageFile = e.target;
    },
    readFile() {
      this.image = null;
      this.file_name = "";
      let reader = new FileReader();
      // let files = e.target.files || e.dataTransfer.files;
      if (!this.imageFile.files.length) return;
      reader.readAsDataURL(this.imageFile.files[0]); // Read file from input form
      this.file_name = this.imageFile.value.match(/^.*?([^\\/.]*)[^\\/]*$/)[1];
      //RESET SOME THINGS
      this.colors_used = [];
      this.readCanvas.clearRect(
        0,
        0,
        this.readCanvas.width,
        this.readCanvas.height
      );

      reader.onload = (e) => {
        // get pixels once image is loaded

        this.img.src = e.target.result; // create DOM image from reader result
        this.img.onload = () => {
          let ar = this.img.width / this.img.height;
          let draw_height = 0;
          let draw_width = 0;
          console.log("AR: ", ar);
          if (ar < 1) {
            draw_height = this.showCanvas_height;
            draw_width = this.showCanvas_width * ar;
          } else {
            draw_height = this.showCanvas_height / ar;
            draw_width = this.showCanvas_width;
          }
          console.log("draw width", draw_width, "draw height", draw_height);
          this.image = this.img.src;
          this.img_width = this.img.width;
          this.img_height = this.img.height;
          let draw_config = [this.img, 0, 0];
          this.readCanvas.drawImage(...draw_config); // put image into dom once loaded
          // this.showCanvas.drawImage(...draw_config, draw_width, draw_height); // put image into dom once loaded
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

    // const cS = document.getElementById("showCanvas");
    // const ctxS = cS.getContext("2d");
    // ctxS.imageSmoothingEnabled = false;
    // this.showCanvas = ctxS;
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
#image-preview {
  image-rendering: pixelated;
}
</style>
