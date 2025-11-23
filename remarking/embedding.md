<script setup lang="ts">
import { onMounted } from "vue"
import RemarkEmbedGenerator from "../src/RemarkEmbedGenerator.vue"

onMounted(() => {
  if (window.remarking) {
    window.remarking.scan?.()
  }
})
</script>

# Embedding

Remarks can be embedded by copying the below code and replacing the parameters with the remark you want to embed, then adding the code snippet to your site's `HTML`:

```html
<blockquote
  data-remarking-uri="/${username}/${doc_id}/${remark_id}"
></blockquote>
<script
  async
  src="https://embed.remark.ing/static/embed.js"
  charset="utf-8"
></script>
```

`username` is not optional, but `doc_id` and `remark_id` are. By just providing `username`, you'll be grabbing the latest remark across all of that person's blogs; if you provide both `username` and `doc_id`, you'll get the latest of that blog. By providing all three you'll get that specific remark.

To embed a full feed instead of only the latest remark, append `?feed=1` to the `data-remarking-uri`. This works for both user feeds (`/${username}`) and individual blogs (`/${username}/${doc_id}`).

```html
<blockquote data-remarking-uri="/${username}/${doc_id}?feed=1"></blockquote>
<script
  async
  src="https://embed.remark.ing/static/embed.js"
  charset="utf-8"
></script>
```

The embedded feed paginates automatically when there are more than 20 remarks, and navigation links are included within the iframe.

For example, this code snippet:

```html
<blockquote data-remarking-uri="/markwhen/markwhen"></blockquote>
<script
  async
  src="https://embed.remark.ing/static/embed.js"
  charset="utf-8"
></script>
```

Results in an inline element that looks like this:

<blockquote data-remarking-uri="/markwhen/markwhen"></blockquote>

::: tip Note
Only public blogs or remarks are embeddable.
:::

## Generator

Use the generator below to build an embed snippet for any publicly visible remark or feed. Paste a remark.ing URL or path, choose whether you want the latest remark or the full feed, then copy the generated HTML into your site.

<RemarkEmbedGenerator />