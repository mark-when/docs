# Commands

Commands are custom code that you write that can be executed from the command menu or from the editor. Add and edit commands from the Settings menu.

## Command signature

Commands are async functions that are called by the user (you). They are given a `context` parameter:

```ts
import type { Timeline } from "@markwhen/parser";
import { EditorSelection, TransactionSpec } from "@codemirror/state";

type CommandContext = {
  text: string;
  markwhen: Timeline;
  editor: {
    selections: EditorSelection;
  };
};

type CommandResult = TransactionSpec | string | undefined;

async function command(
  context: CommandContext
): CommandResult | Promise<CommandResult> {
  // Your command code is pasted here
}
```

::: info
See the [codemirror documentation](https://codemirror.net/docs) and [markwhen parser documentation](https://docs.markwhen.com/parser/playground.html) for more information about `EditorSelection` and `TransactionSpec` from CodeMirror, and `Timelines`, respectively.
:::

### Command Context

The `context` parameter contains the raw text of the current document in `context.text`. This can be useful for getting the actual text from specific ranges specified by the result of the parse, which is in `context.markwhen`. For example, you can get the actual text of an event by `substring`ing `context.text` from a range:

```ts
const root = context.markwhen.events.value;
// This is contrived, there may or may not be an event here
// (it could be a group or section)
const { from, to } = root[0].value.rangeInText;
const eventText = context.text.substring(from, to);
// Do something with `eventText`...
```

The `context` also gives the editor's current selection in `context.editor.selections`. You can use this to perform actions based on what is selected. For example, we can find out which event the cursor is in:

```js
function isEventNode(node) {
  return !Array.isArray(node.value);
}

function* walk(node, path) {
  yield { node, path };
  if (node && !isEventNode(node)) {
    const arr = node.value;
    for (let i = 0; i < arr.length; i++) {
      yield* walk(arr[i], [...path, i]);
    }
  }
}

const nodeFromStringIndex = (cursor) => {
  let bestSoFar = undefined;
  for (const { path, node } of walk(context.markwhen.events, [])) {
    const stringIndex = isEventNode(node)
      ? node.value.rangeInText.from
      : node.rangeInText?.from;
    if (stringIndex !== undefined) {
      if (stringIndex > cursor) {
        return bestSoFar;
      } else {
        bestSoFar = node;
      }
    }
  }
};

const selectedNode = nodeFromStringIndex(context.editor.selections.main.from);
// Do something with `selectedNode`...
```

::: info
Because `isEventNode`, `walk`, and `nodeFromStringIndex` are so useful, they are built in and already callable from commands you write - you do not have to rewrite them! `nodesFromSelection` is another built-in function that returns nodes that are within the editor's current selection (see below for code).
:::

### Returning a result

A `CommandResult` may be a CodeMirror `TransactionSpec`, a `string`, or `undefined`. If `undefined`, no actions are taken. If a `string` is returned, **the entire document is replaced with the string**.

Generally, however, you will probably want to be more precise with the changes you make to the document. For those cases you can return a [`TransactionSpec`](https://codemirror.net/docs/ref/#state.TransactionSpec). In it, you can define text to be inserted or new selections to be made:

```js
// Inserts 'Hello, World!' at the beginning of the document
return {
  changes: [{
    insert: 'Hello, World!',
    from: 0,
    // to: 99 // <- uncommenting this would replace everything from 0 to 99 in the current document with the inserted text
  }]
}
```

## Accessible Libraries

### Luxon

[Luxon](https://moment.github.io/luxon/#/) is a date/time library that is helpful for working with dates and times. It can be accessed in commands via `luxon`:

```js
const now = luxon.DateTime.now()
```

## Built in functions

The following functions are built in and can be accessed from any command you write. The code is here for your reference:

::: code-group

```js [isEventNode]
function isEventNode(node) {
  return !Array.isArray(node.value);
}
```

```js [walk]
function* walk(node, path) {
  yield { node, path };
  if (node && !isEventNode(node)) {
    const arr = node.value;
    for (let i = 0; i < arr.length; i++) {
      yield* walk(arr[i], [...path, i]);
    }
  }
}
```

```js [nodeFromStringIndex]
const nodeFromStringIndex = (cursor) => {
  let bestSoFar = undefined;
  for (const { path, node } of walk(context.markwhen.events, [])) {
    const stringIndex = isEventNode(node)
      ? node.value.rangeInText.from
      : node.rangeInText?.from;
    if (stringIndex !== undefined) {
      if (stringIndex > cursor) {
        return bestSoFar;
      } else {
        bestSoFar = node;
      }
    }
  }
};
```

```js [nodesFromSelection]
const nodesFromSelection = () => {
  const nodes = [];
  const selection = context.editor.selections.main;
  for (const { path, node } of walk(context.markwhen.events, [])) {
    const startIndex = isEventNode(node)
      ? node.value.rangeInText.from
      : node.rangeInText?.from;
    const endIndex = isEventNode(node)
      ? node.value.rangeInText.to
      : node.rangeInText?.to;
    if (
      startIndex !== undefined &&
      endIndex !== undefined &&
      endIndex > selection.from &&
      startIndex < selection.to
    ) {
      nodes.push(node);
    }
    if (startIndex > selection.to) {
      break;
    }
  }
  return nodes;
};
```

:::

## Examples

::: code-group

```js [Hello world]
return {
  changes: [
    {
      insert: "Hello, world!",
      from: 0,
    },
  ],
};
```

```js [Remove vowels]
const selection = context.editor.selections.main;

if (selection.from === selection.to) {
  return;
}

const selectedText = context.text.substring(selection.from, selection.to);

return {
  changes: [
    {
      insert: selectedText.replaceAll(/[aeiou]/g, ""),
      from: selection.from,
      to: selection.to,
    },
  ],
};
```

```js [Check all checkboxes in event]
const node = nodeFromStringIndex(context.editor.selections.main.from);

if (!node || !isEventNode(node)) {
  return;
}
const { from, to } = node.value.rangeInText;

const eventString = context.text.substring(from, to);

const replaced = eventString
  .split("\n")
  .map((s) => {
    return s.replace(/^\s*- \[ ?\]/, "- [x]");
  })
  .join("\n");

return {
  changes: [
    {
      insert: replaced,
      from,
      to,
    },
  ],
};
```
