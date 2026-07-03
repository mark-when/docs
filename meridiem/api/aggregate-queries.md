# Aggregate Queries

Aggregate queries are for apps that need to read across the documents they are allowed to see. They are a good fit for feeds, search, dashboards, publishing jobs, notifications, and cross-document views.

The important idea is simple:

```txt
scopes decide what the app may see
docs narrows what the app asks for
```

If an app has `docs.read:*` or `docs.write:*`, it can read all documents that user granted to the app. If it has document-specific scopes like `docs.read:journal`, it can read only those matching documents. Either way, aggregate endpoints return only authorized rows.

## When to use aggregate queries

Use aggregate queries when your app wants to:

- show a feed from many documents
- find documents that opt into your app through header data
- search or filter entries across documents
- run a background job without first listing and fetching every document
- resolve user-facing document paths into stable `doc_id`s

Use the regular document endpoints when your app is editing one known document, appending entries, or rendering a single document.

## Server-side auth

Aggregate endpoints use app credentials:

```js
const basicAuth = btoa(`${appId}:${appSecret}`);
```

Send them as Basic auth:

```js
headers: {
  authorization: `Basic ${basicAuth}`,
}
```

Keep `app_secret` on your server. Do not put it in browser code, mobile app bundles, or public repositories.

This is different from the main document API, which uses a user OAuth access token:

```js
headers: {
  authorization: `Bearer ${accessToken}`,
}
```

## Scope behavior

Aggregate endpoints check each returned document or entry against the app's authorized scopes.

| Authorized scope | What aggregate queries can return |
| ---------------- | --------------------------------- |
| `docs.read:*` | All readable documents granted by that user |
| `docs.write:*` | All writable documents granted by that user; write implies read |
| `docs.read:{doc}` | That matching document |
| `docs.write:{doc}` | That matching document; write implies read |

The `{doc}` part may be the stable `doc_id` or a user-facing document name/path, depending on how the user granted access.

The optional `docs` request field narrows results:

| `docs` value | Meaning |
| ------------ | ------- |
| omitted or `[]` | Return everything the app is authorized to read |
| `["alice"]` | Return authorized docs owned by `alice` |
| `["alice/journal"]` | Return `alice`'s `journal` doc if authorized |
| `["alice/projects/roadmap"]` | Return a nested document path if authorized |

## Find participating documents

A common app pattern is to ask users to opt documents into your app with header data:

```mw
---
feedapp:
  enabled: true
  title: Workshop notes
timezone: America/Los_Angeles
---

2026-07-01: First public note
  status: published
```

Then query metadata for documents whose header contains that setting:

```js
const basicAuth = btoa(`${appId}:${appSecret}`);

const response = await fetch(
  "https://meridiem.markwhen.com/api/v1/aggregate/metadata",
  {
    method: "POST",
    headers: {
      authorization: `Basic ${basicAuth}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      header_filter: [{ feedapp: { enabled: true } }],
      limit: 50,
    }),
  },
);

const docs = await response.json();
```

Each returned document includes `uid`, `username`, `doc_id`, `header`, `updated_at`, and `doc_path`. Store `doc_id` when you need a stable identity. Use `doc_path` or `canonical_url` for display and links.

## Build a recent entries feed

For feed-style apps, query entries directly:

```js
const response = await fetch(
  "https://meridiem.markwhen.com/api/v1/aggregate/entries",
  {
    method: "POST",
    headers: {
      authorization: `Basic ${basicAuth}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      header_filter: [{ feedapp: { enabled: true } }],
      property_filter: [{ status: "published" }],
      from_ts_gte: "2026-01-01T00:00:00.000Z",
      limit: 20,
    }),
  },
);

const entries = await response.json();
```

Entries include the parsed entry, event properties, tags, the owning document header, `doc_id`, `doc_path`, and a `canonical_url` when Meridiem can build one.

Use `limit` and `offset` for pagination:

```js
body: JSON.stringify({
  limit: 20,
  offset: page * 20,
});
```

## Narrow to a user or document

If your app already knows the owner or document path, pass `docs`:

```js
body: JSON.stringify({
  docs: ["alice"],
  limit: 20,
});
```

or:

```js
body: JSON.stringify({
  docs: ["alice/journal"],
  property_filter: [{ status: "published" }],
});
```

This does not grant access by itself. It only narrows the authorized results.

## Fetch document content

Use the content endpoint when your app needs one whole document:

```js
const params = new URLSearchParams({
  username: "alice",
  doc_path: "journal",
});

const response = await fetch(
  `https://meridiem.markwhen.com/api/v1/aggregate/content?${params}`,
  {
    headers: {
      authorization: `Basic ${basicAuth}`,
    },
  },
);

const doc = await response.json();
```

The response includes `content`, `header`, `doc_type`, `doc_version`, `updated_at`, `doc_id`, and `doc_path`.

## Resolve paths

Document paths can change. If your app stores long-lived references, resolve a user-facing path to stable identity:

```js
const params = new URLSearchParams({
  username: "alice",
  doc_path: "projects/roadmap",
});

const response = await fetch(
  `https://meridiem.markwhen.com/api/v1/aggregate/documents/resolve?${params}`,
  {
    headers: {
      authorization: `Basic ${basicAuth}`,
    },
  },
);

const { uid, doc_id, canonical_doc_path } = await response.json();
```

Later, ask for the current path:

```js
const params = new URLSearchParams({ uid, doc_id });

const response = await fetch(
  `https://meridiem.markwhen.com/api/v1/aggregate/documents/canonical?${params}`,
  {
    headers: {
      authorization: `Basic ${basicAuth}`,
    },
  },
);

const { doc_path } = await response.json();
```

## Practical checklist

- Keep aggregate calls on your server.
- Request the smallest scopes your app needs.
- Treat `docs` as a filter, not an authorization mechanism.
- Store `doc_id` for stable references.
- Use `doc_path` and `canonical_url` for user-facing links.
- Use `header_filter` for document-level opt-in.
- Use `property_filter` for entry-level workflow state.
- Use [webhooks](/meridiem/api/webhooks) when your aggregate view needs to stay fresh.

For exact request and response shapes, see the [API reference](/meridiem/api/api#aggregate-queries).
