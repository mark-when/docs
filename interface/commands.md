# Commands

Commands are code that you write that can be executed either via keymap or button.

![](/images/commands1.png)
![](/images/commands2.png)

## Built in functions

<details><summary>
The following functions are built in and can be accessed from any command you write. The code is here for your reference:
</summary>

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
</details>

## Command library & examples

<details><summary>Insert the text "Hello world" at the beginning of the document</summary>

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
</details>
<details><summary>Remove all vowels in the selected text</summary>

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
</details>
<details><summary>
Check all checkboxes in an event</summary>

```js
const node = nodeFromStringIndex(context.editor.selections.main.from)

if (!node || !isEventNode(node)) {
  return
}
const { from, to } = node.value.rangeInText

const eventString = context
  .text
  .substring(from, to)

const replaced = eventString.split('\n').map(s => {
  return s.replace(/^\s*- \[ ?\]/, "- [x]")
}).join('\n')

return {
  changes: [{
    insert: replaced,
    from, to
  }]
}
```
</details>