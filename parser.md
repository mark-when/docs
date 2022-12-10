<script setup>

import Parser from "./src/Parser.vue"

</script>

# Parser

[Markwhen parser on github](https://github.com/mark-when/parser)

## Playground

<Parser/>

## Output

The parser produces an array of timelines and associated metadata:

```js
const mw = parse(`title: my timeline
now: my birthday`);

console.log(JSON.stringify(mw));

// { timelines: ... }
```

```ts
export interface Timeline {
  ranges: Range[];
  foldables: { [index: number]: Foldable };
  events: Node<NodeArray>;
  head?: SomeNode;
  tail?: SomeNode;
  tags: Tags;
  ids: IdedEvents;
  metadata: TimelineMetadata;
}
```

```ts
export interface TimelineMetadata {
  earliestTime: DateTimeIso;
  latestTime: DateTimeIso;
  dateFormat: string;
  startLineIndex: number;
  startStringIndex: number;
  endLineIndex: number;
  endStringIndex: number;
  title?: string;
  description?: string;
  maxDurationDays: number;
  preferredInterpolationFormat: string | undefined;
  view: string[];
  edit: string[];
}
```

Events are kept in a tree structure of nodes, where a node value is either an event or an array of more nodes:

```ts
export type SomeNode = Node<NodeValue>;
export type NodeArray = Array<SomeNode>;
export type NodeValue = NodeArray | Event;
export type GroupRange = (DateRange & { maxFrom: DateTime }) | undefined;

export class Node<T extends NodeValue> {
  constructor(value: T) {
    this.value = value;
  }

  value: T;

  tags?: string[];
  title?: string;
  range?: GroupRange;
  startExpanded?: boolean;
  style?: GroupStyle;
  rangeInText?: Range;
}
```

To facilitate traversing and dealing with nodes, you can use utility functions from the parser library:

```js
import {
  iterate,
  get,
  getLast,
  flat,
  flatMap,
  isEventNode,
} from "@markwhen/parser/lib/Noder";

const mw = parse(...)

// Use `iterate` to iterate through the tree
for (const { path, node } of iterate(mw)) {
  // Here, path is the path to the node
}

// Path in the tree.
const path = [3, 1, 0]
const specificNode = get(mw, path)

// The rightmost node of the tree
const lastInTree = getLast(mw)

// Groups and sections are flattened to return an array of events only
const eventsOnly = flat(mw)

const eventTitles = flatMap(mw, (node) => node.value.dateText)

// Determine whether a node has an event as its value
const eventNode = isEventNode(mw)
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