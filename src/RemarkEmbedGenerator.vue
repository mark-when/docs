<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const BASE_URL = "https://remark.ing";
const SCRIPT_SNIPPET =
  '<script async src="https://embed.remark.ing/static/embed.js" charset="utf-8"></scr' +
  "ipt>";

declare global {
  interface Window {
    remarking?: {
      scan?: (node?: Element) => void;
    };
  }
}
const inputValue = ref("https://remark.ing/markwhen/markwhen");
const mode = ref<"latest" | "feed">("latest");
const theme = ref<"system" | "light" | "dark">("system");
const background = ref("");
const previewContainer = ref<HTMLElement | null>(null);
const copyState = ref<"idle" | "copied">("idle");
let copyTimeout: ReturnType<typeof setTimeout> | undefined;

type ParsedInput = {
  path: string;
  error: string;
};

const parsed = computed<ParsedInput>(() => {
  const trimmed = inputValue.value.trim();
  if (!trimmed) {
    return { path: "", error: "" };
  }

  try {
    const url = new URL(trimmed, BASE_URL);
    if (!url.hostname.endsWith("remark.ing")) {
      return {
        path: "",
        error: "Use a remark.ing link or path.",
      };
    }
    return {
      path: `${url.pathname}${url.search}` || "/",
      error: "",
    };
  } catch (error) {
    if (trimmed.startsWith("/")) {
      return { path: trimmed, error: "" };
    }
    return {
      path: "",
      error: "Use a remark.ing link or path.",
    };
  }
});

const normalizedBackground = computed(() => {
  const trimmed = background.value.trim();
  if (!trimmed) {
    return "";
  }
  const hex = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  if (!/^[0-9a-fA-F]{3,8}$/.test(hex)) {
    return "";
  }
  return `#${hex}`;
});

const backgroundError = computed(() => {
  if (!background.value.trim()) {
    return "";
  }
  if (!normalizedBackground.value) {
    return "Use a hex color like #ffffff, #fff, or ffffff.";
  }
  return "";
});

const dataUri = computed(() => {
  if (!parsed.value.path) {
    return "";
  }
  const url = new URL(parsed.value.path, BASE_URL);
  if (mode.value === "feed") {
    url.searchParams.set("feed", "1");
  } else {
    url.searchParams.delete("feed");
  }
  if (theme.value === "system") {
    url.searchParams.delete("theme");
  } else {
    url.searchParams.set("theme", theme.value);
  }
  const backgroundValue = normalizedBackground.value;
  if (backgroundValue) {
    url.searchParams.set("background", backgroundValue);
  } else {
    url.searchParams.delete("background");
  }
  const pathname = url.pathname || "/";
  const search = url.search;
  return `${pathname}${search}`;
});

const embedSnippet = computed(() => {
  if (!dataUri.value) {
    return `<blockquote data-remarking-uri="/\${username}/\${doc_id}"></blockquote>\n${SCRIPT_SNIPPET}`;
  }
  return `<blockquote data-remarking-uri="${dataUri.value}"></blockquote>\n${SCRIPT_SNIPPET}`;
});

const hasError = computed(() => Boolean(parsed.value.error));
const errorMessage = computed(() => parsed.value.error);

const refreshEmbed = async () => {
  if (!previewContainer.value || !dataUri.value) {
    return;
  }
  await nextTick();
  window.remarking?.scan?.(previewContainer.value);
};

watch([dataUri], () => {
  refreshEmbed();
});

onMounted(() => {
  refreshEmbed();
});

const copyToClipboard = async () => {
  if (!navigator?.clipboard) {
    return;
  }
  try {
    await navigator.clipboard.writeText(embedSnippet.value);
    copyState.value = "copied";
    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }
    copyTimeout = setTimeout(() => {
      copyState.value = "idle";
    }, 2000);
  } catch (error) {
    // clipboard might be unavailable; ignore for now
  }
};

const previewKey = computed(() => (dataUri.value ? `${dataUri.value}` : "empty"));

onBeforeUnmount(() => {
  if (copyTimeout) {
    clearTimeout(copyTimeout);
  }
});
</script>

