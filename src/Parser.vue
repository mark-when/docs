<script setup lang="ts">
import { parse } from "@markwhen/parser";
import { computed, ref, watch, toRaw, watchEffect, onMounted } from "vue";

const text = ref(`title: My timeline example
description: Hello, world!

#Travel: blue
#Education: #ab5

group Travel #Travel
Jan 2019: The Bahamas [Bahamas](location) #Travel
endGroup

section Other stuff
August 2020 - now: Getting my degree #Education
endSection

`);
const parsed = computed(() => parse(text.value));
const textOutput = computed(() => JSON.stringify(parsed.value, null, 2));

watchEffect(() => {
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.parse = parse;
  }
});

watchEffect(() => {
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.markwhen = toRaw(parsed.value);
  }
});

onMounted(() => {
  console.log(
    "You can play with the parser and the output of the playground here, with `window.parse` and `window.markwhen`."
  );
});
</script>

<template>
  <div class="flex flex-col">
    <div class="font-bold">Input</div>
    <textarea
      class="font-mono border border-solid dark:border-gray-700 border-gray-200 p-2 rounded text-sm h-96 bg-gray-100 dark:bg-gray-900"
      v-model="text"
    ></textarea>
    <div class="flex flex-row items-center justify-center my-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
        />
      </svg>
    </div>
    <div class="font-bold">Output</div>
    <pre
      class="text-sm overflow-scroll rounded border border-solid dark:border-gray-700 border-gray-200 p-2 h-96 bg-gray-100 dark:bg-gray-900"
      >{{ textOutput }}</pre
    >
    <p>
      You can also play with the parser and the output of the playground in the
      javascript console, with <code>window.parse</code> and
      <code>window.markwhen</code>, respectively.
    </p>
  </div>
</template>

<style scoped></style>
