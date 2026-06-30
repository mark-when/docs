# Schema Guide

Meridiem apps work best when the source documents stay pleasant to read. A good schema should help your app without turning a markwhen document into a database dump.

Use this guide when deciding what belongs in the header, what belongs on an event, and what should remain plain prose.

## The short version

| Put data here | When it describes |
| ------------- | ----------------- |
| Header | The whole document, app settings, defaults, display metadata |
| Event properties | One dated entry, task, post, update, observation, or record |
| Event description | Human-readable detail about that entry |
| Markdown document | A long-form page, essay, note, or reference that is not naturally event-shaped |
| External system | Large binary data, private secrets, high-volume logs, or data users should not edit directly |

If a human opens the document in Meridiem, they should be able to understand what your app is doing.

## Namespacing

Put app-specific header data under a namespace. Use a short lowercase key that belongs to your app.

```mw
---
mealplanner:
  enabled: true
  defaultMeal: dinner
  shoppingList: true
timezone: America/Los_Angeles
---
```

Do not put lots of unrelated top-level keys in the header:

```mw
---
enabled: true
defaultMeal: dinner
shoppingList: true
---
```

Namespacing makes it possible for multiple apps to use the same document.

## Header fields

Header fields are best for document-level state:

```mw
---
publisher:
  site: rob-notes
  title: Rob's notes
  theme: simple
  defaultStatus: draft
timezone: America/Los_Angeles
---
```

Good header fields:

- Are stable across many entries.
- Describe how your app should treat the whole document.
- Are safe for users to edit by hand.
- Have clear defaults when missing.

Use header fields for:

- App opt-in: `enabled`, `view`, `sync`.
- Display: `title`, `description`, `avatar`, `theme`.
- Defaults: `defaultStatus`, `defaultProject`, `timezone`.
- Integrations: `webhookEnabled`, `externalProjectId`.

## Event properties

Event properties are best for structured data about one entry:

```mw
2026-08-04: Call with Acme
  type: call
  account: acme
  sentiment: positive
  next: send proposal

They want a smaller pilot before committing to the annual plan.
```

Good event properties:

- Use simple names.
- Are consistent across entries.
- Are useful for filtering, sorting, grouping, or rendering.
- Do not duplicate the entire event description.

Use event properties for:

- Status: `draft`, `published`, `open`, `done`.
- Category: `type`, `project`, `area`, `kind`.
- Ownership: `owner`, `assignee`, `account`.
- App behavior: `remind`, `channel`, `pinned`.
- Display hints: `image`, `slug`, `summary`.

## Event descriptions

Use the description for detail meant to be read by a person:

```mw
2026-08-04: Call with Acme
  type: call
  account: acme

They asked for a smaller pilot. Follow up with a one-page proposal and pricing for 20 seats.
```

Descriptions are the right place for context, notes, links, paragraphs, and messy human nuance. If your app turns every sentence into a property, the document gets hard to write.

## Markdown or markwhen?

Use markwhen when dates are central:

```mw
2026-09-01: Draft published
  status: published
  slug: launch-notes
```

Use markdown when the document is a page:

```md
# Launch notes

This page explains what changed, why it matters, and where to start.
```

A publishing app might use both:

- Markwhen for posts, changelog entries, and scheduled drafts.
- Markdown for about pages, documentation pages, and evergreen essays.

## Stable names

Pick property names that you can live with.

Prefer:

```mw
2026-10-01: Send renewal note
  status: open
  priority: high
  owner: Maya
```

Avoid:

```mw
2026-10-01: Send renewal note
  Status: Open
  p: 1
  assigned_to_user_visible_display_name: Maya
```

Rules of thumb:

- Use lowercase property names.
- Prefer short words over abbreviations.
- Use the same value vocabulary everywhere.
- Avoid renaming fields casually.
- Treat user-written documents as long-lived data.

## Public and private fields

Assume users may read and edit their documents directly. Do not store app secrets in the header or event properties.

Good:

```mw
---
publisher:
  site: rob-notes
  sync: true
---
```

Bad:

```mw
---
publisher:
  apiSecret: sec_...
---
```

If your app needs secrets, store them in your own backend.

## Generated fields

Sometimes an app needs IDs or generated metadata. Keep those fields obvious and minimal:

```mw
2026-11-12: Contract signed
  account: acme
  appId: deal_123
```

Generated fields should not dominate the document. If you need a large generated payload, store it elsewhere and keep only a readable reference in markwhen.

## Evolving a schema

Schemas change. Plan for it.

Start with versioned header metadata:

```mw
---
crm:
  enabled: true
  schemaVersion: 1
---
```

