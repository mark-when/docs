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

function attrsToLines(attrs) {
  attrs = attrs.replace(/^(?:\[.*?\])?.*?([\d,-]+).*/, "$1").trim();
  const result = [];
  if (!attrs) {
    return [];
  }
  attrs
    .split(",")
    .map((v) => v.split("-").map((v) => parseInt(v, 10)))
    .forEach(([start, end]) => {
      if (start && end) {
        result.push(
          ...Array.from({ length: end - start + 1 }, (_, i) => start + i)
        );
      } else {
        result.push(start);
      }
    });
  return result;
}

export default defineConfig({
  sitemap: {
    hostname: "https://docs.markwhen.com",
  },
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
          const lines = attrsToLines(token.attrs?.[0]?.[0] || "");
          const highlighted = highlight(token.content, true, lines);

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
            text: "Properties",
            link: "/syntax/properties",
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
        ],
        collapsible: true,
        collapsed: false,
      },
      {
        text: "Meridiem",
        link: "/meridiem",
        items: [
          {
            text: "Collaborative editing",
            link: "/meridiem/sharing",
          },
          { text: "Snippets", link: "/meridiem/snippets" },
          // { text: "Commands", link: "/meridiem/commands" },
          {
            text: "Apps & API",
            link: "/meridiem/api",
            items: [
              { text: "API", link: "/meridiem/api/api" },
              {
                text: "Extension conversions",
                link: "/meridiem/api/extension-conversions",
              },
              {
                text: "SMS & Email",
                link: "/meridiem/api/sms-email",
              },
            ],
          },
        ],
        collapsible: true,
        collapsed: false,
      },
      // {
      //   text: "Editors",
      //   link: "/editors",
      //   collapsible: true,
      //   collapsed: false,
      //   items: [
      //     {
      //       text: "VS Code Extension",
      //       link: "/vscode",
      //     },
      //     {
      //       text: "Obsidian Plugin",
      //       link: "/obsidian",
      //     },
      //   ],
      // },
      {
        text: "Remark.ing",
        link: "/remarking",
        items: [
          {
            text: "Remarks",
            link: "/remarking/remarks",
          },
          {
            text: "Embedding",
            link: "/remarking/embedding",
          },
          {
            text: "RSS",
            link: "/remarking/rss",
          },
        ],
        collapsed: false,
        collapsible: true,
      },
      {
        text: "Views",
        link: "/visualizations",
        collapsible: true,
        collapsed: false,
        items: [
          {
            text: "Starter template",
            link: "/visualizations/starter-template",
          },
          {
            text: "Timeline",
            link: "/visualizations/timeline",
          },
          // {
          //   text: "Timeline",
          //   link: "/visualizations/timeline",
          //   items: [
          //     {
          //       text: "info",
          //       link: "/timeline/info",
          //     },
          //   ],
          //   collapsible: true,
          //   collapsed: true,
          // },
          // {
          //   text: "Calendar",
          //   link: "/visualizations/calendar",
          // },
          // {
          //   text: "Oneview",
          //   link: "/visualizations/oneview",
          // },
          // {
          //   text: "Map",
          //   link: "/visualizations/map",
          // },
        ],
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
            text: "Markwhen on Remark.ing",
            link: "https://remark.ing/markwhen",
          },
          {
            text: "VS Code extension",
            link: "https://marketplace.visualstudio.com/items?itemName=Markwhen.markwhen",
          },
          {
            text: "Obsidian plugin",
            link: "https://obsidian.md/plugins?id=markwhen",
          },
        ],
      },
    ],
    socialLinks: [
      { icon: "discord", link: "https://discord.gg/3rTpUD94ac" },
      { icon: "github", link: "https://github.com/mark-when" },
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
    [
      "script",
      {
        async: "",
        src: "https://embed.remark.ing/static/embed.js",
        charset: "utf-8",
      },
    ],
  ],
});
