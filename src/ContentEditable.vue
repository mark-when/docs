<script setup lang="ts">
import { ref, onMounted } from "vue";
import { parseContentEditable } from "./contentEditable";

const model = defineModel<string>();
const content = ref<HTMLDivElement>();
onMounted(() => {
  content.value!.textContent = model.value || "";
});

const input = (e: Event) => {
  const el = e.target as HTMLDivElement;
  model.value = parseContentEditable(el.childNodes);
};
</script>

<template>
  <div
    ref="content"
    contenteditable="true"
    class="bg-zinc-50 dark:bg-zinc-700 rounded-sm h-48 font-mono text-sm p-2 whitespace-pre-wrap"
    @input="input"
  ></div>
</template>

<style scoped></style>