When your app reads older documents, migrate gently:

::: code-group

```ts [TypeScript]
type CrmHeader = {
  enabled?: boolean;
  schemaVersion?: number;
  owner?: string;
};

function normalizeCrmHeader(header: { crm?: CrmHeader }) {
  const crm = header.crm || {};
  return {
    enabled: crm.enabled === true,
    schemaVersion: crm.schemaVersion || 1,
    owner: crm.owner || "unassigned",
  };
}
```

```python [Python]
def normalize_crm_header(header):
    crm = header.get("crm") or {}
    return {
        "enabled": crm.get("enabled") is True,
        "schemaVersion": crm.get("schemaVersion") or 1,
        "owner": crm.get("owner") or "unassigned",
    }
```

```java [Java]
record CrmSettings(boolean enabled, int schemaVersion, String owner) {}

CrmSettings normalizeCrmHeader(Map<String, Object> header) {
    Map<String, Object> crm = (Map<String, Object>) header.getOrDefault(
        "crm",
        Map.of()
    );

    return new CrmSettings(
        Boolean.TRUE.equals(crm.get("enabled")),
        crm.get("schemaVersion") instanceof Number n ? n.intValue() : 1,
        crm.get("owner") instanceof String owner ? owner : "unassigned"
    );
}
```

:::

When possible, support old field names for a while instead of breaking users immediately.

## Reading properties

The entries endpoint returns structured entry rows. Your app can filter by properties on the server:

::: code-group

```ts [TypeScript]
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
  }
).then((response) => response.json());
```

```js [JavaScript]
const entries = await meridiemFetch(
  `/api/v1/docs/${username}/doc/${docName}/entries`,
  {
    method: "POST",
    body: JSON.stringify({
      property_filter: { status: "published" },
    }),
  }
);
```

```python [Python]
entries = requests.post(
    f"https://meridiem.markwhen.com/api/v1/docs/{username}/doc/{doc_name}/entries",
    headers={"authorization": f"Bearer {access_token}"},
    json={"property_filter": {"status": "published"}},
    timeout=20,
).json()
```

:::

## Updating header fields

Use the header endpoint when changing document-level app settings:

::: code-group

```ts [TypeScript]
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
        publisher: {
          defaultStatus: "published",
        },
      },
    }),
  }
);
```

```python [Python]
requests.patch(
    f"https://meridiem.markwhen.com/api/v1/docs/{username}/doc/{doc_name}/header",
    headers={"authorization": f"Bearer {access_token}"},
    json={
        "merge": {
            "publisher": {
                "defaultStatus": "published",
            }
        }
    },
    timeout=20,
)
```

:::

Prefer `merge` for app settings. Use `set` only when replacing a value is definitely what the user expects.

## What not to do

Avoid giant JSON blobs:

```mw
2026-12-01: Imported item
  payload: {"very":"large","deeply":{"nested":"object"}}
```

Avoid unreadable encoded state:

```mw
2026-12-01: Imported item
  state: eyJ2ZXJ5IjoibGFyZ2UifQ
```

Avoid making every user-visible word generated and fragile:

```mw
2026-12-01: {{generated_title_123}}
  renderMode: card_v4_final
```

Better:

```mw
2026-12-01: Imported invoice from Acme
  source: acme
  externalId: inv_123
  status: pending
```

## App schema examples

### Feed

```mw
---
feedapp:
  enabled: true
  title: Workshop notes
  description: Notes from the bench
---

2026-03-01: Shipped the prototype
  status: published
  tags: product,prototype
```

### CRM

```mw
---
crm:
  account: acme
  owner: Maya
  stage: pilot
---

2026-04-12: Follow-up call
  type: call
  sentiment: positive
  next: send proposal
```

### Journal

```mw
---
journal:
  enabled: true
  prompts: evening
---

2026-05-02 21:10: Evening check-in
  mood: calm
  energy: low
```

### Publishing

```mw
---
publisher:
  site: rob-notes
  defaultStatus: draft
---

2026-07-01: Building with Meridiem
  status: published
  slug: building-with-meridiem
```

## Agent schema prompt

```txt
Design a Meridiem schema for this app.

Return:
- The app namespace to use in the document header.
- Header fields, their types, defaults, and whether users can edit them.
- Event properties, their allowed values, and examples.
- Which data should be human prose in event descriptions.
- Which data should be markdown documents instead of markwhen events.
- What data should not be stored in Meridiem.
- A migration plan with schemaVersion.
- Three example markwhen documents using the schema.

Keep the generated markwhen readable to a person editing it directly.
```

