<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useMeridiemApiSession } from "./meridiemApiSession";

type TryItParam = {
  name: string;
  label?: string;
  placeholder?: string;
  default?: string;
};

const props = withDefaults(
  defineProps<{
    method: string;
    path: string;
    scope: string;
    pathParams?: TryItParam[];
    queryParams?: TryItParam[];
    defaultBody?: string;
  }>(),
  {
    pathParams: () => [],
    queryParams: () => [],
    defaultBody: "",
  },
);

const session = useMeridiemApiSession();
const activeTab = ref<"description" | "try">("description");
const pathValues = ref<Record<string, string>>({});
const queryValues = ref<Record<string, string>>({});
const body = ref(props.defaultBody);
const responseBody = ref("");
const responseStatus = ref("");
const requestState = ref<"idle" | "loading" | "error">("idle");
const requestError = ref("");

const method = computed(() => props.method.toUpperCase());
const canSendBody = computed(() =>
  ["POST", "PUT", "PATCH", "DELETE"].includes(method.value),
);
const isAuthorized = computed(
  () => session.hasAccessToken.value && session.hasScopes(props.scope),
);

const fillDefaults = () => {
  for (const param of props.pathParams) {
    pathValues.value[param.name] = param.default || "";
  }
  for (const param of props.queryParams) {
    queryValues.value[param.name] = param.default || "";
  }
};

const buildPath = () => {
  let nextPath = props.path;
  for (const param of props.pathParams) {
    nextPath = nextPath.replace(
      `:${param.name}`,
      encodeURIComponent(pathValues.value[param.name] || ""),
    );
  }
  return nextPath;
};

const requestUrl = computed(() => {
  const url = new URL(`${session.apiOrigin}${buildPath()}`);
  for (const param of props.queryParams) {
    const value = queryValues.value[param.name];
    if (value) {
      url.searchParams.set(param.name, value);
    }
  }
  return url.toString();
});

const connect = () => session.connect(props.scope);

const sendRequest = async () => {
  requestState.value = "loading";
  requestError.value = "";
  responseBody.value = "";
  responseStatus.value = "";

  try {
    const headers: Record<string, string> = {
      authorization: `Bearer ${session.token.value?.access_token}`,
    };
    const init: RequestInit = {
      method: method.value,
      headers,
    };

    if (canSendBody.value && body.value.trim()) {
      headers["content-type"] = "application/json";
      init.body = body.value;
    }

    const response = await fetch(requestUrl.value, init);
    const text = await response.text();

    responseStatus.value = `${response.status} ${response.statusText}`;
    try {
      responseBody.value = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      responseBody.value = text;
    }
    requestState.value = response.ok ? "idle" : "error";
    if (!response.ok && !responseBody.value) {
      requestError.value = responseStatus.value;
    }
  } catch (error) {
    requestState.value = "error";
    requestError.value = error instanceof Error ? error.message : String(error);
  }
};

onMounted(async () => {
  fillDefaults();
  await session.init();
});
</script>

