<script setup lang="ts">
import { computed, ref } from "vue";
import { parse } from "@markwhen/parser";
const slot = ref(null);

const b64 = computed(() => {
  const text = slot.value?.textContent?.substring(2) as string;
  console.log(slot.value?.textContent?.substring(2));
  return btoa(text?.replaceAll(/ /g, "") || "");
});
</script>

<template>
  <div class="flex min-h-72">
    <div ref="slot" class="grow flex code">
      <slot />
    </div>
    <div class="grow flex p-2">
      <iframe
        class="grow"
        :src="`https://timeline2.markwhen.com#mw=${b64}`"
        ref="frame"
      ></iframe>
      <div></div>
    </div>
  </div>
</template>

<style>
.code > * {
  flex-grow: 1;
}
</style>
