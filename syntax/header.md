<script setup lang="ts">
import Exposition from "../src/Exposition.vue"
</script>

# Header / Frontmatter

The header of a timeline indicates things about the timeline like visual preferences and metadata. It is the first part of a timeline; that is, anything before the first event is considered the header.

The header is parsed as yaml, similar to frontmatter in some markdown parsers. Also similarly to frontmatter, you may (but are not required to) sandwich the header between three dashes (`---`).

```mw
---
title: Timeline
key:
  - entry
---

Dec 29 2029: Some date
```

is parsed the same as

```mw
title: Timeline
key:
  - entry

Dec 29 2029: Some date
```

Custom visualizations may prescribe special header values they might look for when parsing your markwhen document.

Some typical header items are as follows:

## Timezone

Indicate what timezone this markwhen document is relative to:

```mw
timezone: Europe/London
```

or

```mw
timezone: -6
```

## Title

Indicate the title of the page by adding a title attribute to your header:

```mw
title: Party Planning
```

This will also show up as the title of the browser tab.

## Description

If the title isn't descriptive enough, or you want to add more context, add a description to the timeline:

```mw
description: These are the main events for the party, try to stick to the plan!!
```

## Viewers

::: tip Meridiem feature
Specifying viewers in the header is a [Meridiem](https://meridiem.markwhen.com)-specific feature.
:::

Limit access to your timeline by adding a `meridiem.view:` entry:

```mw
meridiem:
  view:
    - onlymypeople@example.com
    - myteam@example.com
```

Wildcards are also supported:

```mw
// Anyone can view
meridiem:
  view: "*"
```

Lack of a `meridiem.view` or `meridiem.edit` entry in the header indicates that the document is private.

See [access control](/meridiem/sharing).

## Editors

::: tip Meridiem feature
Specifying editors in the header is a [Meridiem](https://meridiem.markwhen.com)-specific feature.
:::

Allow others to edit your shared document with an `meridiem.edit` field in the header:

```mw
meridiem:
  edit:
    - onlymypeople@example.com
    - myteam@example.com
```

Wildcards are also supported:

```mw
// Anyone can edit
meridiem:
  edit: "*"
```

Lack of an `edit` entry indicates that no one besides the owner can edit it.

## Tags

You can indicate the color you want certain tagged events to appear like so:

```mw
#Travel: blue
#Education: green
#Economics: #abc // hex color
```

Hex colors are supported (e.g., `#a13bbb`).

So, if you have an event like the following

```mw
2012-2013: Germany and Italy #Travel
```

it will be colored as blue in the timeline view.

### Advanced

Documentation for advanced tag configurations, including timezones and reminders, can be found [here](/syntax/tags).

## Date formatting

Non-ISO8601 dates default to American formatting (Month/Day/Year). This can be changed to `d/M/y` formatting by adding the following line in the header area (before any event):

```
dateFormat: d/M/y
```

This is a hardcoded line, any other format attempt will not work. [See all supported date formats](/syntax/dates-and-ranges).

## Imports

::: tip Meridiem feature
Importing other documents is a [Meridiem](https://meridiem.markwhen.com)-specific feature.
:::

You can import other shared markwhen into your own for viewing purposes, simply by adding it to an `import` list in the header:

```mw
import:
  - blake/info-timeline
  - priya/q3-q4
```

Events from imported timelines will be merged into visualizations.

## Header Quick Reference

| Item                                                  | Syntax                       | Example                                         |
| ----------------------------------------------------- | ---------------------------- | ----------------------------------------------- |
| Coloring tags                                         | `#[tag name]: <color>`       | `#Movies: aquamarine`                           |
| Date format. Change the formatting to European style. | `dateFormat: d/M/y`          | `dateFormat: d/M/y`                             |
| Title of the page                                     | `title: <title>`             | `title: My timeline`                            |
| Description of the page                               | `description: <description>` | `description: If anything looks off here, lmk!` |
| Viewers                                               | `view: <viewer emails>`      | `view: you@example.com`                         |
| Editors                                               | `edit: <editor emails>`      | `edit: otherperson@example.com`                 |
| Timezones                                             | `timezone: <timezone>`       | `timezone: +5` or `timezone: America/New_York`  |
