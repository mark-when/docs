import tailwindcss from "@tailwindcss/vite";
import { defineConfig, postcssIsolateStyles } from "vitepress";
import { highlight } from "./highlight";

export function extractTitle(info, html = false) {
  if (html) {
    return (
      info.replace(/<!--[^]*?-->/g, "").match(/data-title="(.*?)"/)?.[1] || ""
    );
  }
  return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || "txt";
}

function extractLang(info) {
  return info
    .trim()
    .replace(/=(\d*)/, "")
    .replace(/:(no-)?line-numbers({| |$|=\d*).*/, "")
    .replace(/(-vue|{| ).*$/, "")
    .replace(/^vue-html$/, "template")
    .replace(/^ansi$/, "");
}

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    css: {
      postcss: {
        plugins: [
          postcssIsolateStyles({
            includeFiles: [/vp-doc\.css/, /base\.css/],
          }),
        ],
      },
    },
  },
  markdown: {
    config: (md) => {
      const originalFence =
        md.renderer.rules.fence ||
        function (tokens, idx, options, env, renderer) {
          return renderer.renderToken(tokens, idx, options);
        };

      md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
        const token = tokens[idx];

        const lang = extractLang(token.info);
        // Handle your custom language
        if (lang === "mw") {
          const highlighted = highlight(token.content);

          // remove title from info
          token.info = token.info.replace(/\[.*\]/, "");

          const active = / active( |$)/.test(token.info) ? " active" : "";
          token.info = token.info
            .replace(/ active$/, "")
            .replace(/ active /, " ");

          return (
            `<div class="language-${lang}${active}">` +
            `<button title="${options.codeCopyButtonTitle}" class="copy"></button>` +
            `<span class="lang">${lang}</span>` +
            `<pre><code>` +
            highlighted +
            `</code></pre>` +
            "</div>"
          );
        }

        // Use original renderer for everything else
        return originalFence(tokens, idx, options, env, renderer);
      };
    },
  },
  title: "Markwhen Documentation",
  themeConfig: {
    siteTitle: "Markwhen",
    logo: "/icon_192.png",
    algolia: {
      appId: "TZGD5630J7",
      apiKey: "d817da01577fa9553ed176b1115bb454",
      indexName: "markwhen",
    },
    sidebar: [
      {
        text: "Introduction",
        link: "/",
        items: [
          {
            text: "Markdown-like",
            link: "/markdown-like",
          },
          {
            text: "Journal language",
            link: "/journal-language",
          },
          {
            text: "Parser",
            link: "/parser",
          },
          {
            text: "CLI",
            link: "/cli",
          },
        ],
        collapsible: true,
        collapsed: false,
      },
      {
        text: "Syntax",
        link: "/syntax",
        items: [
          {
            text: "Events",
            link: "/syntax/events",
          },
          {
            text: "Dates and Ranges",
            link: "/syntax/dates-and-ranges",
          },
          {
            text: "Event Descriptions",
            link: "/syntax/event-descriptions",
          },

          {
            text: "Groups and Sections",
            link: "/syntax/groups-and-sections",
          },
          {
            text: "Header",
            link: "/syntax/header",
          },
          {
            text: "Tags",
            link: "/syntax/tags",
          },
          {
            text: "Timezones",
            link: "/syntax/timezones",
          },
          // {
          //   text: "Reminders",
          //   link: "/syntax/reminders",
          // },
        ],
        collapsible: true,
        collapsed: false,
      },
      {
        text: "Editor",
        link: "/interface",
        items: [
          { text: "Overview", link: "/interface/overview" },
          {
            text: "Collaborative editing",
            link: "/interface/collaborative-editing",
          },
          { text: "Snippets", link: "/interface/snippets" },
          { text: "Commands", link: "/interface/commands" },
        ],
        collapsible: true,
        collapsed: false,
      },
      {
        text: "Visualizations",
        link: "/visualizations",
        items: [
          {
            text: "Overview",
            link: "/visualizations",
          },
          {
            text: "Starter template",
            link: "/visualizations/starter-template",
          },
        ],
        collapsible: true,
        collapsed: false,
      },
      {
        text: "Links",
        items: [
          {
            text: "Github",
            link: "https://github.com/mark-when/markwhen",
          },
          {
            text: "Example timeline",
            link: "https://markwhen.com/example",
          },
          {
            text: "Markwhen.com",
            link: "https://markwhen.com",
          },
          {
            text: "Markwhen blog",
            link: "https://blog.markwhen.com",
          },
          {
            text: "VS Code extension",
            link: "https://marketplace.visualstudio.com/items?itemName=Markwhen.markwhen",
          },
        ],
      },
    ],
    socialLinks: [
      { icon: "discord", link: "https://discord.gg/3rTpUD94ac" },
      { icon: "github", link: "https://github.com/mark-when/markwhen" },
    ],
  },
  head: [
    [
      "script",
      {
        defer: "",
        src: "https://static.cloudflareinsights.com/beacon.min.js",
        "data-cf-beacon": '{"token": "fb4546a09d0e498cac0a8f3630cf0d9f"}',
      },
    ],
  ],
});
