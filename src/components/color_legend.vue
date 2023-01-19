<template>
  <div>
    <v-container class="mb-6">
      <v-row no-gutters>
        <v-col
          v-for="(dl, color) in designationsLookup"
          :key="dl"
          cols="12"
          sm="4"
        >
          <v-card class="pa-2" tile>
            <template v-slot:prepend>
              <v-icon :style="{ color: `rgba(${color})` }">
                {{ icon }}
              </v-icon>
            </template>
            <template v-slot:title> {{ dl.id }}</template>
          </v-card>
        </v-col>
      </v-row>
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
