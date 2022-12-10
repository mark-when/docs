<!-- ### Table of contents

- [Overview](#overview)
- [Timeline](#timeline)
- [Header](#header)
  - [Title](#title)
  - [Description](#description)
  - [Viewers](#viewers)
  - [Tags and colors](#tags-and-colors)
  - [Date formatting](#date-formatting)
  - [Header Quick Reference](#header-quick-reference)
- [Events](#events)
  - [Quick Reference](#quick-reference)
  - [EDTF Date Ranges](#edtf-date-ranges)
    - [EDTF Date](#edtf-date)
  - [Date Ranges](#date-ranges)
    - [Dates](#dates)
  - [Relative Dates](#relative-dates)
    - [Event IDs](#event-ids)
    - [Due dates](#ue-dates)
    - [Week days](#week-days)
  - [Event Description](#event-description)
    - [Tags](#tags)
    - [Links](#links)
    - [Locations](#locations)
    - [Photos](#photos)
    - [References](#references)
    - [Task list](#task-list)
    - [Percent](#percent)
- [Groups and Sections](#groups-and-sections)
- [Pages](#pages)
- [Sorting](#sorting)
- [Drag and Drop](#drag-and-drop)
- [Editing from the timeline](#editing-from-the-timeline)
- [Saving and sharing](#saving-and-sharing)
  - [Sharing](#sharing)
    - [Random url](#random-url)
    - [Custom url](#custom-url)
    - [Access control](#access-control)
  - [Exporting](#exporting)
    - [Text](#text)
    - [PNG or PDF](#png-or-pdf)
  - [Importing](#importing)

-->

# Syntax

A markwhen document is a simple text file. Its content type is `text/markwhen`; though, when importing from other sources, `text/plain` works fine. A markwhen document is separated into timeline pages via a page break token (`\n_-_-_break_-_-_\n`).

## Timeline

A Timeline page is composed of an optional [header](#header) and one or more [events](#events).

## Header

The header of a timeline indicates things about the timeline like visual preferences and metadata. It is the first part of a timeline; that is, **anything before the first event is considered the header**.

There are six things you can include in the header:

- [Title](#title)
- [Description](#description)
- [Viewers](#viewers)
- [Editors](#editors)
- [Tag colors](#tags-and-colors)
- [Date formatting](#date-formatting)

Anything else in the header area (that is, everything else before the first event that is not date formatting or tag colors) will be ignored.

### Title

Indicate the title of the page by adding a title attribute to your header:

```
title: Party Planning
```

This will also show up as the title of the browser tab.

### Description

If the title isn't descriptive enough, or you want to add more context, add a description to the timeline:

```
description: These are the main events for the party, try to stick to the plan!!
```

### Viewers

<div class="flex flex-row font-bold" style="font-weight: bold; display: flex; gap: 0.25rem;">
  <small class="planPill personal rounded px-1 bg-green-100 text-green-800 shadow mr-2 border-2 border-green-200">Personal Plan</small>
  <small class="planPill business rounded px-1 bg-purple-100 text-purple-800 shadow border-2 border-purple-200">Business Plan</small>
</div>

[Only applicable to timelines shared on markwhen.com]

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

### Editors

[Only applicable to timelines shared on markwhen.com]

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

### Tags and colors

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

### Date formatting

Non-ISO8601 dates default to American formatting (Month/Day/Year). This can be changed to `d/M/y` formatting by adding the following line in the header area (before any event):

```
dateFormat: d/M/y
```

This is a hardcoded line, any other format attempt will not work. [See all supported date formats](#date-ranges).

### Header Quick Reference

| Item                                                  | Syntax                       | Example                                         |
| ----------------------------------------------------- | ---------------------------- | ----------------------------------------------- |
| Coloring tags                                         | `#[tag name]: <color>`       | `#Movies: aquamarine`                           |
| Date format. Change the formatting to European style. | `dateFormat: d/M/y`          | `dateFormat: d/M/y`                             |
| Title of the page                                     | `title: <title>`             | `title: My timeline`                            |
| Description of the page                               | `description: <description>` | `description: If anything looks off here, lmk!` |
| Viewers                                               | `view: <viewer emails>`      | `view: you@example.com`                         |
| Editors                                               | `edit: <editor emails>`      | `edit: otherperson@example.com`                 |

## Events

An event is a [Date Range](#date-ranges) or [EDTF Date Range](#edtf-date-ranges) followed by a colon followed by an [event description](#event-description):

```
12/2012: End of the world

1961: Year after 1960
Later, 1962 would happen

1 year: 1962, just as predicted

2020-02-22T12:13:14Z-now: How long the pandemic has been going on?
12/7/1941: Pearl Harbor attacked
Launched US into WWII

2022-02-22T16:27:08.369Z: More specific thing
2021-01-02T06:27:00Z-2022: ongoing project work until the end of 2022

1892/2021-08-12: Example of EDTF date range
```

### Quick Reference

| Item                                                                                                | Syntax                                                                                  | Example                                                                                                                     |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [Event](#events)                                                                                    | `[DateRange\|EDTFDateRange]:[EventDescription]`                                         | `08/2015-05/2017: CS degree #Education`                                                                                     |
| [EDTFDateRange](#edtf-date-ranges)                                                                  | `[EDTFDate\|RelativeDate\|now][/EDTFDate\|RelativeDate\|now]`                           | `2004-02-01/2005`, `2005/2006-02`, `2005/now`, `2018/6 months`                                                              |
| [EDTFDate](#edtf-date)                                                                              | `YYYY(-MM(-DD)?)?`                                                                      | `2000-06-01`, `1892`, `1492-01`                                                                                             |
| [DateRange](#date-ranges)                                                                           | `[Date][-Date]`                                                                         | `1998-06/01/2000`                                                                                                           |
| [Date](#dates). `now` is a special keyword which means what you think it does                       | `[HumanDate\|ISO8601\|RelativeDate\|now]`                                               | `01/30/1888`                                                                                                                |
| HumanDate. Defaults to American formatting (Month/Day/Year, can be overridden in [header](#header)) | `[m/d-]yyyy`                                                                            | `2002` or `01/2002` or `12/25/1901`                                                                                         |
| Casual date.                                                                                        | `(day)?(jan\|feb\|mar\|apr\|may\|jun\|jul\|aug\|sep\|oct\|nov\|dec)(day)?(year)(time)?` | `4 January 1996` or `Oct 8 2012` or `March 16 12:19pm` or `9:15pm` or `06:30`                                               |
| ISO8601 format. The `T` and `Z` are required.                                                       | `YYYY-MM-DD`T`HH:MM:SS:MS`Z                                                             | `1859-05-09T12:01:01Z`                                                                                                      |
| [Relative Date](#relative-dates) (base this date off of another)                                    | `[after] [!eventId] Amount`                                                             | `after !Birthday 3 weeks 2 days`, `2 days - 3 months 4 days 8 seconds`, `!ww1 21 years - 6 years`                           |
| Amount (used in relative dates)                                                                     | `[digit] [milliseconds\|seconds\|minutes\|hours\|days\|weeks\|months\|years]`           | `after !Birthday 3 weeks`, `2 days - 3 months`, `!ww1 21 years - 6 years`                                                   |
| [Event description](#event-description)                                                             | `([text]\|[Tag]\|[Location]\|[Link])*`                                                  | `07/2014: 4th of July in DC ![](https:/linktomyimage.com/imagelink.png) #Travel @sue @greg [Washington, DC](location)`      |
| [Tag](#tags)                                                                                        | `#[tag name]`                                                                           | `1999: The Matrix #Movies`                                                                                                  |
| [Location](#locations)                                                                              | `[location name](location\|map)`                                                        | `02/23/1836: Battle of the Alamo (The Alamo, TX)[map]`                                                                      |
| [Link](#links)                                                                                      | `[display text](link)`                                                                  | `05/25/2021: [cascade.page](https://cascade.page) featured on [Hacker News](https://news.ycombinator.com/item?id=27282842)` |
| [Photos](#photos). Markdown-style image format.                                                     | `![optional alt text](image link)`                                                      | `07/2017: 4th of July in DC ![](https://example.com/image.png)`                                                             |
| [Reference](#references). Reference and link to other markwhen pages.                               | `@[other markwhen name]`                                                                | `09/2019: Dinner with @karl` or `2020-2022: COVID-19 Pandemic @jenny/covid @covidtimeline`                                  |
| Comment                                                                                             | `//[text]`                                                                              | `// this is a comment`                                                                                                      |

### EDTF Date Ranges

[Extended Date Time Format](https://www.loc.gov/standards/datetime/)

Markwhen is currently level 0 EDTF compliant, supporting ranges such as:

```
1964/2008
2004-06 / 2006-08
2004-02-01/ 2005-02-08
2004-02-01 /2005-02
2004-02-01/2005
2005/2006-02
2005/now
2018/6 months
```

Open-ended ranges are not supported.

Ranges start and end with either a [EDTF Date](#edtf-date) or [Relative Date](#relative-dates) or the special keyword `now`.

#### EDTF Date

Essentially the first part of a full ISO8601 date, whose regex could be expressed as `\d{4}(-\d{2}(-\d{2})?)?`:

```
1981
2012-05
2022-01-30
```

### Date Ranges

A date range is a period from one date to another. Every event has an associated date range, whether it has an explicitly written end date or not. A date range is typically `Date[-Date]`; that is, one date optionally followed by a dash (`-`) or the word `to` and another date.

If an end date is not specified, the range is as long as its granularity. For example, the event

```
2001: A Space Odyssey
```

starts January 1, 2001, and lasts through December 31, 2001.

| Example                                     | Inferred Range                                   | Explanation                                                                                                                                                          |
| ------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2024`                                      | `2024-01-01T00:00:00Z` to `2025-01-01T00:00:00Z` | From the start of 2024 to the end of 2024                                                                                                                            |
| `04/1776`                                   | `1776-04-01T00:00:00Z` to `1776-05-01T00:00:00Z` | From the start of April 1776 to the end of April 1776                                                                                                                |
| `01/01/2024`                                | `2024-01-01T00:00:00Z` to `2024-01-02T00:00:00Z` | From the start of January 1, 2024, to the end of January 1, 2024 (the whole day).                                                                                    |
| `11/11/2024-12/12/2024`                     | `2024-11-11T00:00:00Z` to `2024-12-13T00:00:00Z` | From the start of November 11, 2024, to the end of December 12, 2024.                                                                                                |
| `2031-11-19T01:35:10Z-2099-08-04T18:22:48Z` | `2031-11-19T01:35:10Z` to `2099-08-04T18:22:48Z` | Exactly as specific as the ISO dates say.                                                                                                                            |
| `January 3 - Apr 6`                         | `2022-01-01T00:00:00Z` to `2022-04-07T00:00:00Z` | As this documentation was written in 2022, the year 2022 is inferred. Note how the range extends to the **end** or April 6, which makes it the beginning of April 7. |
| `now - 10 years 6 months 3 days`            | `now` to 10 years, 6 months, and 3 days later    | `now` is whatever time the timeline is **rendered**, not when it was **written**. `10 years 6 months 3 days` is a [relative date](#relative-dates).                  |
| `3:30pm - 4:30pm`                           | Today's date, from `15:30` to `16:30`            | When a time is by itself, it is based off of the last date seen, or, if there isn't any, today.                                                                      |
| `1 Jan 1998 to 11/11/2011 8am`              | `1998-01-01T00:00:00Z` to `2011-11-11T08:00:00Z` |                                                                                                                                                                      |
| Nov 11 02:30                                | `2011-11-11T02:30:00Z` to `2011-11-11T02:30:00Z` | When a time is specified (hour/minute), the granularity is instant.                                                                                                  |

#### Dates

A date can be expressed in a few forms. Human readable dates are supported, like `1665`, `03/2222`, `09/11/2001`, `18 March 2026`, `Aug 30 9:45am`, as well as IO8601 dates, like `2031-11-19T01:35:10Z`. Human readable date formatting defaults to the American Month/Day/Year but can be changed to European formatting via the [header](#date-formatting).

### Relative Dates

If you have events that are based off of, or relative to, other events, you can describe their relationship to get the range you want.

For example, say you are working on a project tracker. You could outline the phases of your project by using absolute dates, like the following:

```
// To indicate we are using European date formatting
dateFormat: d/M/y

// 2 weeks
01/01/2023 - 14/01/2023: Phase 1 #Exploratory

// Another 2 weeks
15/01/2023 - 31/01/2023: Phase 2 #Implementation

// 1 month
02/2023: Phase 3 #Implementation

// 3 days, after a one week buffer
07/03/2023 - 10/03/2023: Phase 4 - kickoff! #Launch
```

![](/images/nonrelative_dates.png)

However, as soon as something changes (say something slips or an estimate was wrong), you would have to go through all events and change their dates manually. This would be especially troublesome if the change is early on.

With relative dates, we can express the same timeline like so:

```
// 2 weeks
01/01/2023 - 2 weeks: Phase 1 #Exploratory

// Another 2 weeks
2 weeks: Phase 2 #Implementation

// 1 month
1 month: Phase 3 #Implementation

// One week after phase 3 ends, a 3 days kickoff event
1 week - 3 days: Phase 4 - kickoff! #Launch
```

![](/images/relative_dates.png)

Relative dates base themselves off the previous date, and this goes all the way back to our first date, `01/01/2023`.

#### Event IDs

This works well enough for serial dates that are each dependent on the last, but what if we have multiple events that are all dependent on the same event? We can do that using event ids:

```
// Event ids are represented by an exclamation point followed
// by the id - like !Phase1
01/01/2023 - 2 weeks: Phase 1 #Exploratory !Phase1

// Another 2 weeks
after !Phase1 2 weeks: Phase 2, in parallel with Phase 3 #Implementation

// 1 month
after !Phase1 1 month: Phase 3, in parallel with Phase 2 #Implementation

// 3 days, after a one week buffer
1 week - 3 days: Phase 4 - kickoff! #Launch
```

The word `after` is optional, we could say `!Phase1 2 weeks: Phase 2, in parallel with Phase 3 #Implementation` to have the same effect.

Relative dates will first attempt to refer to the event that was specified by a provided event id. For `!Phase1 2 weeks: Phase 2`, the event with the id `Phase1` is looked for, is checked for when it ends, and is used as the reference upon which `2 weeks` is based.

If we can't find the event id, or no event id is given, the relative date is instead based upon the last date in the timeline - "last" here meaning most recently written, as the timeline is parsed from top to bottom. So if we have a timeline like this:

```
2020: Pandemic
2021 - 2023: More pandemic
1 year: Less pandemic?
```

`1 year` is based off the last date seen, which would be `2023`, or, more specifically, the end of `2023`.

This also means that we can base our end date off of our start date:

```
12/25/2022: Christmas
5 days - 3 days: New Years' stuff
```

Here, `5 days` is five days after the previously seen date (`12/25/2022`), which would make it `12/30/2022`, while `3 days` is three days after the previous date, which is our start date of `12/30/2022`.

Two relative dates together, like `x days - y weeks: ...`, can therefore essentially be read as `x days after the previous event and lasts for y weeks`.

The only exception to this is the shorthand singular relative date, like `x years:...`, which means `immediately after the last event and lasts for x years`.

#### Due dates

In the same way you can represent an event taking place after a prior event, you can indicate that an event should come _before_ another. Let's say we wanted to get some things done before Christmas:

```
2022-12-25: Christmas !Christmas
before !Christmas 1 month: Buy presents
before !Christmas 2 weeks: Get a tree
```

By using [event ids](#event-ids), we specify the due date, and specify the amount of time before that event. Like all event ids, the id must be defined earlier in the document in order to be able to reference it; something like the following would **not** work:

```
before !Christmas 1 month: Buy presents
before !Christmas 2 weeks: Get a tree
2022-12-25: Christmas !Christmas
```

because the event with the id of `!Christmas` is after the events that refer to it. A good way to deal with this is to define the known dates at the start of your timeline and then look at a [sorted view](#sorting) to see them in order.

Similar to relative events that are dependent on preceding events, events with due dates can also have start and end times:

```
2022-12-25: Christmas !Christmas
before !Christmas 1 week - 1 month: Buy presents
```

Here, the `Buy presents` event _ends_ 1 week _before_ Christmas, and lasts for 1 month. When dealing with relative events, the first part of the range (if there is one) can be considered the "buffer," while the second part is the duration. If there is only one part (no range; `before !Christmas 1 month` instead of `before !Christmas 1 week - 1 month`), then it will abut the event it is basing itself off of with the specified duration.

Also similarly to other relative events, if no event id is specified, it will be dependent on the previous event.

`Before` and `by` can both be used to represent happening before another event. These are equivalent:

```
by !Chistmas 1 day: ...
before !Christmas 1 day: ...
```

#### Week days

![](/images/weekdays.png)

When using relative dates you can also take advantage of being able to specify `week days` - this calculates durations based on how many non-weekend days it takes.

For example:

```
July 13, 2022 - 5 week days: Item estimate
10 week days: Second part of item
```

July 13, 2022 is a Wednesday, and we're counting 5 week days, so we go Wednesday, Thursday, Friday (3), and then the following Monday and Tuesday (2), which gets us to the end of July 19 (technically midnight July 20, a Wednesday).

The second event starts after the first and lasts 10 weekdays, which would take us to two Wednesdays into the future, or 14 calendar days.

`Week`, `work`, and `business` are supported as prefixes to `day` when working with weekdays. These are all equivalent:

```
10 business days: ...
10 weekdays: ...
10 work days: ...
```

Week days do not take into account holidays - only weekends. It also assumes a 5 day work week, unfortunately. [Hopefully soon it will be 4 days](https://4dayweek.io).

### Event Description

An event description is everything after the date range of the event, **up to the next event**. Event descriptions can span multiple lines. For `12/2012: End of the world`, the event description is just `End of the world`. For the following event:

```
1961: Year after 1960
Later, 1962 would happen
```

the event description is

```
Year after 1960
Later, 1962 would happen
```

Everything not on the first line (where the date range is specified) up to the next event will be put in an overflow box that can be expanded by clicking on the event. Such an overflow is indicated in the timeline with an ellipsis (...). Event descriptions can include [tags](#tags), [links](#links), [locations](#locations), [photos](#photos), and [references](#references).

#### Tags

Events can be tagged to visually indicate they belong to some category. Simply add your tag text in any part of an event's description to tag it:

```
2022: Happy 95th Birthday Queen Elizabeth #UK #Royalty
```

A list of all tags appears at the bottom of the screen to allow for filtering by tags.

#### Links

Links are similar to markdown links: link display text in brackets followed by the url in parentheses:

```
2018 - 3 years: [Google](www.google.com)
```

#### Locations

Events can have zero or more locations associated with them, indicated with the following syntax: `[name of location](map|location)`

```
09/2018: Road trip to Seattle
[Devil's Tower](location)
[Glacier National Park](map)
[Seattle](map)
```

#### Photos

Markdown-style images are supported: `![optional alt text](image link)`

#### References

Link to other timelines with the `@` syntax:

```
1919: Treaty of Versailles @wwi
```

#### Task list

Markdown task lists are supported:

```
now: Things to do
- [ ] unfinished task
- [x] finished task
```

When no [percent](#percent) is present, the completion ratio of tasks will be used to represent the percent complete and will be indicated in the event bar.

#### Percent

Indicate that an event is some percent complete by including `0`-`100%` in your event, and the event bar will be partially filled in to show the completion percentage.

![](/images/percents.png)

## Groups and Sections

![](/images/groups.gif)

Events can be grouped. To indicate a group, write `group` or `section` at the beginning of a line. End a group or section with the keyword `endSection` or `endGroup`. All events up to the ending keyword or the end of the page (whichever comes first) are in the group.

For example,

```
group The 90s // The title for this group is "The 90s"

1991: Desert Storm
1994: Friends premiered
05/14/1998: Series finale of Seinfeld

// Nested groups are allowed
group The 2000s

03/2005: Premiere of The Office (US)

// Explicitly end the inner group
endGroup

2020: Pandemic

endGroup

// This event is not part of a group
2022: Other things happen
...

```

If you want an event group to start out collapsed, indent the `group` line definition.

```
2001: John is born

// The space here before `group`
// means the group will appear collapsed at first
  group Less important events #StillCoolThough

2003: Someone else is born
...

endGroup
```

Sections behave similarly though extend to the width of the entire timeline and are activated by the `section` and `endSection` keywords:

![](/images/sections.gif)

The only difference between sections and groups are how they are styled by the [visualization](/visualizations).

Read more about how groups are handled by the [parser](/parser).

## Pages

When one timeline isn't enough, add pages. Pages are implemented by inserting a special token (`\n_-_-_break_-_-_\n`) at the point where a new page should be.

![](/images/pages.gif)

## Sorting

![](/images/sorting.gif)

Timelines can be sorted one of three ways: how they were originally written (default), ascending, or descending. Event groups will be sorted internally and then they themselves sorted based on their collective earliest and latest dates.

## Drag and Drop

If you find yourself not wanting to edit the text of the timeline or just have some quick edits to make, you may find the drag and drop option to be helpful for you. You can edit the start and end times for an event, as well as moving it forward or backward in time.

![](/images/dragdrop.gif)

This setup works well when sorting, as events will automatically move themselves to the correct order after they've been edited.

## Editing from the timeline

Basic editing of events can be done from the timeline view. Edits made in the timeline will be reflected back to the text editor. Currently, events can be resized (start and end dates can be moved) or moved up or down (that is, appearing before or after other events in the timeline). Events can also be created from the timeline view, by hovering over the new event button and clicking and dragging to the desired start and end dates for your event.

![](/images/timeline_edit.gif)

Note that the interpolated events' date formats will be inferred from the date formats of already defined dates, otherwise it will default to [EDTF](#edtf-date). So, if you want to create an event with the format `m/d/y` from the timeline by dragging the new event button, you should already have an event defined that uses that format.

## Saving and sharing

To save a markwhen document, click the `Save locally` button from the `File` menu while on the Editor tab of the sidebar. It will be saved locally **in your browser**, and you can come back and edit or view it later, as long as it's on the same device.

You can view markwhen documents that you've saved from the profile tab of the sidebar.

### Sharing

#### Random url

To share a markwhen document with a link, click the `Share` button. You do not need an account to do this.

#### Custom url

To share a markwhen document with a custom link like `/jeff/mylife`, and to be able to edit it later, you will need to make an account. You can make an account by sending yourself a signin link from the profile page. Once signed in, you will need to choose a username from which your markwhen documents will be hosted. For example, if you choose the name `jeff`, all your markwhen documents will be accessible from `https://markwhen.com/jeff/...`. If you share a markwhen document with the same name as your username, it will be accessible from `https://markwhen.com/[your username]/`, otherwise, it will be accessible from `https://markwhen.com/[your username]/[markwhen name]`.

All in all, the steps are:

1. Send yourself a signin link from the profile tab.
2. Click the link to login.
3. Choose a username - all your shared timelines will be available from `https://markwhen.com/[your username]/...`
4. Share your markwhen page

#### Access control

<div class="flex flex-row font-bold" style="font-weight: bold; display: flex; gap: 0.25rem;">
  <small class="planPill personal rounded px-1 bg-green-100 text-green-800 shadow mr-2 border-2 border-green-200">Personal Plan</small>
  <small class="planPill business rounded px-1 bg-purple-100 text-purple-800 shadow border-2 border-purple-200">Business Plan</small>
</div>

Specify who can view your shared timeline by adding a `view` field to your header:

```
// Only allow Jill, Corey, and everyone at example.com
// to view this shared timeline
view: jill@webkit.org, corey@internetexplorer.com, *@example.com
```

**This only affects markwhen documents shared on markwhen.com**, and is a paid feature - you need a subscription for the `view` field to take effect.

See [viewers](#viewers).

### Exporting

#### Text

There are a few ways to export your markwhen file, all of which can be found in the export file menu. You can download a `.mw` file or copy the whole text document.

![](/images/file_menu.png)

And, while not in the file menu, by adding `.mw` to a shared markwhen.com page, you can view the page's raw text.

### Importing

Similar to [exporting](#exporting) a markwhen page, you can import a markwhen file from your computer or load one via a url. Note that the url should return raw text (either `text/markwhen` or `text/plain`), **not** html.

![](/images/file_import.png)

Importing from a url can also be done by appending a hash to markwhen.com of the form `#from={url}`. For example, `markwhen.com/#from=markwhen.com/rob/wedding` will load the markwhen file at `/rob/wedding`.
