---
outline: [2, 3]
---

<script lang="ts" setup>
import Te from "../../src/TimelineExample.vue"
</script>

# Styling

The timeline visualization consists of several components that can be styled:

| Component                                   | Description                                                        |
| ------------------------------------------- | ------------------------------------------------------------------ |
| [Markers](#markers)                         | The vertical lines that represent time units (days, months, years) |
| [Now Line](#now-line)                       | The line indicating the current time                               |
| [Events](#events)                           | Individual timeline events                                         |
| [Groups and Sections](#groups-and-sections) | Groups and sections                                                |

## Styling Precedence

You can customize the styling of the timeline. The precendence of timeline styling is as follows:

1. Entry defition
2. Tag
3. Header definition
4. Theme (soon)

The timeline has a default theme that, in lieu of other styles being provided, will be used. CSS themes will eventually be supported; those would also fall into this last category of precedence.

Styles defined in the header override any theme styles. Tag definitions override header styles. Individual entry definitions (those that are defined on a specific group or event) override all others.

For example, if an individual event specifies its own style, it overrides any other style declaration lower on the list (tag, header, etc).

## Markers

Markers are the vertical grid lines that divide time units on the timeline.

### Basic Marker Styling

<Te>

```mw
timeline:
  style:
    marker:
      fill: transparent
      fill-opacity: 1
      stroke: var(--color-zinc-300)
      stroke-width: 1
      stroke-opacity: 1
      stroke-dasharray: 2,3

now / 1 day: Hello, world!
```

</Te>

### Hover State Styling

<Te>

```mw
timeline:
  style:
    marker:
      hover:
        fill: transparent
        fill-opacity: 1
        stroke: var(--color-zinc-300)
        stroke-width: 1
        stroke-opacity: 1
        stroke-dasharray: 100,0

now / 1 day: Hello, world!
```

</Te>

### Weekend Markers

<Te>

```mw
timeline:
  style:
    marker:
      weekend:
        fill: rgb(161, 161, 170)

now / 1 day: Hello, world!
```

</Te>

### Dark Mode Support

For all marker properties, you can specify different values for dark mode by adding `.dark` to the property name:

<Te>

```mw
timeline:
  style:
    marker:
      fill: transparent
      fill.dark: #333
      stroke: var(--color-zinc-300)
      stroke.dark: var(--color-zinc-500)
      weekend:
        fill: rgb(161, 161, 170)
        fill.dark: rgb(113, 113, 122)

now / 1 day: Hello, world!
```

</Te>

### Examples

#### Simple Red Markers

<Te>

```mw
timeline:
  style:
    marker:
      stroke: red
      stroke-width: 2

now / 1 day: Hello, world!
```

</Te>

#### Dashed Markers with Hover Effect

<Te>

```mw
timeline:
  style:
    marker:
      stroke: #555
      stroke-dasharray: 4,2
      stroke-opacity: 0.5
      hover:
        stroke: #000
        stroke-opacity: 1
        stroke-dasharray: 0

now / 1 day: Hello, world!
```

</Te>

#### Highlighting Weekends

<Te>

```mw
timeline:
  style:
    marker:
      stroke: #ddd
      weekend:
        fill: rgba(200, 220, 255, 0.3)

now / 1 day: Hello, world!
```

</Te>

#### Dark Mode Optimized

<Te>

```mw
timeline:
  style:
    marker:
      stroke: #333
      stroke.dark: #aaa
      stroke-opacity: 0.4
      stroke-opacity.dark: 0.6
      weekend:
        fill: rgba(100, 100, 120, 0.2)
        fill.dark: rgba(70, 70, 100, 0.3)

now / 1 day: Hello, world!
```

</Te>

## Now Line

The Now Line is a vertical line that represents the current time on the timeline.

### Basic Now Line Styling

<Te>

```mw
timeline:
  style:
    nowLine:
      stroke: var(--color-blue-300)
      stroke-width: 2
      stroke-opacity: 1

now / 1 day: Hello, world!
```

</Te>

### Dark Mode Support

For all Now Line properties, you can specify different values for dark mode by adding `.dark` to the property name:

<Te>

```mw
timeline:
  style:
    nowLine:
      stroke: var(--color-blue-300)
      stroke.dark: var(--color-slate-400)
      stroke-width: 2
      stroke-width.dark: 3
      stroke-opacity: 1
      stroke-opacity.dark: 0.8

now / 1 day: Hello, world!
```

</Te>

### Examples

#### Bold Red Now Line

<Te>

```mw
timeline:
  style:
    nowLine:
      stroke: red
      stroke-width: 3

now / 1 day: Hello, world!
```

</Te>

#### Subtle Now Line

<Te>

```mw
timeline:
  style:
    nowLine:
      stroke: #888
      stroke-width: 1
      stroke-opacity: 0.5

now / 1 day: Hello, world!
```

</Te>

#### Dark Mode Optimized Now Line

<Te>

```mw
timeline:
  style:
    nowLine:
      stroke: rgba(59, 130, 246, 0.7)
      stroke.dark: rgba(226, 232, 240, 0.8)
      stroke-width: 2
      stroke-opacity: 0.8
      stroke-opacity.dark: 1

now / 1 day: Hello, world!
```

</Te>

## Events

### Event Title Styling

<Te>

```mw
timeline:
  style:
    event:
      title:
        color: var(--color-blue-800)
        color.dark: var(--color-blue-200)
        font-weight: 700

now / 1 year: Hello, world! 50%
```

</Te>

### Event Date Styling

<Te>

```mw
timeline:
  style:
    event:
      date:
        color: var(--color-zinc-600)
        color.dark: var(--color-zinc-300)
        font-weight: 500
        font-size: 12

now / 1 year: Hello, world! 50%
```

</Te>

### Event Bar Styling

<Te>

```mw
timeline:
  style:
    event:
      bar:
        fill: var(--color-blue-500)
        fill.dark: var(--color-blue-600)
        stroke: var(--color-blue-600)
        stroke.dark: var(--color-blue-500)
        fill-opacity: 0.3
        stroke-opacity: 0.8
        drop-shadow: drop-shadow-md

now / 1 year: Hello, world! 50%
```

</Te>

### Event Bar Detail State

The detail state is used when an event is selected.

<Te>

```mw
timeline:
  style:
    event:
      bar:
        detail:
          fill-opacity: 0.6
          fill-opacity.dark: 0.7

now / 1 year: Hello, world! 50%
```

</Te>

### Progress Indicator (Percent Bar)

<Te>

```mw
timeline:
  style:
    event:
      percentBar:
        fill: var(--color-green-600)
        fill.dark: var(--color-green-500)
        stroke: var(--color-green-700)
        stroke.dark: var(--color-green-400)
        fill-opacity: 0.7
        stroke-opacity: 1

now / 1 year: Hello, world! 50%
```

</Te>

### Progress Indicator Hover and Detail States

<Te>

```mw
timeline:
  style:
    event:
      percentBar:
        hover:
          fill-opacity: 0.9
          fill-opacity.dark: 1
        detail:
          fill-opacity: 0.9
          fill-opacity.dark: 1

now / 1 year: Hello, world! 50%
```

</Te>

### Dark Mode Support

As with other components, all event styling properties support dark mode by adding `.dark` to the property name.

## Groups and Sections

### Basic Group Styling

<Te>

```mw
timeline:
  ranges: [20 days]
  style:
    group:
      fill: var(--color-zinc-400)
      fill.dark: var(--color-zinc-500)
      fill-opacity: 0.1
      fill-opacity.dark: 0.1
      stroke: var(--color-zinc-500)
      stroke.dark: var(--color-zinc-400)
      stroke-width: 1
      stroke-opacity: 0.3
      stroke-dasharray: 200,0

now / 1 day: Hello, world!

group Group
  now / 2 days: First event in group
  3 days / 2 days: Second event in group
```

</Te>

### Group Text Styling

You can customize how the group titles appear:

<Te>

```mw
timeline:
  ranges: [20 days]
  style:
    group:
      text:
        color: var(--color-zinc-800)
        color.dark: var(--color-zinc-100)
        fill: var(--color-zinc-300)
        fill.dark: var(--color-zinc-700)
        font-size: 0.875rem
        font-weight: 600

now / 1 day: Hello, world!

group Group
  now / 2 days: First event in group
  3d / 2 days: Second event in group
```

</Te>

### Group Hover State

Define how groups appear when users hover over them:

<Te>

```mw
timeline:
  ranges: [20 days]
  style:
    group:
      hover:
        fill: var(--color-zinc-400)
        fill.dark: var(--color-zinc-500)
        fill-opacity: 0.2
        fill-opacity.dark: 0.2
        stroke: var(--color-zinc-500)
        stroke.dark: var(--color-zinc-400)
        stroke-width: 1
        stroke-opacity: 0.5
        stroke-dasharray: 300,0
        text:
          color: var(--color-zinc-900)
          color.dark: var(--color-zinc-50)
          fill: var(--color-zinc-50)
          fill.dark: var(--color-zinc-700)

now / 1 day: Hello, world!

group Group
  now / 2 days: First event in group
  3d / 2 days: Second event in group
```

</Te>

### Group Detail State

The detail state is used when a group is selected or in focus:

<Te>

```mw
timeline:
  ranges: [20 days]
  style:
    group:
      detail:
        fill: var(--color-zinc-300)
        fill.dark: var(--color-zinc-500)
        fill-opacity: 0.2
        fill-opacity.dark: 0.2
        stroke: var(--color-zinc-400)
        stroke.dark: var(--color-zinc-300)
        stroke-width: 1
        stroke-opacity: 1
        stroke-dasharray: 400,0
        text:
          color: var(--color-zinc-900)
          color.dark: var(--color-zinc-50)
          fill: var(--color-zinc-50)
          fill.dark: var(--color-zinc-700)

now / 1 day: Hello, world!

group Group
  now / 2 days: First event in group
  3d / 2 days: Second event in group
```

</Te>

### Dark Mode Support

As with other components, all group styling properties support dark mode by adding `.dark` to the property name.

### Examples

#### Colored Group Sections

<Te>

```mw
timeline:
  style:
    group:
      fill: var(--color-blue-300)
      fill.dark: var(--color-blue-800)
      fill-opacity: 0.15
      fill-opacity.dark: 0.25
      stroke: var(--color-blue-400)
      stroke.dark: var(--color-blue-600)
      stroke-opacity: 0.4
      text:
        color: var(--color-blue-900)
        color.dark: var(--color-blue-100)
        font-weight: 600

now / 1 day: Hello, world!

group Team Alpha
  now / 2 days: Research phase
  3d / 3 days: Development

group Team Beta
  1d / 4 days: Design mockups
  6d / 5 days: Implementation
```

</Te>
