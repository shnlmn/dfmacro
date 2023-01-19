import { make_pixel_array } from "./make_pixel_array";
import { macro_commands } from "./macro_commands";
import { designationsLookup } from "./macro_commands";
function makemacro(imageData) {
  const mc = new macro_commands();
  const im_width = imageData.width;
  const im_height = imageData.height;
  let current_color = "255,255,255";
  let next_color;
  let last_color = current_color;

  let macroText = "";

  // convert image data list into a 3d array matching the width and length of the image
  const pixel_array = make_pixel_array(imageData, im_width);
  for (let i = 0; i < im_height; i++) {
    // Begin Reading Rows
    let width_list;
    let count;
    let advance;
    if (i % 2 !== 0) {
      width_list = [...Array(im_width).keys()].reverse();
      count = -1;
      advance = mc.left;
    } else {
      width_list = [...Array(im_width).keys()];
      count = 1;
      advance = mc.right;
    }

    if (i > 0) {
      macroText += mc.down;
    }

    current_color = "255,255,255";

    for (let j of width_list) {
      let line_end = false;
      last_color = current_color;
      current_color = pixel_array[i][j].slice(0, 3);
      if (j + count >= 0 && j + count < im_width) {
        next_color = pixel_array[i][j + count].slice(0, 3);
      } else {
        line_end = true;
        next_color = "255,255,255";
      }

      let Dc = designationsLookup[current_color.toString()];
      let Dp = designationsLookup[last_color.toString()];
      let Dn = designationsLookup[next_color.toString()];
      if (Dc["id"] !== Dp["id"]) {
        if (Dc["id"] !== "NONE") {
          macroText += Dc["command"];
          macroText += mc.select;
        }
      }
      if (Dn !== Dc && Dc["id"] != "NONE") {
        macroText += mc.select;
      }
      if (!line_end) {
        macroText += advance;
      }
    }
  }
  macroText += mc.end_macro;
  return macroText;
}
export { makemacro };
