# Syntax

A markwhen document is a simple text file. Its content type is `text/markwhen`; though, when importing from other sources, `text/plain` works fine. A markwhen document is separated into timeline pages via a page break token (`\n_-_-_break_-_-_\n`).

## Timeline

A Timeline page is composed of an optional [header](/syntax/header) and one or more [events](/syntax/events).
