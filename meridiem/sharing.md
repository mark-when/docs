# Sharing

Markwhen documents shared via Meridiem support live collaborative editing - simply share the link with those you want to collaborate with. Documents are private by default.

## Publicly viewable

To let anyone view your document, add the following in the header:

```mw
meridiem:
  view: "*"
```

## Public access

To let anyone view **and** edit your document, add the following in the header:

```mw
meridiem:
  view: "*"
  edit: "*"
```

::: info
`edit` permissions automatically confer `view` permissions, so the `view` field in the example above is technically superfluous.
:::

## Restriced access

To restrict editing and viewing to specific people, set those specific email addresses in the view and/or edit fields:

```mw
meridiem:
  edit:
    - jim@company.com
    - susan@example.com
```

::: warning Note
Previously, `edit` and `view` fields were top level header items -- that syntax has been deprecated. While that syntax will work in the meantime, you should convert any top level `edit` or `view` fields to be nested under `meridiem`.

#### Previously

```mw
edit:
  - joan@sterlingcooper.com
  - don@sterlingcooper.com
view: "*"
```

#### Now

```mw
meridiem:
  edit:
    - joan@sterlingcooper.com
    - don@sterlingcooper.com
  view: "*"
```

:::
