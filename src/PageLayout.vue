<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #aside-outline-after>
      <a
        class="dark:text-gray-400"
        href="https://discord.gg/3rTpUD94ac"
        style="padding-top: 0.5rem; padding-left: 1rem"
        ><small
          class="flex flex-row items-center transition"
          style="gap: 0.25rem"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            /></svg
          >I need help with this</small
        ></a
      >
    </template>
  </Layout>
</template>

<style scoped></style>
