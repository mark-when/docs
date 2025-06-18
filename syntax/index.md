<script setup lang="ts">
import Exposition from "../src/Exposition.vue"

const expo = [
  [[0, 7], '<a href="/syntax/header">Header</a>'],
  [[11, 13], '<a href="/syntax/events">Events</a>'],
  [[13, 18], '<a href="/syntax/event-descriptions">Event description</a>'],
  [[22, 23], '<a href="/syntax/groups-and-sections">Section definition</a>'],
  [[26, 27], 'Comment'],
  [[28, 30], '<a href="/syntax/event-descriptions#properties">Event properties</a>']
]

</script>

# Syntax

The example here is indented but indentation is optional. That being said, if you do indent like the below example, a monospaced font is recommended.

<Exposition :expo="expo">

```mw{1-7,12-14,14-18,23,27,29,30}
---
title: Project plan

#Project1: #d336b1
#Danielle: yellow
timezone: America/New_York
---

section All Projects
  group Project 1 #Project1
    // Supports ISO8601
    2025-01/2025-03: Sub task #John
    2025-03/2025-06: Sub task 2 #Michelle
      More info about sub task 2

      - [ ] We need to get this done
      - [x] And this
      - [ ] This one is extra

    2025-07: Yearly planning
endGroup

group Project 2 #Project2
  2025-04/4 months: Larger sub task #Danielle
    contact: imeal@example.com

  // Supports American date formats
  03/2025 - 1 year: Longer ongoing task #Michelle
    assignees: [Michelle, Johnathan]
    location: "123 Main Street, Kansas City, MO"

    - [x] Sub task 1
    - [x] Sub task 2
    - [ ] Sub task 3
    - [ ] Sub task 4
    - [ ] so many checkboxes omg
```

</Exposition>

## Quick Reference

| Item                                                                                                       | Syntax                                                                                  | Example                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [Event](/syntax/events)                                                                                    | `[DateRange\|EDTFDateRange]:[EventDescription]`                                         | `08/2015-05/2017: CS degree #Education`                                                                                     |
| [EDTFDateRange](/syntax/dates-and-ranges)                                                                  | `[EDTFDate\|RelativeDate\|now][/EDTFDate\|RelativeDate\|now]`                           | `2004-02-01/2005`, `2005/2006-02`, `2005/now`, `2018/6 months`                                                              |
| [EDTFDate](/syntax/dates-and-ranges#edtf-date)                                                             | `YYYY(-MM(-DD)?)?`                                                                      | `2000-06-01`, `1892`, `1492-01`                                                                                             |
| [DateRange](/syntax/dates-and-ranges#date-ranges)                                                          | `[Date][-Date]`                                                                         | `1998-06/01/2000`                                                                                                           |
| [Date](/syntax/dates-and-ranges#dates). `now` is a special keyword which means what you think it does      | `[HumanDate\|ISO8601\|RelativeDate\|now]`                                               | `01/30/1888`                                                                                                                |
| HumanDate. Defaults to American formatting (Month/Day/Year, can be overridden in [header](/syntax/header)) | `[m/d-]yyyy`                                                                            | `2002` or `01/2002` or `12/25/1901`                                                                                         |
| Casual date.                                                                                               | `(day)?(jan\|feb\|mar\|apr\|may\|jun\|jul\|aug\|sep\|oct\|nov\|dec)(day)?(year)(time)?` | `4 January 1996` or `Oct 8 2012` or `March 16 12:19pm` or `9:15pm` or `06:30`                                               |
| ISO8601 format. The `T` and `Z` are required.                                                              | `YYYY-MM-DD`T`HH:MM:SS:MS`Z                                                             | `1859-05-09T12:01:01Z`                                                                                                      |
| [Relative Date](/syntax/dates-and-ranges#relative-dates) (base this date off of another)                   | `[after] [!eventId] Amount`                                                             | `after !Birthday 3 weeks 2 days`, `2 days - 3 months 4 days 8 seconds`, `!ww1 21 years - 6 years`                           |
| Amount (used in relative dates)                                                                            | `[digit] [milliseconds\|seconds\|minutes\|hours\|days\|weeks\|months\|years]`           | `after !Birthday 3 weeks`, `2 days - 3 months`, `!ww1 21 years - 6 years`                                                   |
| [Event description](/syntax/event-descriptions/)                                                            | `([text]\|[Tag]\|[Location]\|[Link])*`                                                  | `07/2014: 4th of July in DC ![](https:/linktomyimage.com/imagelink.png) #Travel @sue @greg [Washington, DC](location)`      |
| [Tag](#tags)                                                                                               | `#[tag name]`                                                                           | `1999: The Matrix #Movies`                                                                                                  |
| [Location](#locations)                                                                                     | `[location name](location\|map)`                                                        | `02/23/1836: Battle of the Alamo (The Alamo, TX)[map]`                                                                      |
| [Link](#links)                                                                                             | `[display text](link)`                                                                  | `05/25/2021: [cascade.page](https://cascade.page) featured on [Hacker News](https://news.ycombinator.com/item?id=27282842)` |
| [Photos](#photos). Markdown-style image format.                                                            | `![optional alt text](image link)`                                                      | `07/2017: 4th of July in DC ![](https://example.com/image.png)`                                                             |
| [Reference](#references). Reference and link to other markwhen pages.                                      | `@[other markwhen name]`                                                                | `09/2019: Dinner with @karl` or `2020-2022: COVID-19 Pandemic @jenny/covid @covidtimeline`                                  |
| Comment                                                                                                    | `//[text]`                                                                              | `// this is a comment`                                                                                                      |
