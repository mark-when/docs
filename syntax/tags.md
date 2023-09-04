<script setup>
import SubscriptionPillButtons from "../src/SubscriptionPillButtons.vue"

</script>

# Tags

Events in markwhen can be tagged with the `#` syntax:

```
2020: Mostly uneventful year #covid
```

Here, the event has the tag `#covid`. In views that support different colors, this event will have a distinct color from other, untagged events.

## Colors

You can specify a tag's color in the header:

```
---
#covid: blue
---

2020: Mostly uneventful year #covid
```

## Timezones

Tags can indicate additional information aside from color. Say you took a trip to a different country and want to tag all events that took place there:

```
---
#covid: blue
#london: green
---

2020: Mostly uneventful year #covid

group year abroad #london
2023-06-01: the king was coronated or something
...
endGroup
```

Assuming the country you're traveling to is in a different time zone, events in the group `year abroad` will have the "wrong" time zone. We can add `timezone` to the tag's definition in the header:

```
---
#covid: blue
#london:
  color: green
  timezone: Europe/London
---

2020: Mostly uneventful year #covid

group year abroad #london
2023-06-01: the king was coronated or something
...
endGroup
```

Here we have explicitly set the color of the `#london` tag to be `green` and the `timezone` to be `Europe/London`. Now events in our `year abroad` group will have the right zone.

We can (and should) even be more specific by specifying a default zone:

```
---
timezone: America/New_York

#covid: blue
#london:
  color: green
  timezone: Europe/London
---

2020: Mostly uneventful year #covid

group year abroad #london
2023-06-01: the king was coronated or something
...
endGroup
```

This way, any event that isn't otherwise explicitly given a zone will be in the `America/New_York` zone.

Time zones can be specified by their name, like `America/Los_Angeles`, or by a offset, like `+5` or `-3`.

## Reminders

<SubscriptionPillButtons></SubscriptionPillButtons>
Markwhen.com can send you email reminders about events. You can specify reminders on your tags:

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

## Multiple tags

Events, groups, and sections all support multiple tags, but their behavior with given properties becomes undefined -- or at least less defined.

Basically, do not expect smart merging of tags' properties:

```
#school: red
#work: yellow

2021: Was working while in school #school #work
```

Events tagged with both `#school` and `#work` will not be colored orange because `#school` is red and `#work` is yellow. It will be one or the other. Similarly with timezones -- an event can't simultaneously have two different timezones. You should be specific with your tags.
