<template>
  <v-card v-for="(key, color) in color_objs" :key="key" class="mx-auto">
    <template v-slot:prepend>
      <v-icon v-if="key.color" :style="{ color: `rgba(${key.color})` }">
        {{ key.icon }}
      </v-icon>
      <v-icon v-else :style="{ color: `rgba(${color})` }">
        {{ key.icon }}
      </v-icon>
    </template>
    <template v-slot:title> {{ key.id }}</template>
  </v-card>
</template>
<script>
import { designationsLookup } from "../scripts/macro_commands";
export default {
  props: {
    colors_used: null,
  },
  data: function () {
    return {
      color_objs: {},
    };
  },
  watch: {
    colors_used: function () {
      this.color_objs = {};
      this.colors_used.forEach((used) => {
        Object.entries(designationsLookup).forEach(([key, value]) => {
          if (used === key) {
            this.color_objs[key] = value;
          }
        });
      });
      return null;
    },
  },
};
</script>
<style lang=""></style>
