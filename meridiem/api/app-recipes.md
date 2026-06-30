# App Recipes

These recipes are starting points for Meridiem apps. They are intentionally plain: a human can understand them, and a coding agent can turn them into an app without needing to invent the data model from scratch.

Each recipe follows the same pattern:

1. Ask the user to connect Meridiem.
2. Find documents that opt into your app through the header.
3. Read entries or document text.
4. Render a focused interface.
5. Write readable markwhen or markdown back to Meridiem.

## Feed App

Use this for social feeds, status streams, release logs, public journals, or team updates.

### Document shape

```mw
---
feedapp:
  view: "*"
  title: Workshop notes
  avatar: https://example.com/avatar.jpg
timezone: America/Los_Angeles
---

2026-03-01 09:30: Shipped the first prototype
  status: published
  tags: product,prototype

The rough edges are still there, but the loop works.
```

### Store in the header

- Whether the document participates in the feed.
- Display name, avatar, description, and theme.
- Defaults for new posts.

### Store on events

- `status`, such as `draft` or `published`.
- Tags, category, source, or visibility.
- Any app-specific ranking or grouping field.

### Scopes

Start with:

```txt
openid docs.read:*
```

Add `docs.write:*` if the app lets users post, edit, or delete from your UI.

### First API calls

```js
const { docs } = await meridiem("/api/v1/docs");
const feedDocs = docs.filter((doc) => doc.header?.feedapp?.view);
```

```js
const entries = await meridiem(
  `/api/v1/docs/${username}/doc/${docName}/entries`,
  {
    method: "POST",
    body: JSON.stringify({
      property_filter: { status: "published" },
    }),
  }
);
```

## Dashboard App

Use this for project dashboards, lightweight CRMs, operations boards, and team overviews.

### Document shape

```mw
---
dashboard:
  enabled: true
  owner: Maya
  area: Launch
timezone: UTC
---

2026-04-10: Landing page ready
  status: done
  priority: high
  owner: Maya

2026-04-15: Press kit
  status: blocked
  priority: medium
  owner: Chris
```

### Store in the header

- Dashboard membership and display settings.
- Team, project, owner, or account metadata.
- Default filters.

### Store on events

- Status, priority, owner, estimate, customer, amount, stage.
- Dates that matter to the item.
- Links in the description when humans should be able to read them.

### Scopes

```txt
openid docs.read:* docs.write:*
```

### First API calls

List docs, filter on `header.dashboard.enabled`, then read entries. To update a card, append a new event instead of mutating history when possible:

```mw
2026-04-16: Press kit unblocked
  status: active
  priority: medium
  owner: Chris
```

That keeps the document as a useful audit trail.

## Journal App

Use this for field notes, private logs, therapy notes, garden journals, workouts, or research diaries.

### Document shape

```mw
---
journalapp:
  enabled: true
  moodTracking: true
timezone: America/New_York
---

2026-05-02 21:10: Evening check-in
  mood: calm
  energy: low

Walked after dinner. The rain made everything quieter.
```

### Store in the header

- Journal settings and prompts.
- Whether the journal is private or shareable.
- Default timezone.

### Store on events

- Mood, energy, weather, location, category.
- Prompt IDs or source if an agent generated a prompt.

### Scopes

For a read-only reflection app:

```txt
openid docs.read:*
```

For an app that writes check-ins:

```txt
openid docs.read:* docs.write:*
```

### First write

```js
await meridiem(`/api/v1/docs/${username}/doc/${docName}`, {
  method: "PATCH",
  body: JSON.stringify({
    edits: [
      {
        text: "dt{yyyy-MM-dd HH:mm}: Evening check-in\n  mood: calm\n  energy: low\n\nWalked after dinner.",
        timezone: "America/New_York",
      },
    ],
  }),
});
```

## Reminder App

Use this for follow-ups, lightweight task systems, habit nudges, or scheduled prompts.

### Document shape

```mw
---
reminderapp:
  enabled: true
timezone: America/Los_Angeles
---

2026-06-01 09:00: Send renewal note
  remind: true
  channel: email
  status: open
```

### Store in the header

- Notification defaults.
- Quiet hours.
- Preferred channels.

### Store on events

- Whether an entry should trigger a reminder.
- Channel, status, recurrence, or external task ID.

### Scopes

```txt
openid docs.read:* docs.write:*
```

Use [Webhooks](/meridiem/api/webhooks) if your reminder app needs to reschedule when documents change.

### Agent instruction

Tell the agent:

```txt
Find documents where header.reminderapp.enabled is true.
Read entries where properties.remind is true and properties.status is open.
Show upcoming reminders ordered by from_ts.
When a reminder is completed, append a completion event instead of deleting the original.
```

## Publishing App

Use this for blogs, newsletters, changelogs, documentation snippets, and small websites.

### Markwhen for posts

```mw
---
publisher:
  site: rob-notes
  title: Rob's notes
timezone: America/Los_Angeles
---

2026-07-01: Building with Meridiem
  status: published
  slug: building-with-meridiem

The key is keeping the source document pleasant to read.
```

### Markdown for pages

Use markdown documents for pages that are not naturally time-based:

```md
# About

I write about small tools, timelines, and local-first software.
```

### Store in the header

- Site title, author, theme, canonical URL.
- Publishing defaults.

### Store on events

- `status`, `slug`, `summary`, `tags`, `canonical`.
- Per-post image or social metadata.

### Scopes

```txt
openid docs.read:* docs.write:* media.read:* media.write:*
```

Add media scopes only if the app uploads images or video.

## A reusable agent prompt

```txt
Build a Meridiem app from this recipe.

Requirements:
- Use OAuth PKCE.
- Store app settings in header.<appNamespace>.
- Store per-entry metadata as markwhen event properties.
- Use /api/v1/docs to discover documents.
- Use /api/v1/docs/:user/doc/:docName/entries for entry lists.
- Use PATCH /api/v1/docs/:user/doc/:docName with edits when appending.
- Refresh the token and retry once when an API call returns 401 or 405.
- Keep the generated markwhen readable to a person opening the document in Meridiem.
```
