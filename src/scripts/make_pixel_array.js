function splitarray(input, spacing) {
  // split the image data into [R,G,B,A] arrays
  let output = [];
  for (let i = 0; i < input.length; i += spacing) {
    output[output.length] = input.slice(i, i + spacing);
  }
  output = output.map((x) => [...x.slice(0, 3)]);
  return output;
}

function make_pixel_array(imageData, im_width) {
  // convert image data list into a 3d array matching the width and length of the image
  const pixel_array = splitarray(imageData.data, 4).reduce((acc, subarr) => {
    if (acc.length === 0 || acc[acc.length - 1].length === im_width) {
      acc.push([subarr]);
    } else {
      acc[acc.length - 1].push(subarr);
    }
    return acc;
  }, []);
  return pixel_array;
}
export { make_pixel_array };
export { splitarray };
