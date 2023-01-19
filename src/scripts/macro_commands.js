function macro_commands() {
  this.end_group = "\tEnd of group\n";
  this.end_macro = "End of macro\n";
  this.select = "\t\tSELECT\n" + this.end_group;
  this.right = "\t\tKEYBOARD_CURSOR_RIGHT\n" + this.end_group;
  this.left = "\t\tKEYBOARD_CURSOR_LEFT\n" + this.end_group;
  this.down = "\t\tKEYBOARD_CURSOR_DOWN\n" + this.end_group;
  this.z_up = "\t\tcursor_up_z\n" + this.end_group;
  this.z_down = "\t\tcursor_down_z\n" + this.end_group;
  this.d_dig = "\t\tD_DESIGNATE_DIG\n\t\tDESIGNATE_DIG\n" + this.end_group;
  this.d_channel = "\t\tDESIGNATE_CHANNEL\n" + this.end_group;
  this.d_ramp = "\t\tDESIGNATE_RAMP\n" + this.end_group;
  this.d_stair_up =
    "\t\tDESIGNATE_STAIR_UPDOWN\n" +
    this.end_group +
    this.select +
    this.z_up +
    this.select +
    this.z_down;
  this.d_stair_down =
    "\t\tDESIGNATE_STAIR_UPDOWN\n" +
    this.end_group +
    this.select +
    this.z_down +
    this.select +
    this.z_up;
}
// DESIGNATION IDS
const mc = new macro_commands();
const designationsLookup = {
  "255,255,255": { id: "NONE", command: "" },
  "0,0,0": { id: "DIG", command: mc.d_dig },
  "255,0,0": { id: "CHANNEL", command: mc.d_channel },
  "0,0,255": { id: "DIG_RAMP", command: mc.d_ramp },
  "0,255,0": {
    id: "DIG_STAIR_DOWN",
    command: mc.d_stair_down,
  },
  "255,255,0": {
    id: "DIG_STAIR_UP",
    command: mc.d_stair_up,
  },
};

module.exports = { macro_commands, designationsLookup };
// export default designationsLookup;
