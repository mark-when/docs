import { computed, ref } from "vue";

const APP_ID = "app_qlE6522iglBNXMg";
const API_ORIGIN = "https://meridiem.markwhen.com";
const AUTH_URL = `${API_ORIGIN}/authorize`;
const TOKEN_URL = `${API_ORIGIN}/oauth/token`;
const STORAGE_PREFIX = "markwhen.docs.meridiemApi.";

export type MeridiemTokenResponse = {
  access_token: string;
  refresh_token?: string;
  exp?: string;
  scopes?: string[];
  token_type?: string;
};

export type MeridiemUserResponse = {
  email?: string;
  username?: string;
  name?: string;
};

const token = ref<MeridiemTokenResponse | null>(null);
const user = ref<MeridiemUserResponse | null>(null);
const status = ref<"idle" | "loading" | "connected" | "error">("idle");
const message = ref("");
let callbackPromise: Promise<void> | null = null;

const storageKey = (key: string) => `${STORAGE_PREFIX}${key}`;

const getRedirectUri = () =>
  typeof window === "undefined"
    ? ""
    : `${window.location.origin}/meridiem/api/api`;

const bytesToBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const randomBase64Url = (length: number) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
};

const sha256Base64Url = async (value: string) => {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return bytesToBase64Url(new Uint8Array(hash));
};

const getErrorText = async (response: Response) => {
  const text = await response.text();
  if (!text) return `${response.status} ${response.statusText}`;

  try {
    const json = JSON.parse(text);
    return json.error_description || json.error || text;
  } catch {
    return text;
  }
};

const normalizeScopes = (scopes: string | string[]) =>
  (Array.isArray(scopes) ? scopes : scopes.split(" "))
    .map((scope) => scope.trim())
    .filter(Boolean);

const scopesForAuthorizeUrl = (scopes: string | string[]) => {
  const set = new Set(["openid", ...normalizeScopes(scopes)]);
  return [...set].join(" ");
};

const saveToken = (nextToken: MeridiemTokenResponse) => {
  token.value = nextToken;
  sessionStorage.setItem(storageKey("token"), JSON.stringify(nextToken));
};

const clearCallbackParams = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  url.searchParams.delete("error");
  url.searchParams.delete("error_description");
  window.history.replaceState({}, document.title, url.toString());
};

const loadStoredToken = () => {
  if (typeof window === "undefined") return;

  const raw = sessionStorage.getItem(storageKey("token"));
  if (!raw) return;

  try {
    token.value = JSON.parse(raw);
    status.value = "connected";
  } catch {
    sessionStorage.removeItem(storageKey("token"));
  }
};

const loadUser = async () => {
  if (!token.value?.access_token) return;

  const response = await fetch(`${API_ORIGIN}/api/v1/user`, {
    headers: {
      authorization: `Bearer ${token.value.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorText(response));
  }

  user.value = await response.json();
};

const exchangeCode = async (code: string) => {
  const verifier = sessionStorage.getItem(storageKey("verifier"));
  const expectedState = sessionStorage.getItem(storageKey("state"));
  const actualState = new URL(window.location.href).searchParams.get("state");

  if (!verifier || !expectedState || expectedState !== actualState) {
    throw new Error("OAuth state did not match this browser session.");
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: APP_ID,
      redirect_uri: getRedirectUri(),
      code,
      code_verifier: verifier,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorText(response));
  }

  saveToken(await response.json());
  sessionStorage.removeItem(storageKey("verifier"));
  sessionStorage.removeItem(storageKey("state"));
};

const handleCallback = async () => {
  if (typeof window === "undefined") return;

  loadStoredToken();

  const params = new URL(window.location.href).searchParams;
  const code = params.get("code");
  const oauthError = params.get("error");

  if (oauthError) {
    status.value = "error";
    message.value =
      params.get("error_description") || `Authorization failed: ${oauthError}`;
    clearCallbackParams();
    return;
  }

  if (!code) return;

  status.value = "loading";
  message.value = "Finishing the Meridiem connection...";

  try {
    await exchangeCode(code);
    await loadUser();
    status.value = "connected";
    message.value = "Connected.";
  } catch (error) {
    status.value = "error";
    message.value = error instanceof Error ? error.message : String(error);
  } finally {
    clearCallbackParams();
  }
};

export const useMeridiemApiSession = () => {
  const hasAccessToken = computed(() => Boolean(token.value?.access_token));
  const grantedScopes = computed(() => token.value?.scopes || []);

  const init = async () => {
    callbackPromise ||= handleCallback();
    await callbackPromise;
  };

  const hasScopes = (scopes: string | string[]) => {
    const requestedScopes = normalizeScopes(scopes);
    return requestedScopes.every((scope) => grantedScopes.value.includes(scope));
  };

  const connect = async (scopes: string | string[]) => {
    status.value = "loading";
    message.value = "Opening Meridiem authorization...";

    const verifier = randomBase64Url(64);
    const state = randomBase64Url(32);
    const challenge = await sha256Base64Url(verifier);
    const url = new URL(AUTH_URL);

    sessionStorage.setItem(storageKey("verifier"), verifier);
    sessionStorage.setItem(storageKey("state"), state);

    url.searchParams.set("client_id", APP_ID);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", getRedirectUri());
    url.searchParams.set("scope", scopesForAuthorizeUrl(scopes));
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge", challenge);
    url.searchParams.set("code_challenge_method", "S256");

    window.location.href = url.toString();
  };

  const disconnect = () => {
    token.value = null;
    user.value = null;
    status.value = "idle";
    message.value = "";
    sessionStorage.removeItem(storageKey("token"));
    sessionStorage.removeItem(storageKey("verifier"));
    sessionStorage.removeItem(storageKey("state"));
  };

  return {
    apiOrigin: API_ORIGIN,
    connect,
    disconnect,
    grantedScopes,
    hasAccessToken,
    hasScopes,
    init,
    message,
    redirectUri: computed(getRedirectUri),
    status,
    token,
    user,
  };
};
