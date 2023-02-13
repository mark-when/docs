<script setup>
import SubscriptionPillButtons from "../src/SubscriptionPillButtons.vue"

</script>

# Header

The header of a timeline indicates things about the timeline like visual preferences and metadata. It is the first part of a timeline; that is, **anything before the first event is considered the header**.

There are six things you can include in the header:

- [Header](#header)
  - [Title](#title)
  - [Description](#description)
  - [Viewers](#viewers)
  - [Editors](#editors)
  - [Tags and colors](#tags-and-colors)
  - [Date formatting](#date-formatting)
  - [Header Quick Reference](#header-quick-reference)

Anything else in the header area (that is, everything else before the first event that is not date formatting or tag colors) will be ignored.

## Title

Indicate the title of the page by adding a title attribute to your header:

```
title: Party Planning
```

This will also show up as the title of the browser tab.

## Description

If the title isn't descriptive enough, or you want to add more context, add a description to the timeline:

```
description: These are the main events for the party, try to stick to the plan!!
```

## Viewers

<SubscriptionPillButtons/>

Limit access to your timeline by adding a `view:` line:

```
view: onlymypeople@example.com, myteam@example.com
```

Wildcards are also supported:

```
// Anyone with an @example.com email address
view: *@example.com
```

Lack of a `view` line indicates that the document is public.

See [access control](#access-control).

## Editors

Allow others to edit your shared document with an `edit` field in the header:

```
edit: onlymypeople@example.com, myteam@example.com
```

Wildcards are also supported:

```
// Anyone with an @example.com email address
edit: *@example.com
```

Lack of an `edit` line indicates that no one besides the owner can edit it.

## Tags and colors

You can indicate the color you want certain tagged events to appear like so:

```
#Travel: blue
#Education: green
#Economics: #abc // hex color
```

Hex colors are supported (e.g., `#a13bbb`).

So, if you have an event like the following

```
2012-2013: Germany and Italy #Travel
```

it will be colored as blue in the timeline view.

## Date formatting

Non-ISO8601 dates default to American formatting (Month/Day/Year). This can be changed to `d/M/y` formatting by adding the following line in the header area (before any event):

```
dateFormat: d/M/y
```

This is a hardcoded line, any other format attempt will not work. [See all supported date formats](/syntax/dates-and-ranges).

## Header Quick Reference

| Item                                                  | Syntax                       | Example                                         |
| ----------------------------------------------------- | ---------------------------- | ----------------------------------------------- |
| Coloring tags                                         | `#[tag name]: <color>`       | `#Movies: aquamarine`                           |
| Date format. Change the formatting to European style. | `dateFormat: d/M/y`          | `dateFormat: d/M/y`                             |
| Title of the page                                     | `title: <title>`             | `title: My timeline`                            |
| Description of the page                               | `description: <description>` | `description: If anything looks off here, lmk!` |
| Viewers                                               | `view: <viewer emails>`      | `view: you@example.com`                         |
| Editors                                               | `edit: <editor emails>`      | `edit: otherperson@example.com`                 |
