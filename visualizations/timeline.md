<script setup lang="ts">
import Te from "../src/TimelineExample.vue"
</script>

# Timeline

The timeline is the most popular visualization and so gets most of the attention. There are two versions - the "OG" Timeline and just `Timeline` or `Timeline 2`. This documentation is in regards to `Timeline` and not `OG Timeline`. The only real difference is that `OG Timeline` is HTML based whereas the new `Timeline` is SVG based.

The original "OG" timeline can be found [here](https://github.com/mark-when/timeline).

# Configuration

The timeline can be configured through the markwhen file's header. Any configuration that is specific to the timeline will be nested under a `timeline` entry in the header. Reminder that the [header](/syntax/header) is written in [yaml](https://yaml.org/).

## `ranges`

In addition to panning and zooming manually, specify hard-coded ranges to quickly set the timeline to. If `ranges` are specified, the first one will be used as the default starting range when the timeline loads.

<Te>

```mw{2}
timeline:
  ranges: [3 months, 1 year]
```

</Te>

## `center`

Center the starting position of the timeline. Defaults to `now` (that is, the time when the timeline was rendered). Must be an [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) date.

<Te>

```mw{2}
timeline:
  center: 2000
  ranges: [1 year]
```

</Te>

## `style`

Customize the styling of the timeline. The precendence of timeline styling is as follows:

1. Theme
2. Header definition
3. Tag
4. Entry defition

The timeline has a default theme that, in lieu of other styles being provided, will be used. CSS themes will eventually be supported; those would also fall into this first category of precedence.

Styles defined in the header override any theme styles. Tag definitions override header styles. Individual entry definitions (those that are defined on a specific group or event) override all others.

<Te>

```mw
timeline:
  style:
    marker:
      stroke: red
      stroke-opacity: 1
      stroke-width: 3
      stroke-dasharray: 10,1
      fill: #fcf
      fill-opacity: 0.5
      hover:
        fill: black
    nowLine:
      stroke-width: 4
    event:
      font-weight: 600
      font-size: 19
      bar:
        height: 40
        rx: 20
    group:
      fill: red
      stroke: blue
      hover:
        fill.dark: #445
        stroke-opacity: 1

  ranges: [1 year]

now: hello!

```

</Te>

## Eras / Milestones

Tag an event with `#era` or `#milestone` to give it a vertical highlighted background:

<Te>

```mw{6}
timeline:
  ranges: [10 years]
  center: 2019

2016: Harambe
2021 - 2022: Pandemic #era
```

</Te>
