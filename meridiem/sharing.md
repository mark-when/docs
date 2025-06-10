# Sharing

Markwhen documents shared via Meridiem support live collaborative editing - simply share the link with those you want to collaborate with. Documents are private by default.

## Publicly viewable

To let anyone view your document, add the following in the header:

```mw
view:
  - \*
```

## Public access

To let anyone view **and** edit your document, add the following in the header:

```mw
view: 
  - \*
edit:
  - \*
```

::: info
`edit` permissions automatically confer `view` permissions, so the `view` field in the example above is technically superfluous.
:::

## Restriced access

To restrict editing and viewing to specific people, set those specific email addresses in the view and/or edit fields:

```mw
edit: 
  - jim@company.com
  - susan@example.com
```