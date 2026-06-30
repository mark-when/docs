# Build an App Like Remark.ing

[Remark.ing](https://remark.ing) is a good model for what Meridiem apps can do. It lets people write normal markwhen documents in Meridiem, then turns selected entries into a social feed.

You do not have to build a full social network. The pattern is useful for dashboards, journals, CRMs, habit trackers, publishing tools, personal automations, and agent-built apps.

## The basic idea

Remark.ing does four things:

1. Asks the user to connect Meridiem.
2. Reads the user's documents.
3. Looks for documents that opt into Remark.ing through header data.
4. Renders entries as posts and writes new entries back to Meridiem.

That same loop is the foundation for most Meridiem apps:

```txt
connect Meridiem -> choose docs -> read entries -> show useful UI -> write changes back
```

## What lives where

Use markwhen text for the user's timeline-like content:

```mw
---
title: Garden notes
timezone: America/Los_Angeles
garden:
  type: personal-log
  public: false
---

2026-04-03: Planted tomatoes
  variety: sungold
  bed: west

2026-04-10: Added compost
  bed: west
```

Use the header for document-level settings:

```mw
---
title: Garden notes
timezone: America/Los_Angeles
garden:
  public: false
  theme: green
  defaultBed: west
---
```

Use event properties for per-entry data:

```mw
2026-04-03: Planted tomatoes
  variety: sungold
  bed: west
  source: seedling
```

As a rule of thumb:

| Put it in          | When it describes                                      |
| ------------------ | ------------------------------------------------------ |
| Header             | The whole document, app settings, visibility, defaults |
| Event text         | What happened, what the user wants to read             |
| Event properties   | Structured details about one event                     |
| Markdown documents | Long-form pages, documentation, essays, drafts         |
| Markwhen documents | Dated entries, schedules, histories, logs, feeds       |

## Opt in with a header

Remark.ing only shows documents that explicitly opt in:

```mw
---
remarking:
  view: "*"
  description: |
    Notes from my workshop.
---
```

Your app can use the same pattern with your own namespace:

```mw
---
mealplanner:
  view: "*"
  meals:
    - breakfast
    - dinner
---
```

Namespacing keeps your app's settings from colliding with other tools.

## Ask for OAuth access

Start with the smallest scopes that make your app work:

```txt
openid docs.read:*
```

If your app creates or edits documents, ask for write access:

```txt
openid docs.read:* docs.write:*
```

If your app manages uploaded images or video:

```txt
openid docs.read:* docs.write:* media.read:* media.write:*
```

Then send the user through the [OAuth quickstart](/meridiem/api/oauth).

## Read documents

List the documents the user granted to your app:

```js
const { docs } = await fetch("https://meridiem.markwhen.com/api/v1/docs", {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
}).then((r) => r.json());

const remarkingDocs = docs.filter((doc) => doc.header?.remarking?.view);
```

Each document includes a `path` like `rob/notes` and a stable `doc_id`.

## Read entries

For feed-like apps, entries are often easier than raw document text:

```js
const entries = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}/entries`,
  {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      property_filter: {
        status: "published",
      },
    }),
  },
).then((r) => r.json());
```

You can also fetch the full document when your app needs text editing or parsing:

```js
const doc = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  },
).then((r) => r.json());

console.log(doc.text);
console.log(doc.parsed);
```

## Write a new entry

To append a new entry, patch the document:

```js
const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}`,
  {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      edits: [
        {
          text: "dt{yyyy-MM-dd HH:mm}: Published from my app\n  status: published",
          timezone: "America/Los_Angeles",
        },
      ],
    }),
  },
);

const { added } = await result.json();
```

`dt{...}` is replaced on the server using [Luxon](https://moment.github.io/luxon/#/) date formatting.

## Update document settings

Use the header endpoint when your app changes document-level settings:

```js
await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}/header`,
  {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      merge: {
        mealplanner: {
          defaultMeal: "dinner",
        },
      },
    }),
  },
);
```

## Use webhooks for freshness

Polling works for prototypes. For production apps, add a `doc_changed_webhook` URL in your app settings and listen for `doc.changed` events.

See [Webhooks](/meridiem/api/webhooks).

## Agent checklist

If you are asking an agent to build a Meridiem app, give it this checklist:

- Register a Meridiem app and record the app ID.
- Use PKCE unless the token exchange happens on a trusted server.
- Request only the scopes the app needs.
- Store `access_token` and `refresh_token`; refresh on `401` or `405`.
- Use `/api/v1/docs` to discover available documents.
- Use header fields for app-level configuration.
- Use event properties for structured per-entry data.
- Use markwhen for dated logs and markdown for long-form pages.
- Use webhooks when the app should react to document changes.

## A tiny app prompt

You can hand this to a coding agent:

```txt
Build a small Meridiem OAuth app.

It should:
- connect to Meridiem with OAuth PKCE
- request openid and docs.read:*
- list documents from /api/v1/docs
- show documents where header.myapp.enabled is true
- fetch entries for the selected document
- render the entries in reverse chronological order
- refresh the Meridiem token if an API call returns 401 or 405

Use header.myapp for document-level settings and event properties for per-entry metadata.
```
