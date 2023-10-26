
# Timezones

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

