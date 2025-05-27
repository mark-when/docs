<script setup lang="ts">
import ExampleButton from "./ExampleButton.vue";
import { ref, reactive, onMounted, computed, toRaw, watchEffect } from "vue";
import { parse } from "@markwhen/parser";
import ContentEditable from "./ContentEditable.vue";
import { useLpc } from "./viewOrchestrator";

const ex = reactive<Record<string, string>>({
  "Basic Syntax": `2025-04-09: Single date
2025-01-22 / 2026-10-24: Date range

Dec 1 2025: Supports multiple date formats
And longer descriptions
`,
  Groups: `group Part one
2024-12-24: Christmas Eve
2024-12-25: Christmas
endGroup

group Part two
2024-12-31: New Year's Eve
2025-01-01: New Year's Day
endGroup
`,
  Tags: `2025-01-01: New Year's Day #holiday

2024-10-31: Scary time #haloween #holiday`,
  Checklists: `2024:
- [x] lose 70 pounds
- [x] learn to write markwhen
- [] build a house

2025:
- [] gain 20 pounds
- [] go to the moon
- [] find a new place to eat`,
  Links: `2025-01-01: New Year's Day
- [] [Google](https://google.com)
- [] [DuckDuckGo](https://duckduckgo.com)
- [] [Bing](https://bing.com)`,
  Timezones: `timezone: America/New_York

2025-01-01 12:00: New Year's Day`,
  Recurrences: `2025-01-01 every year for 10 years: Copy last year's resolutions to this year

2024-12-24 9am every 60 minutes x12: Check for Santa`,
  Frontmatter: `title: Vacation schedule
description: Things to do on vacation

2025-08-14 / 1 week: Have a good time`,
  Properties: `group Reunion Activities
leader: Jane Smith

2025-09-09: Video call
attendees: [sarah@example.com, igor@example.com]

endGroup`,
});

const exampleSelected = ref<string>("Basic Syntax");

const outputs = ["JSON", "Timeline", "Calendar", "Oneview"];
const outputSelected = ref<string>(outputs[1]);

const parseOutput = computed(() => parse(ex[exampleSelected.value]));
const timelineUrl = `https://timeline.markwhen.com/`;
const calendarUrl = `https://calendar.markwhen.com/`;
const ovUrl = "https://c2-dhz.pages.dev";

const timelineFrame = ref<HTMLIFrameElement>();
const calendarFrame = ref<HTMLIFrameElement>();
const oneviewFrame = ref<HTMLIFrameElement>();
const currentFrame = computed(() => {
  if (outputSelected.value === "Timeline") return timelineFrame.value;
  if (outputSelected.value === "Calendar") return calendarFrame.value;
  if (outputSelected.value === "Oneview") return oneviewFrame.value;
});
let postRequest = (s: string, value: any) => {};

onMounted(() => {
  postRequest = useLpc(currentFrame).postRequest;
  postRequest("markwhenState", toRaw(state.value));
  document.getElementById("timelineFrame")?.addEventListener("load", () => {
    postRequest("markwhenState", toRaw(state.value));
  });
});

const state = computed(() => {
  return {
    rawText: ex[exampleSelected.value],
    parsed: parseOutput.value,
    transformed: parseOutput.value.events,
  };
});
watchEffect(() => {
  let a = currentFrame.value;
  postRequest("markwhenState", toRaw(state.value));
});
</script>

<template>
  <div class="flex gap-1 xl:flex-row flex-col">
    <fieldset
      class="border dark:border-zinc-600 border-zinc-200 p-3 rounded-sm flex flex-col gap-2"
    >
      <legend class="playfair inline-table">
        <span class="px-1 mx-1">Markwhen input</span>
      </legend>
      <div class="flex flex-row gap-2 wrap flex-wrap vp-raw">
        <ExampleButton
          v-for="example in Object.keys(ex)"
          :selected="exampleSelected === example"
          @click="exampleSelected = example"
          >{{ example }}</ExampleButton
        >
      </div>
      <ContentEditable
        class="border border-zinc-200 dark:border-zinc-600"
        v-for="example in Object.keys(ex)"
        v-model="ex[example]"
        v-show="exampleSelected === example"
      ></ContentEditable>
    </fieldset>
    <div class="flex items-center justify-center text-zinc-400">
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
        class="h-4 w-4 xl:rotate-270 mt-2 xl:mt-0"
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </div>
    <fieldset
      class="border dark:border-zinc-600 border-zinc-200 p-3 rounded-sm flex flex-col gap-2"
    >
      <legend class="playfair inline-table">
        <span class="px-1 mx-1">Output</span>
      </legend>
      <div class="flex flex-row gap-2">
        <ExampleButton
          v-for="output in outputs"
          :selected="outputSelected === output"
          @click="outputSelected = output"
          >{{ output }}</ExampleButton
        >
      </div>
      <div
        v-show="outputSelected === 'JSON'"
        class="bg-zinc-50 dark:bg-zinc-700 rounded-sm h-80 font-mono text-xs p-2 whitespace-pre-wrap overflow-scroll border border-zinc-200 dark:border-zinc-600"
      >
        {{ parseOutput }}
      </div>
      <div
        class="bg-zinc-50 rounded-sm h-80 font-mono text-xs p-2 whitespace-pre-wrap overflow-scroll"
        v-show="outputSelected === 'Timeline'"
      >
        <iframe
          ref="timelineFrame"
          id="timelineFrame"
          :src="timelineUrl"
          class="w-full h-full"
        ></iframe>
      </div>
      <div
        class="bg-zinc-50 rounded-sm h-80 font-mono text-xs p-2 whitespace-pre-wrap overflow-scroll"
        v-show="outputSelected === 'Calendar'"
      >
        <iframe
          ref="calendarFrame"
          :src="calendarUrl"
          class="w-full h-full"
        ></iframe>
      </div>
      <div
        class="bg-zinc-50 rounded-sm h-80 font-mono text-xs p-2 whitespace-pre-wrap overflow-scroll"
        v-show="outputSelected === 'Oneview'"
      >
        <iframe ref="oneviewFrame" :src="ovUrl" class="w-full h-full"></iframe>
      </div>
    </fieldset>
  </div>
</template>

<style scoped></style>
