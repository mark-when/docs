<script setup lang="ts">
import { ref } from "vue";
import ExpositionLines from "./ExpositionLines.vue";
const slot = ref(null);

const props = defineProps<{ expo: [] }>();
</script>

<template>
  <div class="flex">
    <div class="mt-[36px] relative w-56">
      <ExpositionLines v-for="ex in expo" :lines="ex[0]"
        ><div v-html="ex[1]"></div
      ></ExpositionLines>
    </div>
    <div ref="slot" class="grow">
      <slot />
    </div>
  </div>
</template>
