# Tags

Events in markwhen can be tagged with the `#` syntax:

```mw
2020: Mostly uneventful year #covid
```

Here, the event has the tag `#covid`. In views that support different colors, this event will have a distinct color from other, untagged events.

## Colors

You can specify a tag's color in the header:

```mw
---
#covid: blue
---

2020: Mostly uneventful year #covid
```

## Multiple tags

Events, groups, and sections all support multiple tags, but their behavior with given properties becomes undefined -- or at least less defined.

Basically, do not expect smart merging of tags' properties:

```mw
#school: red
#work: yellow

2021: Was working while in school #school #work
```

Events tagged with both `#school` and `#work` will not be colored orange because `#school` is red and `#work` is yellow. It will be one or the other. Similarly with timezones -- an event can't simultaneously have two different timezones. You should be specific with your tags.
