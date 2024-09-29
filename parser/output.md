# Output

The parser produces an array of timelines and associated metadata:

```js
const mw = parse(`title: my timeline
now: my birthday`);

console.log(JSON.stringify(mw));

// { events: ... }
```

```ts
export interface Timeline {
  ranges: Range[];
  foldables: { [index: number]: Foldable };
  events: EventGroup;
  header: any;
  ids: IdedEvents;
  metadata: TimelineMetadata;
}
```

```ts
export interface TimelineMetadata {
  earliestTime: DateTimeIso;
  latestTime: DateTimeIso;
  startLineIndex: number;
  startStringIndex: number;
  endLineIndex: number;
  endStringIndex: number;
  maxDurationDays: number;
  preferredInterpolationFormat: string | undefined;
}
```

Events are kept in a tree structure. To facilitate traversing and dealing with nodes, you can use utility functions from the parser library:

```js
import {
  iter,
  get,
  getLast,
  flat,
  flatMap,
  isEvent,
} from "@markwhen/parser";

const mw = parse(...)

// Use `iterate` to iterate through the tree
for (const { path, eventy } of iter(mw)) {
  // Here, path is the path to the event or event group
}

// Path in the tree.
const path = [3, 1, 0]
const specificNode = get(mw, path)

// The rightmost node of the tree
const lastInTree = getLast(mw)

// Groups and sections are flattened to return an array of events only
const eventsOnly = flat(mw)

const eventTitles = flatMap(mw, (event) => event.firstLine.datePart)

// Determine whether an eventy has an event as its value
const event = isEvent(mw)
```

## Paths

Events and groups are often referred to by their paths in the tree, **starting from the root, or top, of the tree**.

For example, say we have the following markwhen document:

```
Path        Text
--------------------------------
[0]         2008: Entrance exam

[1]         group Education
[1, 0]      2009: Start school

[1, 1]      group Sophomore year
[1, 1, 0]   2010: Advanced classes
            endGroup

[1, 2]      2011: More classes
            endGroup

[2]         2012: New job

```

Since we are essentially dealing with arrays of arrays of arrays ad infinitum, we can refer to values by their indicies.

For example, going **up** the tree, `2010: Advanced classes` is the first element (index `0`) of the second element (index `1`) of the second element (index `1`) of the top level tree. Since we have a reference to the head of the tree, we can refer to that event by its path going **down**: `[1, 1, 0]`.

That is, to get to `2010: Advanced classes` from the root of the tree, we take the item at index `1`, and then the item at index `1` of that array, and then the item at index `0` of that array.

Another view of the tree, viewing it as an actual array of arrays (in pseudocode):

```
markwhen =
["2008: Entrance exam",
  "group Education": [
    "2009: Start school",
    "group Sophomore year": [
      "2010: Advanced classes"
    ],
    "2011: More classes",
  ],
  "2012: New job"
]
```

If we were indexing into the array to get to the value of "2010: Advanced classes", we would say `markwhen[1][1][0]`, therefore its path is `[1, 1, 0]`.

An invalid path for this tree would be `[0, 0]`, since the first element is not an array and therefore cannot be indexed into.
