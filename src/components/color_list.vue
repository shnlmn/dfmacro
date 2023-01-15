<template>
  <v-list-item v-for="color in color_objs" :key="color">
    <template v-slot:prepend>
      <v-avatar>
        <v-icon :style="{ color: `rgba(${color.color})` }">{{
          color.icon
        }}</v-icon>
      </v-avatar>
    </template>
    {{ color.command }}
  </v-list-item>
</template>
<script>
export default {
  props: {
    colors_used: null,
  },
  data: function () {
    return {
      color_objs: [],
      known_colors: [
        {
          black: {
            command: "DIG",
            color: "0,0,0,255",
            icon: "mdi-checkbox-blank",
          },
        },
        {
          white: {
            command: "NONE",
            color: "255,255,255,255",
            icon: "mdi-checkbox-blank",
          },
        },

        {
          red: {
            command: "CHANNEL",
            color: "255,0,0,255",
            icon: "mdi-checkbox-blank",
          },
        },
      ],
    };
  },
  methods: {
    CssStyle: function (color) {
      let retColor = "rgba(" + color.color + ")";
      console.log(retColor);
      return "rgba(" + retColor + ")";
    },
  },
  watch: {
    colors_used: function () {
      this.colors_used.forEach((used) => {
        this.known_colors.forEach((known) => {
          console.log(used, Object.values(known)[0].color);
          if (used === Object.values(known)[0].color) {
            this.color_objs.push(Object.values(known)[0]);
          }
        });
      });
      console.log(this.color_objs);
      return null;
    },
  },
};
</script>
<style lang=""></style>
