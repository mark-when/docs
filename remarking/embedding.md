<script setup lang="ts">
import { onMounted } from "vue"
import FlexRow from "../src/FlexRow.vue"

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
