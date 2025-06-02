<script setup lang="ts">
import { onMounted } from "vue"
import FlexRow from "../src/FlexRow.vue"

onMounted(() => {
  if (window.remarking) {
    window.remarking.scan?.()
  }
})
</script>

<blockquote data-remarking-uri="/markwhen/markwhen"></blockquote>
