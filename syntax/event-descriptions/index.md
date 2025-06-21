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

Event descriptions can include [tags](#tags), [links](#links), [photos](#photos), and [references](#references).

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