<template>
  <section
    class="my-6 mb-8 rounded-lg border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)]"
  >
    <div
      class="sticky top-12 md:top-28 lg:top-28 xl:top-16 z-10 flex flex-col gap-4 border-b border-[var(--vp-c-divider)] bg-[var(--vp-c-bg-soft)] p-3 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex min-w-0 items-center gap-2">
        <span
          class="shrink-0 rounded border border-[var(--vp-c-brand-2)] px-1.5 py-0.5 text-xs font-bold text-[var(--vp-c-brand-1)]"
          >{{ method }}</span
        >
        <code class="break-words text-xs">{{ path }}</code>
      </div>
      <div class="flex flex-wrap gap-2 vp-raw">
        <button
          type="button"
          class="cursor-pointer rounded-md px-3 py-1 text-sm"
          :class="activeTab === 'description' ? 'bg-[var(--vp-code-bg)]' : ''"
          @click="activeTab = 'description'"
        >
          Description
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md px-3 py-1 text-sm"
          :class="activeTab === 'try' ? 'bg-[var(--vp-code-bg)]' : ''"
          @click="activeTab = 'try'"
        >
          → Try it
        </button>
      </div>
    </div>

    <div v-show="activeTab === 'description'" class="p-4">
      <slot name="description" />
      <slot />
    </div>

    <div v-show="activeTab === 'try'" class="p-4">
      <div v-if="!isAuthorized" class="grid gap-4">
        <p class="m-0 text-[var(--vp-c-text-2)]">
          This request needs <code>{{ scope }}</code
          >. Authorization is stored for this browser session.
        </p>
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--vp-button-brand-border)] bg-[var(--vp-button-brand-bg)] px-3 py-2 font-semibold text-[var(--vp-button-brand-text)] hover:border-[var(--vp-button-brand-hover-border)] hover:bg-[var(--vp-button-brand-hover-bg)]"
          @click="connect"
        >
          Connect Meridiem
        </button>
        <p
          v-if="session.message.value"
          class="m-0 mt-1 text-[var(--vp-c-text-2)]"
        >
          {{ session.message.value }}
        </p>
      </div>

      <div v-else class="grid gap-4">
        <dl class="m-0 grid gap-2 text-sm">
          <div
            v-if="session.user.value?.email || session.user.value?.name"
            class="grid gap-0.5"
          >
            <dt class="font-bold text-[var(--vp-c-text-2)]">User</dt>
            <dd class="m-0 text-[var(--vp-c-text-1)]">
              {{
                session.user.value?.name ||
                session.user.value?.username ||
                session.user.value?.email
              }}
            </dd>
          </div>
          <div class="grid gap-0.5">
            <dt class="font-bold text-[var(--vp-c-text-2)]">Scope</dt>
            <dd class="m-0 text-[var(--vp-c-text-1)]">{{ scope }}</dd>
          </div>
        </dl>

        <div v-if="pathParams.length" class="grid gap-3">
          <label
            v-for="param in pathParams"
            :key="param.name"
            class="grid gap-1.5"
          >
            <span class="font-bold text-[var(--vp-c-text-2)]">{{
              param.label || param.name
            }}</span>
            <input
              v-model="pathValues[param.name]"
              class="w-full rounded-md border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] px-2.5 py-2 font-[inherit] text-[var(--vp-c-text-1)]"
              :placeholder="param.placeholder"
            />
          </label>
        </div>

        <div v-if="queryParams.length" class="grid gap-3">
          <label
            v-for="param in queryParams"
            :key="param.name"
            class="grid gap-1.5"
          >
            <span class="font-bold text-[var(--vp-c-text-2)]">{{
              param.label || param.name
            }}</span>
            <input
              v-model="queryValues[param.name]"
              class="w-full rounded-md border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] px-2.5 py-2 font-[inherit] text-[var(--vp-c-text-1)]"
              :placeholder="param.placeholder"
            />
          </label>
        </div>

        <label v-if="canSendBody" class="grid gap-1.5">
          <span class="font-bold text-[var(--vp-c-text-2)]">JSON body</span>
          <textarea
            v-model="body"
            class="w-full resize-y rounded-md border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] px-2.5 py-2 font-mono text-[var(--vp-c-text-1)]"
            rows="8"
            spellcheck="false"
          />
        </label>

        <div
          class="grid gap-1.5 rounded-md border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg-soft)] p-3"
        >
          <span class="text-sm font-bold text-[var(--vp-c-text-2)]">{{
            method
          }}</span>
          <code class="break-words text-xs">{{ requestUrl }}</code>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="cursor-pointer rounded-md border border-[var(--vp-button-brand-border)] bg-[var(--vp-button-brand-bg)] px-3 py-2 font-semibold text-[var(--vp-button-brand-text)] hover:border-[var(--vp-button-brand-hover-border)] hover:bg-[var(--vp-button-brand-hover-bg)] disabled:cursor-progress disabled:opacity-70"
            :disabled="requestState === 'loading'"
            @click="sendRequest"
          >
            {{ requestState === "loading" ? "Sending..." : "Send request" }}
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-md border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] px-3 py-2 font-semibold text-[var(--vp-c-text-1)]"
            @click="session.disconnect"
          >
            Disconnect
          </button>
        </div>

        <p v-if="requestError" class="m-0 mt-1 text-[var(--vp-c-danger-1)]">
          {{ requestError }}
        </p>

        <div v-if="responseStatus || responseBody" class="grid gap-2">
          <div class="text-sm font-bold text-[var(--vp-c-text-2)]">
            {{ responseStatus }}
          </div>
          <pre
            v-if="responseBody"
            class="m-0 max-h-[26rem] overflow-auto rounded-md bg-[var(--vp-code-block-bg)] p-3"
          ><code>{{ responseBody }}</code></pre>
        </div>
      </div>
    </div>
  </section>
</template>
