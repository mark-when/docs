# Markdown-like

Markwhen is not markdown, but it is heavily inspired by markdown. Markwhen has its own [parser](https://github.com/mark-when/parser) but does not have a "built in" output format, aside from JSON. This is unlike markdown, which [historically produces `html`](https://daringfireball.net/projects/markdown/). While markdown blocks [correspond to html elements](https://github.github.com/gfm/), there is no analog in markwhen nor is there a preferred rendering for markwhen. The timeline view is the most popular view to render markwhen, but it is not the only one. Remaining agnostic to whatever view is rendering markwhen is a goal of the language.

This distinguishment of markwhen from markdown is on purpose: the content, structure, and most likely desired rendering of markwhen is different than markdown. They are definitly similar, but it is its own type of file.

---

#### Markdown rendering

![](/images/md.png)

#### Markwhen rendering

![](/images/mw.png)

---

::: tip Read more
Read more about what the parser produces and how you can use its intermediate JSON artifact [here](/parser).
:::

## Similarities to markdown

### Goals

Like markdown, markwhen aims to be eminently readable without any additional tooling. [From John Gruber](https://daringfireball.net/projects/markdown/#:~:text=The%20overriding%20design%20goal%20for%20Markdown%E2%80%99s%20formatting%20syntax%20is%20to%20make%20it%20as%20readable%20as%20possible.): `The overriding design goal for Markdown’s formatting syntax is to make it as readable as possible.` So it is with markwhen as well - a markwhen document should be self-explanatory without the need for it to be rendered or processed. With that and a general desire for compatibility in mind, here's what is familiar to both markwhen and markdown:

### Forgiveness

Like markdown, the markwhen parser is quite forgiving (though that doesn't mean it will fix your mistakes) Almost any text file can be parsed with the markwhen parser and it will produce _something_.

### Links

```
[link text](http://example.com)
```

### Images

```
![alt text](http://example.com/image.png)
```

### Lists

```
- list item 1
- list item 2
```

### Checklists

```
- [] not done
- [x] done
```

### Frontmatter

::: info
An important difference from markdown with regards to frontmatter is that markwhen does not require frontmatter to be sandwiched between three dashes `---` - read more [here](/syntax/header).
:::

```
---
title: My markwhen document
author:
  name: Bob Smith
---

... rest of document ...

```

## Differences from markdown

- No support for multiline blocks, like code blocks or tables