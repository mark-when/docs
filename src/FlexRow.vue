<script setup lang="ts">
import { ref } from "vue";
const slot = ref(null);
</script>

<template>
  <div ref="slot" class="flex">
    <slot />
  </div>
</template>

<style scoped></style>
