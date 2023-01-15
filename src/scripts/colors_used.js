import { splitarray } from "./make_pixel_array";
function get_colors_used(imageData) {
  let img_array = splitarray(imageData.data, 4);
  img_array = img_array.map((x) => [...x].toString());
  let color_array = Array.from(new Set(img_array.map(JSON.stringify))).map(
    JSON.parse
  );
  console.log(img_array);
  return color_array;
}
export { get_colors_used };
