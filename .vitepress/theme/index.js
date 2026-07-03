import DiscordButton from "../../src/DiscordButton.vue";
import DefaultTheme from "vitepress/theme";
import PageLayout from "../../src/PageLayout.vue";
import TryIt from "../../src/TryIt.vue";
import "./custom.css";
import CopyOrDownloadAsMarkdownButtons from "vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue";

export default {
  ...DefaultTheme,
  Layout: PageLayout,
  enhanceApp(context) {
    DefaultTheme.enhanceApp(context);
    context.app.component("DiscordButton", DiscordButton);
    context.app.component("TryIt", TryIt);
    context.app.component(
      "CopyOrDownloadAsMarkdownButtons",
      CopyOrDownloadAsMarkdownButtons,
    );
  },
};
