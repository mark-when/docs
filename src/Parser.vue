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
const textOutput = computed(() => JSON.stringify(parse(text.value), null, 2));

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
    <textarea
      class="font-mono border border-solid border-gray-200 p-1 rounded mb-2 text-sm h-48"
      v-model="text"
    ></textarea>
    <pre
      class="text-sm overflow-scroll border border-solid border-gray-200 p-1"
      style="height: 600px"
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
