# What Can You Build?

Meridiem OAuth turns markwhen documents into a user-owned data source. Your app can ask for permission, read the user's documents, transform them into a focused experience, and write changes back.

Think of Meridiem as the place where the data stays understandable. Your app can be the specialized interface.

## App ideas

| App | Uses markwhen for | Uses markdown for |
| --- | ----------------- | ----------------- |
| Personal CRM | Contact history, reminders, follow-ups | Contact notes and scripts |
| Field journal | Observations with dates, places, tags | Long-form trip reports |
| Habit tracker | Daily check-ins, streak events | Reflections |
| Publishing tool | Posts, drafts, scheduled entries | Essays and pages |
| Project dashboard | Milestones, decisions, blockers | Project briefs |
| Garden planner | Planting, watering, harvest logs | Care notes |
| Workout log | Sessions, PRs, injuries | Training plans |
| Lightweight CRM | Calls, meetings, deal changes | Account notes |

## Header or event property?

Use the header for settings that apply to the whole document:

```mw
---
crm:
  accountType: customer
  owner: rob
  syncToDashboard: true
---
```

Use event properties for facts about one entry:

```mw
2026-02-12: Call with Acme
  type: call
  sentiment: positive
  next: send proposal
```

Use the event description for human-readable context:

```mw
2026-02-12: Call with Acme
  type: call

They want a smaller pilot before committing to the annual plan.
```

## Designing for users

A good Meridiem app should make the document better, not hide it forever.

- Keep generated text readable in Meridiem.
- Use a namespace for your app's header fields.
- Avoid overwriting user text when an append or header merge is enough.
- Prefer normal markwhen syntax over opaque blobs.
- Let users export, inspect, and edit their own data.

## Start with a recipe

If you know the kind of app you want, start with [App recipes](/meridiem/api/app-recipes). The recipes show common document shapes, scopes, and first API calls.
