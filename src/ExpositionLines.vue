<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ lines: [number, number] }>();
const firstLine = computed(() => props.lines[0]);
const numLines = computed(() => props.lines[1] - props.lines[0]);
</script>

<template>
  <div
    class="bg-zinc-200 dark:bg-zinc-800 flex flex-row exposition rounded-l my-px absolute left-0"
  >
    <div class="grow px-2 exposition-text"><slot></slot></div>
    <div class="flex flex-col">
      <div
        class="svgHolder flex items-center justify-center"
        v-for="line in numLines"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 text-zinc-400"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exposition {
  top: calc(
    v-bind(firstLine) * var(--vp-code-line-height) * var(--vp-code-font-size)
  );

  height: calc(
    v-bind(numLines) * var(--vp-code-line-height) * var(--vp-code-font-size) - 1px
  );

  width: 100%; /* Takes full width of positioned container */
}
.exposition-text {
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
}
.svgHolder {
  height: calc(var(--vp-code-line-height) * var(--vp-code-font-size));
}
</style>
