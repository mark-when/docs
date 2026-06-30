# OAuth Troubleshooting

Most Meridiem app problems are one of five things:

- The callback URL does not exactly match.
- The authorization code was exchanged with the wrong PKCE verifier or app secret.
- The app has an access token but not the scopes it needs.
- The user can access Meridiem, but not the specific document.
- The app is using a document `doc_id` where the API expects a document name/path, or the other way around.

Start by logging the request URL, response status, and response body from every OAuth and API call. A small amount of boring logging saves a heroic amount of guessing.

## Callback URL mismatch

The `redirect_uri` must match one of the app's registered redirect URIs exactly. Scheme, host, port, path, and trailing slashes all matter.

These are different:

```txt
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback/
http://127.0.0.1:3000/auth/callback
https://localhost:3000/auth/callback
```

The same `redirect_uri` must be used in both places:

1. The `/authorize` URL.
2. The `/oauth/token` authorization-code exchange.

::: code-group

```ts [TypeScript]
const redirectUri = "http://localhost:3000/auth/callback";

const authorizeUrl = new URL("https://meridiem.markwhen.com/authorize");
authorizeUrl.searchParams.set("client_id", appId);
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("redirect_uri", redirectUri);
authorizeUrl.searchParams.set("scope", "openid docs.read:*");
authorizeUrl.searchParams.set("state", state);

// Later, in the callback:
await fetch("https://meridiem.markwhen.com/oauth/token", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    grant_type: "authorization_code",
    client_id: appId,
    redirect_uri: redirectUri,
    code,
    code_verifier: codeVerifier,
  }),
});
```

```python [Python]
redirect_uri = "http://localhost:3000/auth/callback"

token_response = requests.post(
    "https://meridiem.markwhen.com/oauth/token",
    json={
        "grant_type": "authorization_code",
        "client_id": app_id,
        "redirect_uri": redirect_uri,
        "code": code,
        "code_verifier": code_verifier,
    },
    timeout=20,
)
```

:::

## State mismatch

Use `state` to connect the callback to the login attempt you started. Generate it before redirecting to Meridiem, store it in a session or local storage, and compare it when the user returns.

```ts
const expectedState = sessionStorage.getItem("meridiem_oauth_state");
const callbackUrl = new URL(window.location.href);
const returnedState = callbackUrl.searchParams.get("state");

if (!expectedState || returnedState !== expectedState) {
  throw new Error("OAuth state mismatch");
}
```

If state does not match, do not exchange the code.

## PKCE problems

PKCE has two values:

| Value | Sent when | Meaning |
| ----- | --------- | ------- |
| `code_challenge` | `/authorize` | A transformed version of the verifier |
| `code_verifier` | `/oauth/token` | The original secret string |

For `S256`, the challenge is:

```txt
base64url(sha256(code_verifier))
```

::: code-group

```ts [TypeScript]
function base64Url(bytes: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function createPkce() {
  const verifierBytes = crypto.getRandomValues(new Uint8Array(32));
  const codeVerifier = base64Url(verifierBytes);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier)
  );

  return {
    codeVerifier,
    codeChallenge: base64Url(digest),
    codeChallengeMethod: "S256",
  };
}
```

```js [Node.js]
import crypto from "node:crypto";

const codeVerifier = crypto.randomBytes(32).toString("base64url");
const codeChallenge = crypto
  .createHash("sha256")
  .update(codeVerifier)
  .digest("base64url");
```

```python [Python]
import base64
import hashlib
import secrets

def b64url(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")

code_verifier = b64url(secrets.token_bytes(32))
code_challenge = b64url(hashlib.sha256(code_verifier.encode("ascii")).digest())
```

:::

Common PKCE mistakes:

- Sending `code_challenge` again during the token exchange instead of `code_verifier`.
- Recomputing a new verifier in the callback instead of storing the original verifier.
- Adding `=` padding to the base64url value.
- Sending `code_challenge_method=plain` when the challenge was created with `S256`.

## Token exchange examples

::: code-group

```ts [TypeScript]
type MeridiemTokenResponse = {
  access_token: string;
  refresh_token: string;
  exp: string;
  scopes: string[];
  token_type: "Bearer";
  id_token?: string;
};

export async function exchangeCode(params: {
  appId: string;
  code: string;
  redirectUri: string;
  codeVerifier: string;
}) {
  const response = await fetch("https://meridiem.markwhen.com/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: params.appId,
      redirect_uri: params.redirectUri,
      code: params.code,
      code_verifier: params.codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as MeridiemTokenResponse;
}
```

```js [JavaScript]
async function exchangeCode({ appId, code, redirectUri, codeVerifier }) {
  const response = await fetch("https://meridiem.markwhen.com/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: appId,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
```

