# Collaborative editing

<div style="padding-top: 0.25rem; padding-bottom: 0.25rem;">
  <SubscriptionPillButtons />
</div>

![](/images/team3.png)

Markwhen shared via `app.markwhen.com` support live collaborative editing - simply share the link with those you want to collaborate with.

To let anyone view and edit your document, add the following in the header:

```
view: 
  - \*
edit:
  - \*
```

To restrict editing and viewing to specific people, set those specific email addresses in the view and/or edit fields:

```
edit: 
  - jim@company.com
  - susan@example.com
```