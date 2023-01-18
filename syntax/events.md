# Events

An event is a [date Range](#dates-and-ranges) followed by a colon followed by an [event description](#event-description):

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

## Quick Reference

| Item                                                                                                       | Syntax                                                                                  | Example                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [Event](/syntax/events)                                                                                    | `[DateRange\|EDTFDateRange]:[EventDescription]`                                         | `08/2015-05/2017: CS degree #Education`                                                                                     |
| [EDTFDateRange](/syntax/dates-and-ranges)                                                                  | `[EDTFDate\|RelativeDate\|now][/EDTFDate\|RelativeDate\|now]`                           | `2004-02-01/2005`, `2005/2006-02`, `2005/now`, `2018/6 months`                                                              |
| [EDTFDate](/syntax/dates-and-ranges#edtf-date)                                                            | `YYYY(-MM(-DD)?)?`                                                                      | `2000-06-01`, `1892`, `1492-01`                                                                                             |
| [DateRange](/syntax/dates-and-ranges#date-ranges)                                                         | `[Date][-Date]`                                                                         | `1998-06/01/2000`                                                                                                           |
| [Date](/syntax/dates-and-ranges#dates). `now` is a special keyword which means what you think it does     | `[HumanDate\|ISO8601\|RelativeDate\|now]`                                               | `01/30/1888`                                                                                                                |
| HumanDate. Defaults to American formatting (Month/Day/Year, can be overridden in [header](/syntax/header)) | `[m/d-]yyyy`                                                                            | `2002` or `01/2002` or `12/25/1901`                                                                                         |
| Casual date.                                                                                               | `(day)?(jan\|feb\|mar\|apr\|may\|jun\|jul\|aug\|sep\|oct\|nov\|dec)(day)?(year)(time)?` | `4 January 1996` or `Oct 8 2012` or `March 16 12:19pm` or `9:15pm` or `06:30`                                               |
| ISO8601 format. The `T` and `Z` are required.                                                              | `YYYY-MM-DD`T`HH:MM:SS:MS`Z                                                             | `1859-05-09T12:01:01Z`                                                                                                      |
| [Relative Date](/syntax/dates-and-ranges#relative-dates) (base this date off of another)                   | `[after] [!eventId] Amount`                                                             | `after !Birthday 3 weeks 2 days`, `2 days - 3 months 4 days 8 seconds`, `!ww1 21 years - 6 years`                           |
| Amount (used in relative dates)                                                                            | `[digit] [milliseconds\|seconds\|minutes\|hours\|days\|weeks\|months\|years]`           | `after !Birthday 3 weeks`, `2 days - 3 months`, `!ww1 21 years - 6 years`                                                   |
| [Event description](#event-description)                                                                    | `([text]\|[Tag]\|[Location]\|[Link])*`                                                  | `07/2014: 4th of July in DC ![](https:/linktomyimage.com/imagelink.png) #Travel @sue @greg [Washington, DC](location)`      |
| [Tag](#tags)                                                                                               | `#[tag name]`                                                                           | `1999: The Matrix #Movies`                                                                                                  |
| [Location](#locations)                                                                                     | `[location name](location\|map)`                                                        | `02/23/1836: Battle of the Alamo (The Alamo, TX)[map]`                                                                      |
| [Link](#links)                                                                                             | `[display text](link)`                                                                  | `05/25/2021: [cascade.page](https://cascade.page) featured on [Hacker News](https://news.ycombinator.com/item?id=27282842)` |
| [Photos](#photos). Markdown-style image format.                                                            | `![optional alt text](image link)`                                                      | `07/2017: 4th of July in DC ![](https://example.com/image.png)`                                                             |
| [Reference](#references). Reference and link to other markwhen pages.                                      | `@[other markwhen name]`                                                                | `09/2019: Dinner with @karl` or `2020-2022: COVID-19 Pandemic @jenny/covid @covidtimeline`                                  |
| Comment                                                                                                    | `//[text]`                                                                              | `// this is a comment`                                                                                                      |
