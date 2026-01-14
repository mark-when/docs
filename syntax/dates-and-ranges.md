<script setup lang="ts">
import Exposition from "../src/Exposition.vue"
</script>

# Dates and Ranges

Markwhen supports a variety of date formats and mechanisms for expressing periods of time.

[Extended date time format](https://www.loc.gov/standards/datetime/) (EDTF) is the recommended syntax for expressing dates and ranges. When parsing, EDTF takes precedence over other date formats mentioned here -- if there is some ambiguity in how a date range is expressed, and it fits the EDTF range format, it will be parsed as EDTF.

Every event has an associated **date range**, whether it has an explicitly written end date or not. A **date range** is a **period from one date to another**.

## EDTF Date

An EDTF date is essentially the first part of a full ISO8601 date, whose regex could be expressed as `\d{4}(-\d{2}(-\d{2})?)?`:

```
1981
2012-05
2022-01-30
```

## EDTF Date Ranges

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

::: warning Note
While the `now` keyword is and will continue to be supported, it is not recommended due to its ambiguity. `now` could mean when the author wrote the markwhen document, it could mean when the document was parsed, etc. Try to use specific dates (i.e., `2025-03-01` instead of just `March`) as much as possible.
:::

## Non-EDTF Dates

Other date formats besides EDTF are supported out of the box. Human readable dates are supported, like `1665`, `03/2222`, `09/11/2001`, `18 March 2026`, `Aug 30 9:45am`, as well as IO8601 dates, like `2031-11-19T01:35:10Z`. Human readable date formatting defaults to the American Month/Day/Year but can be changed to European formatting via the [header](/syntax/header).

## Non-EDTF Date Ranges

A non-EDTF date range is typically `Date[-Date]`; that is, one date optionally followed by a dash (`-`) or the word `to` and another date.

If an end date is not specified, the range is as long as its granularity. For example, the event

```mw
2001: A Space Odyssey
```

starts January 1, 2001, and lasts through December 31, 2001.

| Example                                     | Inferred Range                                   | Explanation                                                                                                                                                                                                                                       |
| ------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2024`                                      | `2024-01-01T00:00:00Z` to `2025-01-01T00:00:00Z` | From the start of 2024 to the end of 2024                                                                                                                                                                                                         |
| `04/1776`                                   | `1776-04-01T00:00:00Z` to `1776-05-01T00:00:00Z` | From the start of April 1776 to the end of April 1776                                                                                                                                                                                             |
| `01/01/2024`                                | `2024-01-01T00:00:00Z` to `2024-01-02T00:00:00Z` | From the start of January 1, 2024, to the end of January 1, 2024 (the whole day).                                                                                                                                                                 |
| `11/11/2024-12/12/2024`                     | `2024-11-11T00:00:00Z` to `2024-12-13T00:00:00Z` | From the start of November 11, 2024, to the end of December 12, 2024.                                                                                                                                                                             |
| `2031-11-19T01:35:10Z-2099-08-04T18:22:48Z` | `2031-11-19T01:35:10Z` to `2099-08-04T18:22:48Z` | Exactly as specific as the ISO dates say.                                                                                                                                                                                                         |
| `January 3 - Apr 6`                         | `2022-01-01T00:00:00Z` to `2022-04-07T00:00:00Z` | As this documentation was written in 2025, the year 2025 is inferred. Note how the range extends to the **end** or April 6, which makes it the beginning of April 7. **This type of date range is discouraged, due to the lack of explicit year** |
| `now - 10 years 6 months 3 days`            | `now` to 10 years, 6 months, and 3 days later    | `now` is whatever time the timeline is **rendered**, not when it was **written**. `10 years 6 months 3 days` is a [relative date](#relative-dates).                                                                                               |
| `3:30pm - 4:30pm`                           | Today's date, from `15:30` to `16:30`            | When a time is by itself, it is based off of the last date seen, or, if there isn't any, today.                                                                                                                                                   |
| `1 Jan 1998 to 11/11/2011 8am`              | `1998-01-01T00:00:00Z` to `2011-11-11T08:00:00Z` |                                                                                                                                                                                                                                                   |
| `Nov 11 02:30`                              | `2011-11-11T02:30:00Z` to `2011-11-11T02:30:00Z` | When a time is specified (hour/minute), the granularity is instant.                                                                                                                                                                               |

::: warning Ambiguous formats

Markwhen is meant to be easy to pick up and immediately useful. Part of that simplicity means including support for dates and date ranges that are probably less specific than they should be. For example, `April 1 - June 18`, `Nov 11 2:30`, and `2020 - now` are all perfectly valid markwhen date ranges but, due to either their lack of year or changing ranges, **will mean something different when parsed in the future**. You should **think twice about using any date syntax that is ambiguous** to ensure it's really what you want.
:::

## Relative Dates

If you have events that are based off of, or relative to, other events, you can describe their relationship to get the range you want.

For example, say you are working on a project tracker. You could outline the phases of your project by using absolute dates, like the following:

```mw
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

```mw
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

## Event IDs

This works well enough for serial dates that are each dependent on the last, but what if we have multiple events that are all dependent on the same event? We can do that using event ids:

```mw{2}
01/01/2023 - 2 weeks: Phase 1 #Exploratory
id: Phase1

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

```mw
2020: Pandemic
2021 - 2023: More pandemic
1 year: Less pandemic?
```

`1 year` is based off the last date seen, which would be `2023`, or, more specifically, the end of `2023`.

This also means that we can base our end date off of our start date:

```mw
12/25/2022: Christmas
5 days - 3 days: New Years' stuff
```

Here, `5 days` is five days after the previously seen date (`12/25/2022`), which would make it `12/30/2022`, while `3 days` is three days after the previous date, which is our start date of `12/30/2022`.

Two relative dates together, like `x days - y weeks: ...`, can therefore essentially be read as `x days after the previous event and lasts for y weeks`.

The only exception to this is the shorthand singular relative date, like `x years:...`, which means `immediately after the last event and lasts for x years`.

## Due dates

In the same way you can represent an event taking place after a prior event, you can indicate that an event should come _before_ another. Let's say we wanted to get some things done before Christmas:

```mw{2}
2022-12-25: Christmas
id: Christmas
before !Christmas 1 month: Buy presents
before !Christmas 2 weeks: Get a tree
```

By using [event ids](#event-ids), we specify the due date, and specify the amount of time before that event. Like all event ids, the id must be defined earlier in the document in order to be able to reference it; something like the following would **not** work:

```mw
before !Christmas 1 month: Buy presents
before !Christmas 2 weeks: Get a tree
2022-12-25: Christmas !Christmas
```

because the event with the id of `!Christmas` is after the events that refer to it. A good way to deal with this is to define the known dates at the start of your timeline and then look at a [sorted view](#sorting) to see them in order.

Similar to relative events that are dependent on preceding events, events with due dates can also have start and end times:

```mw
2022-12-25: Christmas !Christmas
before !Christmas 1 week - 1 month: Buy presents
```

Here, the `Buy presents` event _ends_ 1 week _before_ Christmas, and lasts for 1 month. When dealing with relative events, the first part of the range (if there is one) can be considered the "buffer," while the second part is the duration. If there is only one part (no range; `before !Christmas 1 month` instead of `before !Christmas 1 week - 1 month`), then it will abut the event it is basing itself off of with the specified duration.

Also similarly to other relative events, if no event id is specified, it will be dependent on the previous event.

`Before` and `by` can both be used to represent happening before another event. These are equivalent:

```mw
by !Christmas 1 day: ...
before !Christmas 1 day: ...
```

## Dependencies

We can express both the start and end date of an event as being relative to other events:

```mw{6,7}
2025-09-08: School starts
  id: school
2025-11-23: Thanksgiving break begins
  id: thanksgiving

!school / !thanksgiving: Time in school before break
// == 2025-09-09 / 2025-11-22
```

Here, `!school / !thanksgiving` goes from the end of the `!school` event to the beginning of the `!thanksgiving` event.

Most of the time, this is probably what we want - from the end of the first event to the start of the second. However, what if we want to align the start of two events? Or the end of two events? We can do that simply by using `.start` or `.end` modifiers when referencing event ids:

```mw
2025-11-23 / 2025-11-28: Thanksgiving break
  id: thanksgiving

2025-12-23 / 2026-01-03: Winter break
  id: winter

!thanksgiving.start / !winter.end: Thanksgiving break to winter break, inclusive
// == 2025-11-23 / 2026-01-03
```

We can mix and chain `.start` and `.end` modifiers as much as we want, so long as the resulting date ranges make sense:

```mw
2021-04-09 / 10 days: Steven in London
  id: steven

2021-06-04 / 1 week: Isabella out of office
  id: isabella

2021-06-12 / 2021-06-22: Work trip
  id: trip

!isabella.start - !trip.end: From the start of Isabella being out of office to the end of the work trip

!steven.end / !isabella.end: From the end of Steven in London to the end of Isabella being out of office

by !trip.end 1 year / 1 month: An even lasting one month, that ends one year before the end of the work trip

// Anonymous .start and .end modifiers refer to the previously defined event
.start / 2 months: From the start of the previous event, lasting for 2 months
```

![](/images/dependencies.png)

## Week days

![](/images/weekdays.png)

When using relative dates you can also take advantage of being able to specify `week days` - this calculates durations based on how many non-weekend days it takes.

For example:

```mw
July 13, 2022 - 5 week days: Item estimate
10 week days: Second part of item
```

July 13, 2022 is a Wednesday, and we're counting 5 week days, so we go Wednesday, Thursday, Friday (3), and then the following Monday and Tuesday (2), which gets us to the end of July 19 (technically midnight July 20, a Wednesday).

The second event starts after the first and lasts 10 weekdays, which would take us to two Wednesdays into the future, or 14 calendar days.

`Week`, `work`, and `business` are supported as prefixes to `day` when working with weekdays. These are all equivalent:

```mw
10 business days: ...
10 weekdays: ...
10 work days: ...
```

Week days do not take into account holidays - only weekends. It also assumes a 5 day work week, unfortunately. [Hopefully soon it will be 4 days](https://4dayweek.io).

## Recurring events

To have an event repeat itself some number of times, you can use recurrence syntax between the event range and the event description:

```mw
October 7, 1989 every year for 10 years: ...
2025-03-04 every week for 12 weeks: ...
2022-01/2022-03 every 2 years x9: ...
Feb 1 2023 every 6 months for 10 times: ...
```

Recurrence syntax essentially takes the form of

```
every (duration) (for (number of times | duration)) | x(amount)
```

![](/images/recurring_syntax.png)
![](/images/recurring_timeline.png)
