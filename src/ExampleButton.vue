<script setup lang="ts">
defineProps<{
  selected: boolean;
}>();
</script>

<template>
  <button
    class="rounded px-2 border"
    :class="{
      'border-zinc-800 bg-zinc-600 text-zinc-50': selected,
      'border-zinc-300 bg-zinc-50 text-zinc-900 shadow': !selected,
    }"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
