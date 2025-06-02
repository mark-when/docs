<script setup lang="ts">
import { ref, onMounted, computed } from "vue"

const latestBinaryVersion = ref("0.2.5");
onMounted(async () => {
  try {
    const res = await fetch(
      "https://storage.googleapis.com/markwhen_binaries/Meridiem/darwin/arm64/RELEASES.json"
    );
    const json = await res.json();
    latestBinaryVersion.value = json.currentRelease;
  } catch (e) {
    console.error(e);
  }
});

const downloadLink = computed(() => `https://storage.googleapis.com/markwhen_binaries/Meridiem/darwin/arm64/Meridiem-darwin-arm64-${latestBinaryVersion.value}.zip`)
</script>

# Meridiem

![](/images/meridiem.png)

[Meridiem](https://meridiem.markwhen.com) is a markwhen editor brought to you by [the team that develops markwhen](https://github.com/kochrt) that includes:

- Bidirectional editing (views can edit the document, in addition to editing the text directly)
- Event hover highlighting
- [Collaborative editing](/meridiem/collaborative-editing)
- Integrated tag color picker
- Support for multiple views
- Work with online and offline documents
- [Per-document Access control](/meridiem/collaborative-editing)
- [Document editing API and OAuth apps](/meridiem/api/)
- Light and dark modes
- Incremental reparsing
- [Snippets](/meridiem/snippets.md)
- Keymaps (VS Code, Vim, Emacs)
- And more

## Desktop app

Meridiem is available both as a web app and as a desktop app. The latest version is {{ latestBinaryVersion }} and can be downloaded <a :href="downloadLink">here</a>.
