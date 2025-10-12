---
outline: [2, 3]
---

<script lang="ts" setup>
import Te from "../../src/TimelineExample.vue"
</script>


# Styling

The timeline visualization consists of several components that can be styled:

| Component | Description | Status |
|-----------|-------------|--------|
| [Markers](#markers) | The vertical lines that represent time units (days, months, years) | ✅ Documented |
| [Now Line](#now-line) | The line indicating the current time | ✅ Documented |
| Events | Individual timeline events | 🚧 Coming soon |
| Groups | Collections of events | 🚧 Coming soon |
| Eras/Milestones | Special highlighted periods or points | 🚧 Coming soon |

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
