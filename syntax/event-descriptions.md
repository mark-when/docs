# Event Descriptions

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

Everything not on the first line (where the date range is specified) up to the next event will be put in an overflow box that can be expanded by clicking on the event - except [properties](#properties). Such an overflow is indicated in the timeline with an ellipsis (...). Event descriptions can include [tags](#tags), [links](#links), [photos](#photos), and [references](#references).

## Properties

Events, groups, and sections can all have optional properties. Properties are key-value pairs that are immediately after the first line of an event or group definition, i.e.

```
2025-04-30: Carpooling to work
riders: Tom, Jerry
fee: $4

Some day I'll have my own car
```

In this example, `riders: Tom, Jerry` is one key-value pair and `fee: $4` is another. They are stored in the `event.properties` field as a map and may be used by visualizations. Properties must follow on the line(s) after the event or group definition; you can't put properties at the end of an event description or in the middle of it.

## Tags

Events can be tagged to visually indicate they belong to some category. Simply add your tag text in any part of an event's description to tag it:

```
2022: Happy 95th Birthday Queen Elizabeth #UK #Royalty
```

A list of all tags appears at the bottom of the screen to allow for filtering by tags.

## Links

Links are similar to markdown links: link display text in brackets followed by the url in parentheses:

```
2018 - 3 years: [Google](www.google.com)
```

## Locations

For vizualizations that support locations, add a property to the event:

```
09/2018: Road trip to Seattle
locations: Devil's Tower, Glacier National Park, Seattle
```

```
1999-05-25: A fond memory
location: Sam's bar and grill
```

## Photos

Markdown-style images are supported: `![optional alt text](image link)`

## References

Link to other timelines with the `@` syntax:

```
1919: Treaty of Versailles @wwi
```

## Task list

Markdown task lists are supported:

```
now: Things to do
- [ ] unfinished task
- [x] finished task
```

When no [percent](#percent) is present, the completion ratio of tasks will be used to represent the percent complete and will be indicated in the event bar.

## Percent

Indicate that an event is some percent complete by including `0`-`100%` in your event, and the event bar will be partially filled in to show the completion percentage.

![](/images/percents.png)
