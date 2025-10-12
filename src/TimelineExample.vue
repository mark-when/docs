<script setup lang="ts">
import { computed, ref } from "vue";
const slot = ref(null);

const b64 = computed(() => {
  const text = slot.value?.textContent?.substring(2) as string;
  return btoa(text?.replaceAll(/ /g, "") || "");
});
</script>

<template>
  <div class="flex min-h-72">
    <div ref="slot" class="w-1/2 flex code overflow-x-auto">
      <slot />
    </div>
    <div class="w-1/2 flex p-2">
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
  min-width: 100%;
}
</style>
