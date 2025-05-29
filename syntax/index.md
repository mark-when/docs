<script setup lang="ts">
import Exposition from "../src/Exposition.vue"

const expo = [
  [[0, 7], '<a href="/syntax/header">Header</a>'],
  [[8, 10], '<a href="/syntax/groups-and-sections">Section definitions</a>'],
  [[10, 11], 'Comment'],
  [[11, 13], '<a href="/syntax/events">Events</a>'],
  [[13, 18], '<a href="/syntax/event-descriptions">Event description</a>'],
  [[28, 30], '<a href="/syntax/event-descriptions#properties">Event properties</a>']
]

</script>

<Exposition :expo="expo">

```mw
---
title: Project plan

#Project1: #d336b1
#Danielle: yellow
timezone: America/New_York
---

section All Projects
group Project 1 #Project1
// Supports ISO8601
2025-01/2025-03: Sub task #John
2025-03/2025-06: Sub task 2 #Michelle
More info about sub task 2

- [ ] We need to get this done
- [x] And this
- [ ] This one is extra

2025-07: Yearly planning
endGroup

group Project 2 #Project2
2025-04/4 months: Larger sub task #Danielle
contact: imeal@example.com

// Supports American date formats
03/2025 - 1 year: Longer ongoing task #Michelle
assignees: [Michelle, Johnathan]
location: "123 Main Street, Kansas City, MO"

- [x] Sub task 1
- [x] Sub task 2
- [ ] Sub task 3
- [ ] Sub task 4
- [ ] so many checkboxes omg
```

</Exposition>
