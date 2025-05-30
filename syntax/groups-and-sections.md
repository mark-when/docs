# Groups and Sections

![](/images/groups.gif)

Events can be grouped. To indicate a group, write `group` or `section` at the beginning of a line. End a group or section with the keyword `endSection` or `endGroup`. All events up to the ending keyword or the end of the page (whichever comes first) are in the group.

For example,

```mw
group The 90s // The title for this group is "The 90s"

  1991: Desert Storm
  1994: Friends premiered
  05/14/1998: Series finale of Seinfeld

  // Nested groups are allowed
  group The 2000s

    03/2005: Premiere of The Office (US)

  // Explicitly end the inner group
  endGroup

  2020: Pandemic

endGroup

// This event is not part of a group
2022: Other things happen
...
```

Sections behave similarly though extend to the width of the entire timeline and are activated by the `section` and `endSection` keywords:

![](/images/sections.gif)

The only difference between sections and groups are how they are styled by the [visualization](/visualizations).

Read more about how groups are handled by the [parser](/parser).
