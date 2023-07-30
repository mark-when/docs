<script setup lang="ts">
import { parse } from "@markwhen/parser";
import { computed, ref, watch, toRaw, watchEffect, onMounted } from "vue";
import JsonViewer from "vue-json-viewer";

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
    <div class="flex flex-row">
      <div class="flex flex-col w-1/2">
        <div class="font-bold">Input</div>
        <textarea
          class="font-mono border border-solid dark:border-gray-700 border-gray-200 p-2 text-sm h-96 bg-gray-100 dark:bg-gray-900"
          v-model="text"
        ></textarea>
      </div>
      <div class="flex flex-col w-1/2">
        <div class="font-bold">Output</div>
        <JsonViewer :value="parsed"></JsonViewer>
      </div>
    </div>
    <p>
      You can also play with the parser and the output of the playground in the
      javascript console, with <code>window.parse</code> and
      <code>window.markwhen</code>, respectively.
    </p>
  </div>
</template>

<style scoped></style>
