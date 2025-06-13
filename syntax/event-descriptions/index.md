# Event Descriptions

An event description is everything after the date range of the event, **up to the next event**. Event descriptions can span multiple lines. For `12/2012: End of the world`, the event description is just `End of the world`. For the following event:

```mw
1961: Year after 1960
Later, 1962 would happen
```

the event description is

```mw
Year after 1960
Later, 1962 would happen
```

Everything not on the first line (where the date range is specified) up to the next event will be put in an overflow box that can be expanded by clicking on the event - except [properties](#properties). Such an overflow is indicated in the timeline with an ellipsis (...). Event descriptions can include [tags](#tags), [links](#links), [photos](#photos), and [references](#references).

## Properties

Events, groups, and sections can all have optional properties. Properties are key-value pairs that are **immediately after the first line** of an event or group definition, i.e.

```mw{2,3}
2025-04-30: Carpooling to work
  riders: Tom, Jerry
  fee: $4

  Some day I'll have my own car
```

::: tip Indentation
While some of examples are indented (like above), indentation in markwhen is optional.
:::

In this example, `riders: Tom, Jerry` is one key-value pair and `fee: $4` is another. They are stored in the `event.properties` field as an object and may be used by visualizations. **Properties must follow on the line(s) after the event or group definition.** You can't put properties at the end of an event description or in the middle of it.

### Prop Order

There is an additonal field on groups and events, `propOrder`, which is a `string[]` of keys in the order that they were defined in the document.

For example in the following markwhen document:

```mw
2026: Event
fun: yes
travel: ['America', 'Europe', 'Africa'],
people: Family
```

The properties of the (only) event are:

```json
{
  "fun": "yes",
  "travel": ["America", "Europe", "Africa"],
  "people": "Family"
}
```

while `propOrder` will be:

```json
["fun", "travel", "people"]
```

You can use `propOrder` to maintain order of property definitions, if desired.

### Timezone

`timezone` or `tz` is a special property of an event to set its timezone specifically:

```mw{2,5}
2025-08-03 10am: Meeting
timezone: America/Los_Angeles

2025-08-04 11am: Return flight
tz: -5
```

### Event id

[Event ids](/syntax/dates-and-ranges#event-ids) can be used to create relative dates and let subsequent events refer to it:

```mw{2}
2025-08-03 10am: Meeting
id: meeting
```

## Tags

Events can be tagged to visually indicate they belong to some category. Simply add your tag text in any part of an event's description to tag it:

```mw
2022: Happy 95th Birthday Queen Elizabeth #UK #Royalty
```

## Links

Links are similar to markdown links: link display text in brackets followed by the url in parentheses:

```mw
2018 - 3 years: [Google](www.google.com)
```

## Locations

For vizualizations that support locations, add a property to the event:

```mw{2,5}
09/2018: Road trip to Seattle
locations: [Devil's Tower, Glacier National Park, Seattle]

1999-05-25: A fond memory
location: Sam's bar and grill
```

## Photos

Markdown-style images are supported: `![optional alt text](image link)`

## Task list

Markdown task lists are supported:

```mw
now: Things to do
- [ ] unfinished task
- [x] finished task
```

## Percent

Indicate that an event is some percent complete by including `0`-`100%` in your event, and the event bar will be partially filled in to show the completion percentage.

![](/images/percents.png)

When no [percent](#percent) is present, the completion ratio of tasks will be used to represent the percent complete and will be indicated in the event bar.
