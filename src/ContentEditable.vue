<script setup lang="ts">
import { ref, onMounted } from "vue";

const model = defineModel<string>();
const content = ref<HTMLDivElement>();
onMounted(() => {
  content.value!.textContent = model.value || "";
});
</script>

<template>
  <div
    ref="content"
    contenteditable="true"
    class="bg-zinc-50 rounded-s h-48 font-mono text-sm p-2 whitespace-pre-wrap"
    @input="model = ($event.target as HTMLDivElement).textContent || ''"
  ></div>
</template>

<style scoped></style>