<template>
  <div
    class="embed-generator mt-8 flex flex-col gap-6 rounded-lg border border-stone-200 bg-white/60 p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900/60"
  >
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-stone-700 dark:text-stone-200"
        >Remark.ing URL or path</label
      >
      <input
        v-model="inputValue"
        type="text"
        placeholder="https://remark.ing/username/doc"
        class="w-full rounded-md border border-stone-300 bg-gray-100 px-4 py-2 text-sm text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400/40 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-50"
      />
      <p class="text-xs text-stone-500 dark:text-stone-400">
        Paste a remark.ing link like <code>https://remark.ing/markwhen/markwhen</code>
        or a path such as <code>/markwhen/markwhen</code>.
      </p>
      <p v-if="hasError" class="text-xs text-red-600 dark:text-red-400">
        {{ errorMessage }}
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium text-stone-700 dark:text-stone-200"
        >Mode</span
      >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          class="flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-700 shadow-sm transition hover:border-stone-400 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-500"
        >
          <input
            type="radio"
            value="latest"
            v-model="mode"
            class="h-4 w-4 border-stone-300 text-stone-600 focus:ring-stone-500 dark:border-stone-500"
          />
          <span>Latest remark only</span>
        </label>
        <label
          class="flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-700 shadow-sm transition hover:border-stone-400 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-500"
        >
          <input
            type="radio"
            value="feed"
            v-model="mode"
            class="h-4 w-4 border-stone-300 text-stone-600 focus:ring-stone-500 dark:border-stone-500"
          />
          <span>Full feed (with pagination)</span>
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium text-stone-700 dark:text-stone-200"
        >Theme</span
      >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          class="flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-700 shadow-sm transition hover:border-stone-400 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-500"
        >
          <input
            type="radio"
            value="system"
            v-model="theme"
            class="h-4 w-4 border-stone-300 text-stone-600 focus:ring-stone-500 dark:border-stone-500"
          />
          <span>Match viewer</span>
        </label>
        <label
          class="flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-700 shadow-sm transition hover:border-stone-400 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-500"
        >
          <input
            type="radio"
            value="light"
            v-model="theme"
            class="h-4 w-4 border-stone-300 text-stone-600 focus:ring-stone-500 dark:border-stone-500"
          />
          <span>Light</span>
        </label>
        <label
          class="flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-700 shadow-sm transition hover:border-stone-400 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-500"
        >
          <input
            type="radio"
            value="dark"
            v-model="theme"
            class="h-4 w-4 border-stone-300 text-stone-600 focus:ring-stone-500 dark:border-stone-500"
          />
          <span>Dark</span>
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium text-stone-700 dark:text-stone-200"
        >Background color</span
      >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          v-model="background"
          type="text"
          placeholder="#ffffff"
          class="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400/40 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-50"
        />
      </div>
      <p class="text-xs text-stone-500 dark:text-stone-400">
        Optional hex color for the iframe background. Supports short and long hex like
        <code>#fff</code>, <code>#ffffff</code>, or <code>ffffffdd</code> for transparency.
      </p>
      <p v-if="backgroundError" class="text-xs text-red-600 dark:text-red-400">
        {{ backgroundError }}
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-stone-700 dark:text-stone-200"
          >Embed snippet</span
        >
        <button
          type="button"
          class="rounded-md border border-stone-300 px-2 py-1 text-xs font-medium text-stone-600 transition hover:border-stone-400 hover:text-stone-800 dark:border-stone-600 dark:text-stone-300 dark:hover:border-stone-500 dark:hover:text-stone-100"
          @click="copyToClipboard"
        >
          <span v-if="copyState === 'copied'">Copied!</span>
          <span v-else>Copy</span>
        </button>
      </div>
      <pre
        class="overflow-x-auto rounded-md border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
      ><code>{{ embedSnippet }}</code></pre>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium text-stone-700 dark:text-stone-200"
        >Live preview</span
      >
      <div
        ref="previewContainer"
        class="overflow-hidden rounded-md border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-900"
      >
        <div v-if="dataUri" :key="previewKey" class="w-full">
          <blockquote :data-remarking-uri="dataUri"></blockquote>
        </div>
        <p v-else class="text-sm text-stone-500 dark:text-stone-400">
          Enter a remark.ing URL to see the embedded preview.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.embed-generator {
  backdrop-filter: blur(2px);
}
</style>
