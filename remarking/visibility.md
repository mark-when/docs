# Visibility

Remark.ing is a follow-first model, there isn't (yet) a "public" feed to see what everyone is posting.

Visibility settings are read from the `remarking.view` field of documents and entries/remarks. To denote that a document should be visible, set `remarking.view` to `"*"`:

```mw{2}
remarking:
  view: "*"
  author:
    name: Bob

// ... rest of header ...

2025-08-09: hello!
```

Same thing with remarks: set `remarking.view` to `"*"`:

```mw{3}
2025-08-09:
remarking:
  view: "*"
```

If you intend for a document's remarks to be generally visible, set `remarking.view` in the document header. You do not need to set `remarking.view` on every entry if the visibility is already set on the document as a whole. 

## Precedence

In the case of conflicting visibility rules, individual entries' rules take precedence over the document's rules. For example, in the following document,

```mw{3,8}
---
remarking:
  view: "*"
---

2025-08-03: this is private
remarking:
  view: none
```

the entry `this is private` will not be visible to others as its `remarking.view` rule overrides the document's rule.

Likewise, if we switch the document's and the entry's rules:

```mw{3,8}
---
remarking:
  view: none
---

2025-08-03: this is public
remarking:
  view: "*"
```

The remark is now visible, overriding the document header.

## Drafts

Denote that an entry is a draft (and therefore not publicly visible) by setting `remarking.draft` to `true` on the entry:

```mw{2,3}
2026-03-12: Thoughts on the most recent things to happen
  remarking:
    draft: true

  I have a lot of thoughts on the most recent things but I'm not ready to share them yet

2026-03-06: Life update
  This post is visible, and that's a normal thing to say about a post
```

If using the Remark.ing UI, this property setting is handled for you when you click the "save" button.

Drafts will not show up in anyone's feed but will show up as drafts beneath the compose area when drafting a new remark.

::: info Note
Meridiem [view permissions](/meridiem/sharing.md), which are about viewing and editing in [Meridiem](/meridiem/index) specifically, are separate from view permissions set for remarking.
:::
