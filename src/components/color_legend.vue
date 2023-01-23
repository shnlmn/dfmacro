<template>
  <div>
    <v-container>
      Command color key
      <v-card class="d-flex justify-center flex-wrap mb-6" sm="2" flat tile>
        <v-card
          v-for="(dl, color) in designationsLookup"
          :key="dl"
          :elevation="0"
          :style="{
            border: '0px',
          }"
        >
          <template v-slot:prepend>
            <v-icon v-if="dl.color" :style="{ color: `rgba(${dl.color})` }">
              {{ dl.icon }}
            </v-icon>
            <v-icon v-else :style="{ color: `rgba(${color})` }">
              {{ dl.icon }}
            </v-icon>
          </template>
          <template v-slot:title
            ><span class="text-sm">
              {{ dl.id }}
            </span>
          </template>
          <template v-slot:subtitle> RGB: {{ color }} </template>
        </v-card>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { designationsLookup } from "../scripts/macro_commands.js";
export default {
  data() {
    return {
      icon: "mdi-checkbox-blank",
      designationsLookup: designationsLookup,
    };
  },
};
</script>
<style lang=""></style>
