# Commands

Commands are code that you write that can be executed either via keymap or button.

![](/images/commands1.png)
![](/images/commands2.png)

## Built in functions

The following functions are built in and can be accessed from any command you write:

```js
function isEventNode(node) {
  return !Array.isArray(node.value)
}

function* walk(node, path) {
  yield { node, path };
  if (node && !isEventNode(node)) {
    const arr = node.value
    for (let i = 0; i < arr.length; i++) {
      yield* walk(arr[i], [...path, i]);
    }
  }
}

const nodeFromStringIndex = (cursor) => {
  let bestSoFar = undefined
  for (const { path, node } of walk(context.markwhen.events, [])) {
    const stringIndex = isEventNode(node)
        ? node.value.rangeInText.from
        : node.rangeInText?.from;
      if (stringIndex !== undefined) {
        if (stringIndex > cursor) {
          return bestSoFar
        } else {
          bestSoFar = node
        }
      }
  }
};
```

## Examples

Insert the text "Hello world" at the beginning of the document:

```js
return {
  changes: [
    {
      insert: "Hello, world!",
      from: 0,
    },
  ],
};
```

Remove all vowels in the selected text:

```js
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
