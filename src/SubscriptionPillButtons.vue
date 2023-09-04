<script setup lang="ts"></script>

<template>
  <div class="p-4 flex flex-col gap-2 rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
    <div class="text-base font-bold flex flex-row items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="1 0 26 26"
        fill="currentColor"
        class="h-4 w-4"
      >
        <path d="M 6 1 A 1 1 90 0 0 6 8 H 6 A 2 2 90 1 0 6 1 H 6 Z"></path>
        <path d="M 6 10 A 2 2 90 0 0 6 16 H 20 A 2 2 90 0 0 20 10 H 6 Z"></path>
        <path
          d="M 15 18 A 2 2 90 1 0 15 24 H 22 A 1 1 0 0 0 22 18 H 15 Z"
        ></path></svg
      ><a href="https://app.markwhen.com">Markwhen.com</a>
      <a
        href="https://app.markwhen.com"
        class="text-sm planPill rounded px-1 dark:text-green-200 bg-green-50 dark:bg-green-900 text-green-800 shadow border-2 border-green-200"
      >
        Personal Plan
      </a>
      or
      <a
        href="https://app.markwhen.com"
        class="text-sm planPill rounded px-1 dark:text-purple-200 bg-purple-50 dark:bg-purple-900 text-purple-800 shadow border-2 border-purple-200"
      >
        Business Plan
      </a>
    </div>
  </div>
</template>

<style scoped>
.dark a {
  color: inherit;
}

a {
  color: inherit;
  font-weight: revert;
  cursor: pointer;
}

a:hover {
  color: revert;
}
</style>
