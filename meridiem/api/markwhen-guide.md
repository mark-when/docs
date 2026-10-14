# Markwhen document guide

Meridiem stores plain-text documents. Use `.mw` for Markwhen timelines and schedules; use `.md` for Markdown notes, prose, and documentation. Markwhen is a Markdown-like timeline language, not a Markdown table of dates.

When calling document tools, pass raw source text, without an enclosing Markdown code fence. Preserve the existing document format when editing.

## Basic Markwhen syntax

An event begins with a date or date range, a colon, and its description. Additional description lines follow the event. Prefer ISO dates (`YYYY-MM-DD`) to avoid ambiguous numeric dates.

```mw
---
title: Project plan
timezone: America/New_York
---

# Planning

2026-10-14: Project kickoff #milestone
Discuss goals and responsibilities.

2026-10-15 / 2026-10-16: Design review
- [ ] Review proposals
- [ ] Record decisions

## Implementation

2026-10-19: Begin implementation
```

The optional YAML header contains metadata such as title and timezone. Delimit it with `---`. Sections use Markdown headings (`#` through `######`); a heading of the same or higher level closes the previous section. Tags such as `#milestone` label events. Event descriptions can contain Markdown, including checklists and links.

## Markdown documents

For `.md`, write ordinary Markdown headings, paragraphs, lists, and links. Use `.mw` when the user wants events rendered as a timeline or schedule.

## More documentation

Consult the detailed syntax documentation before using advanced features such as recurrence, relative dates, custom date formats, or tag configuration.

- [Syntax](https://docs.markwhen.com/syntax/)
- [Dates and ranges](https://docs.markwhen.com/syntax/dates-and-ranges)
- [Event descriptions](https://docs.markwhen.com/syntax/event-descriptions/)
- [Sections](https://docs.markwhen.com/syntax/sections)
- [Header and frontmatter](https://docs.markwhen.com/syntax/header)
- [Documentation index for agents](https://docs.markwhen.com/llms.txt)
- [Full documentation bundle](https://docs.markwhen.com/llms-full.txt)
