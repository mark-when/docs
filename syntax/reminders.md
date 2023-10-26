# Reminders (beta)

<SubscriptionPillButtons></SubscriptionPillButtons>
Markwhen.com can send you email reminders about events. If you want to get reminders for all events, specify a top-level entry in your header:

```
---
title: Important meetings
reminders: [1 day]
---

2023-09-08: ...
```

Alternatively you can specify reminders on specific tags, to only receive reminders about events that have that tag:

```
#work:
  reminder: 15 minutes
```

In this case, you will get an email about events tagged with `#work` 15 minutes before they begin.

Instead of a singular duration, you may specify a list of durations, and you will get an email for each one accordingly:

```
#work:
  reminders:
    - 15 minutes
    - 1 hour

#personal:
  reminders: [1 day, 7 days]
```

You may use either `reminder` or `reminders` for your syntax (just don't use both on one tag).

You may get even more specific with your reminders with `beforeBegin`, `afterBegin`, `beforeEnd`, and `afterEnd` that send reminder(s) before or after an event begins or ends:

```
#work:
  color: red
  timezone: America/New_York
  reminders:
    beforeBegin:
      durations: [30 minutes, 15 minutes]
    afterBegin:
      durations:
        - 30 minutes
    beforeEnd: 15 minutes
    afterEnd:
      ...

Sep 8 2023 9am: Suport important meeting #work
```

Note that currently reminders do not work with recurring events - only the first instance of the event will trigger any applicable reminders.

## Set a timezone!

When using reminders, be sure to [set a timezone](/syntax/timezones) in your header. Reminders are set and sent based on the timezone specified in the markwhen file - if it's not set, you will not receive reminders when you expect, or at all.