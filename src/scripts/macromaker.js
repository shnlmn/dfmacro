function makemacro(imageData) {
  const im_width = imageData.width;
  const im_height = imageData.height;
  let current_color = "255,255,255";
  let next_color;
  let last_color = current_color;
  const end_group = "\tEnd of group\n";
  const end_macro = "End of macro\n";
  const right = "\t\tKEYBOARD_CURSOR_RIGHT\n" + end_group;
  const left = "\t\tKEYBOARD_CURSOR_LEFT\n" + end_group;
  const down = "\t\tKEYBOARD_CURSOR_DOWN\n" + end_group;
  //   const z_up = "\t\tCURSOR_UP_Z\n" + end_group;
  //   const z_down = "\t\tCURSOR_DOWN_Z\n" + end_group;
  const select = "\t\tSELECT\n" + end_group;
  // DESIGNATIONS
  const d_dig = "\t\tD_DESIGNATE_DIG\n\t\tDESIGNATE_DIG\n" + end_group;
  const d_channel = "\t\tDESIGNATE_CHANNEL\n" + end_group;
  // DESIGNATION IDS
  const designationsLookup = {
    "255,255,255": { id: "NONE", command: "" },
    "0,0,0": { id: "DIG", command: d_dig },
    "255,0,0": { id: "CHANNEL", command: d_channel },
  };

  let macroText = "";

  function splitarray(input, spacing) {
    // split the image data into [R,G,B,A] arrays
    let output = [];
    for (let i = 0; i < input.length; i += spacing) {
      output[output.length] = input.slice(i, i + spacing);
    }
    return output;
  }
  // convert image data list into a 3d array matching the width and length of the image
  const pixel_array = splitarray(imageData.data, 4).reduce((acc, subarr) => {
    if (acc.length === 0 || acc[acc.length - 1].length === im_width) {
      acc.push([subarr]);
    } else {
      acc[acc.length - 1].push(subarr);
    }
    return acc;
  }, []);
  console.log(pixel_array);

  for (let i = 0; i < im_height; i++) {
    // Begin Reading Rows
    let width_list;
    let count;
    let advance;
    if (i % 2 !== 0) {
      width_list = [...Array(im_width).keys()].reverse();
      count = -1;
      advance = left;
    } else {
      width_list = [...Array(im_width).keys()];
      count = 1;
      advance = right;
    }

    if (i > 0) {
      macroText += down;
    }

    current_color = "255,255,255";

    for (let j of width_list) {
      console.log("j", j, "count", count);
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
      //   console.log(Dp["id"], Dc["id"], Dn["id"]);
      //   console.log(
      //     last_color.toString(),
      //     current_color.toString(),
      //     next_color.toString()
      //   );
      if (Dc["id"] !== Dp["id"]) {
        if (Dc["id"] !== "NONE") {
          macroText += Dc["command"];
          macroText += select;
        }
      }
      if (Dn !== Dc && Dc["id"] != "NONE") {
        macroText += select;
      }
      if (!line_end) {
        macroText += advance;
      }
      console.log("");
    }
  }
  macroText += end_macro;
  return macroText;
}
export { makemacro };
