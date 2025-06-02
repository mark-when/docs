<script setup lang="ts">
import Exposition from "../src/Exposition.vue"
</script>

# Timezones

> Oh man, I don't like timezones
>
> &mdash; Rob Koch, Markwhen creator and maintainer

We can (and should) specify a timezone for our markwhen documents by adding a `timezone` or `tz` header entry and similar for events:

```mw{2,13}
---
timezone: America/New_York

#covid: blue
#london:
  color: green
---

2020: Mostly uneventful year #covid

group year abroad #london
  2023-06-01: the king was coronated
    timezone: Europe/London
  ...
endGroup
```

This way, any event that isn't otherwise explicitly given a zone, like `2023-06-01: the king was coronated` is, will be in the `America/New_York` zone.

Time zones can be specified by their name, like `America/Los_Angeles`, or by a offset, like `+5` or `-3`.

::: tip Luxon
Much of markwhen's parsing, including timezone parsing, is done with [Luxon](https://moment.github.io/luxon/#/). Read more about timezones on [luxon's documentation](https://moment.github.io/luxon/#/zones)
:::

::: warning When to specify a timezone
The general advice is you should always specify a timezone - less ambiguity is better. Otherwise, you should specify a timezone if or when you start to use markwhen for things like calendaring or keeping track of responsibilities, where your events are measured in hours and minutes instead of days, months, and years.

:::
