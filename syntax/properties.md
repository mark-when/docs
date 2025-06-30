# Properties

Events, groups, and sections can all have optional properties. Properties are key-value pairs of the form `key: value` that are **immediately after the first line** of an event or group definition, i.e.

```mw{2,3}
2025-04-30: Carpooling to work
  riders: [Tom, Jerry]
  fee: $4

  Some day I'll have my own car
```

::: tip Indentation
While some of examples are indented (like above), indentation in markwhen is optional.
:::

In this example, `riders: [Tom, Jerry]` is one key-value pair and `fee: $4` is another. They are stored in the `event.properties` field as an object and may be used by visualizations. **Properties must follow on the line(s) after the event or group definition.** You can't put properties at the end of an event description or in the middle of it.

::: warning Warning
Unlike the [header](/syntax/header), event properties cannot use multiline list syntax for arrays -- the dash syntax will be interpreted as a list as part of the event description. You'll need to use [flow style](https://www.yaml.info/learn/flowstyle.html) if you want an array value for an event or group property:

##### 🚫 This won't work:

```mw
2025-09-04: Meeting
  recipients:
    - Melissa
    - Roger
    - Don
```

##### ✅ This will work:

```mw
2025-09-04: Meeting
  recipients: ["Melissa", "Roger", "Don"]
```

:::

## Timezone

`timezone` or `tz` is a special property of an event to set its timezone specifically:

```mw{2,5}
2025-08-03 10am: Meeting
timezone: America/Los_Angeles

2025-08-04 11am: Return flight
tz: -5
```

## Event id

[Event ids](/syntax/dates-and-ranges#event-ids) can be used to create relative dates and let subsequent events refer to it:

```mw{2}
2025-08-03 10am: Meeting
id: meeting
```

## Prop Order

There is an additonal field on groups and events, `propOrder`, which is a `string[]` of keys in the order that they were defined in the document.

For example in the following markwhen document:

```mw
2026: Event
fun: yes
travel: ['America', 'Europe', 'Africa']
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
