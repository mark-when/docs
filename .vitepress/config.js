export default {
  title: "Markwhen Documentation",
  themeConfig: {
    siteTitle: "Markwhen",
    logo: "/icon_192.png",
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
        ],
      },
      {
        text: "Links",
        items: [
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
  },
};
