# Sections

Events can be organized into sections using markdown-style headers. Use `#` through `######` (1-6 hash marks) to create sections at different nesting levels.

Sections automatically close when:
- A section of the same or higher level (fewer or equal `#` marks) is encountered
- The end of the document/page is reached

For example,

```mw{1,7,12,16}
# The 90s

1991: Desert Storm
1994: Friends premiered
05/14/1998: Series finale of Seinfeld

## The 2000s

03/2005: Premiere of The Office (US)

// The 2000s section auto-closes when The 2010s starts
## The 2010s

2020: Pandemic


// This starts a new top-level section
# Other Events

2022: Other things happen
...
```

The number of `#` marks determines the nesting level - `#` is the outermost level, `##` is nested inside `#`, and so on up to `######`.

## Sections vs Groups

By default, sections are rendered as "groups" - collapsible containers for events. You can change the visual style using the `style` property:

```mw
# My Section
style: section

2024: Event in section-styled container
```

When `style: section` is set, the section extends to the full width of the timeline:

Read more about how sections are handled by the [parser](/parser).
