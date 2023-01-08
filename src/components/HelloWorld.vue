<template>
  <div>
    <input
      type="file"
      name="image"
      id="image"
      @change="readFile($event)"
    /><br />
    <button id="download" @click="download_macro">DOWNLOAD</button>
    <canvas id="canvas" :height="img_height" :width="img_width"></canvas><br />
    <pre id="macro_code"><code id="macro_text">{{ MacroText }}</code></pre>
  </div>
</template>

<script>
import { makemacro } from "../scripts/macromaker.js";
export default {
  name: "HelloWorld",
  data: function () {
    return {
      MacroText: null,
      pixelData: null,
      vueCanvas: null,
      image: null,
      img: new Image(),
      img_width: null,
      img_height: null,
      file_name: null,
    };
  },
  props: {
    msg: String,
  },
  methods: {
    readFile(e) {
      // let img = new Image();
      let reader = new FileReader();
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      reader.readAsDataURL(files[0]); // Read file from input form
      // console.log(e.target.value);
      this.file_name = e.target.value.match(/^.*?([^\\/.]*)[^\\/]*$/)[1];
      // this.file_name = e.target.value.split(/(\\|\/)/g).pop();

      reader.onload = (e) => {
        // get pixels once image is loaded
        this.image = e.target.result; // store image in component for funsies i guess
        this.img.src = e.target.result; // create DOM image from reader result
        this.img.onload = () => {
          this.img_width = this.img.width;
          this.img_height = this.img.height;
          this.vueCanvas.drawImage(
            this.img,
            0,
            0,
            this.img_width,
            this.img_height
          ); // put image into dom once loaded
          let imgData = this.vueCanvas.getImageData(
            //
            0,
            0,
            this.img.width,
            this.img.height
          );
          console.log(imgData.data);
          this.MacroText = this.file_name + "\n";
          this.MacroText += makemacro(imgData);
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
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    this.vueCanvas = ctx;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
#macro_code {
  width: 300px;
  text-align: left;
}
#canvas {
  width: auto;
  height: auto;
}
</style>
