<script setup lang="ts">
import { onMounted } from "vue"

onMounted(() => {
  if (window.remarking)
    window.remarking.scan?.()
})
</script>

# Remarks

Each event in a blog's corresponding markwhen document is a remarking entry (or "remark").

Whenever a cloud markwhen document is edited in Meridiem, it is wholly reparsed, its events sorted chronologically, and each event is given a unique id, [derived primarily from the content of the first line of the event](https://github.com/mark-when/parser/blob/c0e44891b0a65ee483311859ace567fdf8687cb0/src/utilities/urls.ts#L40).

```ts
const disallowedCharacters = /[^A-Za-z0-9_-]/g;
const linkRegex = /(?<preceding>^|\s)\[(?<title>[^\]]*)\]\((?<url>\S+\.\S+)\)/g;
function urlFromString(s: string): string {
  return s
    .trim()
    .replaceAll(linkRegex, (orig, preceding, title) => preceding + title)
    .split(" ")
    .slice(0, 4)
    .map((s) => s.replaceAll(disallowedCharacters, ""))
    .filter((s) => !!s)
    .join("-");
}
```

::: info Why not use user-defined `id`s from [event properties](/syntax/event-descriptions/)?
User-defined `id`s are not necessarily unique. Furthermore this would require users to manually `id` all their events, which would be onerous.
:::

So the following markwhen document would generate two remarks, with ids `A-long-time-ago` and `Hello-world`:

```mw
2025-06-21: A long time ago, in a galaxy far, far away
2023-04-09: Hello world!
```

If this markwhen document was owned by `terry` and the name of the doc was `vacation`, one could refer to a specific entry like `remark.ing/terry/vacation/A-long-time-ago`. This is how Remark.ing works and how remark urls are generated.

## Drafts and Limiting Visibility

A remark may be marked as a draft with a simple addition to its [properties](/syntax/properties):

```mw{2,3}
2028-05-04: Not ready for prime time yet
remarking:
  draft: true
```

If an entry is marked as a draft, it will not show up in yours or others' feeds.

A remark can also be marked as private by setting `remarking.view` to `none`:

```mw{2,3}
2028-05-04: Not ready for prime time yet
remarking:
  view: none
```

A draft remark and a private remark have the same visibility to others (i.e., none at all) but drafts will show up below to the remark compose area.

::: warning Note
Individual remarks' visibility settings have a higher precedence than the document's settings. [Read more about remark visibility](/remarking/visibility).
:::
