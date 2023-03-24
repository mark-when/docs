export default {
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
        text: "Documentation",
        link: "/",
        items: [
          {
            text: "Overview",
            link: "/",
          },
        ],
      },
      {
        text: "Parser",
        items: [
          {
            text: "Playground",
            link: "/parser/playground",
          },
          {
            text: "Output",
            link: "/parser/output",
          },
        ],
        collapsible: true,
        collapsed: true
      },
      {
        text: "CLI",
        items: [
          { 
            text: "Overview",
            link: "/cli"
          }
        ],
        collapsible: true,
        collapsed: true
      },
      {
        text: "Syntax",
        items: [
          {
            text: "Overview",
            link: "/syntax/overview",
          },
          {
            text: "Header",
            link: "/syntax/header",
          },
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
            text: "Pages",
            link: "/syntax/pages",
          },
        ],
        collapsible: true,
        collapsed: true
      },
      {
        text: "Web interface",
        link: "/interface",
        items: [
          { text: "Overview", link: "/interface/overview" },
          { text: "Exporting", link: "/interface/exporting" },
        ],
        collapsible: true,
        collapsed: true
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
        collapsed: true
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
      { icon: "discord", link: "https://discord.gg/kQbqP4uz" },
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
};
