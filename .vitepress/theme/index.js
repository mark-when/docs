import DiscordButton from "../../src/DiscordButton.vue";
import DefaultTheme from "vitepress/theme";
import PageLayout from "../../src/PageLayout.vue";
import SubscriptionPillButtons from "../../src/SubscriptionPillButtons.vue"
import "./custom.css";

export default {
  ...DefaultTheme,
  Layout: PageLayout,
  enhanceApp(context) {
    DefaultTheme.enhanceApp(context);
    context.app.component("DiscordButton", DiscordButton);
    context.app.component("SubscriptionPillButtons", SubscriptionPillButtons)
  },
};
