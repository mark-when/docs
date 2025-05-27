<script setup lang="ts">
defineProps<{
  selected: boolean;
}>();
</script>

<template>
  <button
    class="rounded px-2 border cursor-pointer"
    :class="{
      'border-zinc-800 bg-zinc-600 text-zinc-50 dark:bg-zinc-600 dark:text-zinc-100 dark:border-zinc-500':
        selected,
      'border-zinc-300 bg-zinc-50 text-zinc-900 shadow dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700':
        !selected,
    }"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