```python [Python]
import requests

def exchange_code(app_id, code, redirect_uri, code_verifier):
    response = requests.post(
        "https://meridiem.markwhen.com/oauth/token",
        json={
            "grant_type": "authorization_code",
            "client_id": app_id,
            "redirect_uri": redirect_uri,
            "code": code,
            "code_verifier": code_verifier,
        },
        timeout=20,
    )
    response.raise_for_status()
    return response.json()
```

```java [Java]
HttpClient client = HttpClient.newHttpClient();

String body = """
{
  "grant_type": "authorization_code",
  "client_id": "%s",
  "redirect_uri": "%s",
  "code": "%s",
  "code_verifier": "%s"
}
""".formatted(appId, redirectUri, code, codeVerifier);

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://meridiem.markwhen.com/oauth/token"))
    .header("content-type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());

if (response.statusCode() < 200 || response.statusCode() >= 300) {
    throw new RuntimeException(response.body());
}
```

:::

## Refresh and retry once

When an API request returns `401` or `405`, refresh the access token and retry the original request once.

::: code-group

```ts [TypeScript]
async function refreshMeridiemToken(refreshToken: string) {
  const response = await fetch("https://meridiem.markwhen.com/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

async function meridiemFetch(path: string, options: RequestInit = {}) {
  let response = await fetch(`https://meridiem.markwhen.com${path}`, {
    ...options,
    headers: {
      ...options.headers,
      authorization: `Bearer ${tokens.access_token}`,
    },
  });

  if (response.status === 401 || response.status === 405) {
    tokens = await refreshMeridiemToken(tokens.refresh_token);
    response = await fetch(`https://meridiem.markwhen.com${path}`, {
      ...options,
      headers: {
        ...options.headers,
        authorization: `Bearer ${tokens.access_token}`,
      },
    });
  }

  return response;
}
```

```python [Python]
def refresh_meridiem_token(refresh_token):
    response = requests.post(
        "https://meridiem.markwhen.com/oauth/token",
        json={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        },
        timeout=20,
    )
    response.raise_for_status()
    return response.json()
```

:::

Always store the new `refresh_token` returned by the refresh call. Refresh tokens rotate.

## Status codes

| Status | Usually means |
| ------ | ------------- |
| `400` | Missing parameter, unsupported response type, invalid PKCE verifier, expired/reused authorization code, or redirect URI mismatch |
| `401` | Missing token, missing email claim, expired refresh token, or not enough write permission in some endpoints |
| `403` | Token exists but app/user is not allowed to perform the action |
| `405` | Access token is expired and should be refreshed |
| `406` | Version mismatch while writing a document |
| `409` | Creating a document that already exists |

When debugging, log the response body too. Meridiem often includes an `error` or `error_description`.

## Scope and document access checklist

If your app can list documents but cannot read or write one document, check these in order:

1. Did the user grant `docs.read:*`, `docs.write:*`, or the document-specific scope?
2. Are you using the document name/path in the URL?
3. Does the document still exist under that user?
4. Is the current user the owner, an editor, or a viewer for that document?
5. For writes, does the user have edit access, not just view access?

Remember that OAuth scopes and document sharing are both enforced. The app needs permission, and the user needs access.

## Document path vs doc_id

The document API URL uses the user-facing document name/path:

```txt
/api/v1/docs/:user/doc/:docName
```

List documents first and keep both values:

```ts
const { docs } = await meridiemFetch("/api/v1/docs").then((r) => r.json());

for (const doc of docs) {
  console.log(doc.path); // username/docName
  console.log(doc.doc_id); // immutable storage identity
}
```

Use `doc.path` when building user-facing links. Use `doc_id` when you need stable identity across renames.

## Supabase or OIDC integrations

If your auth provider supports generic OIDC, configure Meridiem as the provider:

| Setting | Value |
| ------- | ----- |
| Authorization URL | `https://meridiem.markwhen.com/authorize` |
| Token URL | `https://meridiem.markwhen.com/oauth/token` |
| Userinfo URL | `https://meridiem.markwhen.com/oauth/userinfo` |
| Scopes | `openid docs.read:*` or the scopes your app needs |

Remark.ing uses this style of integration: it asks Supabase to start OAuth, redirects through Meridiem, stores the returned provider tokens, and refreshes Meridiem tokens when API calls expire.

## Agent debugging prompt

```txt
Debug this Meridiem OAuth integration.

Check:
- The registered redirect URI exactly matches the authorize and token exchange redirect_uri.
- The state value is generated before authorization and verified on callback.
- The code_verifier is the original verifier for the code_challenge sent to /authorize.
- The authorization code is exchanged only once.
- The app stores the newest access_token and refresh_token.
- API calls retry once after refreshing on 401 or 405.
- The requested scopes include the operation being attempted.
- The document URL uses :user/doc/:docName, not an arbitrary doc_id unless that is also the document path.
- The user has document-level view or edit access.

Return the failing request, response status, response body, likely cause, and smallest code change.
```

