# Visualizations

Markwhen and Meridiem are built to be extensible, primarily in that Meridiem (and other editors) do not assume what kind of visualization will be used from the parsed text.

[List of visualizations](https://github.com/mark-when/visualizations)

|Name|Repo|Link|By|Notes|
|---|---|---|---|---|
|Timeline/gantt|[mark-when/timeline](https://github.com/mark-when/timeline)|[timeline.markwhen.com](https://timeline.markwhen.com)|[markwhen](https://github.com/mark-when)|Timeline and gantt view in one|
|Calendar|[mark-when/calendar](https://github.com/mark-when/calendar)|[calendar.markwhen.com](https://calendar.markwhen.com)|[markwhen](https://github.com/mark-when)|Calendar|
|Map||[map.markwhen.com](https:///map.markwhen.com)|[markwhen](https://github.com/mark-when)|Map|
|Resume|[mark-when/resume](https://github.com/mark-when/resume)|[resume.markwhen.com](https://resume.markwhen.com)|[markwhen](https://github.com/mark-when)|Specific syntax, see [here](https://github.com/kochrt/kochrt.github.io/blob/master/resume.mw) for an example|

## Making your own view

### View client library

Views communicate with the renderer/editor via [the view client library](http://www.npmjs.com/package/@markwhen/view-client) ([github](https://github.com/mark-when/view-client)).

The simplest implementation of a markwhen view would look something like the following:

```html
<html>
  <body>
    <div id="container"></div>
    <script type="module">
      import { useLpc } from "https://unpkg.com/@markwhen/view-client/dist/index.js";

      const { postRequest } = useLpc({
        state: (newState) => {
          document.getElementById("container").innerHTML =
            JSON.stringify(newState);
        },
      });

      postRequest("state");
    </script>
  </body>
</html>
```

This is less of a "visualization" more than it is "spitting out the entire app state into html." We request a state update, and, when we get a state update, we set the innerHTML of our only `div` to be the whole state. Useful to get started so you can actually see what data is coming through for you to work with.

Let's break it down: we import `useLpc` from the `view-client` library (`LPC` like "remote procedure call" except it's local instead of remote). `useLpc` takes an object of listeners, all of which are optional:

```ts
interface MessageTypes {
  state: State;
  setHoveringPath: EventPath;
  setDetailPath: EventPath;
  setText: {
    text: string;
    at?: {
      from: number;
      to: number;
    };
  };
  showInEditor: EventPath;
  newEvent: {
    dateRangeIso: DateRangeIso;
    granularity?: DateTimeGranularity;
    immediate: boolean;
  };
  editEventDateRange: {
    path: EventPath;
    range: DateRangeIso;
    scale: DisplayScale;
    preferredInterpolationFormat: DateFormat | undefined;
  };
  jumpToPath: {
    path: EventPath;
  };
  jumpToRange: {
    dateRangeIso: DateRangeIso;
  };
}

type MessageListeners = {
  [Property in keyof MessageTypes]?: (
    event: MessageTypes[Property]
  ) => any;
};

export function useLpc(listeners?: MessageListeners) { ... }
```

The type of each entry in the `MessageTypes` interface is the type of the parameter that can come through as a message, either to the hosting app or, more likely, from the hosting app (hosting app meaning the view container; [this](https://github.com/mark-when/markwhen)).

In our simple example, we only have a listener for `state` updates. `state` updates contain information both on the state of the app (is dark mode on, if one of the events is currently selected, which page we're on, etc.) as well as the parsed markwhen document. These are contained in `state.app` and `state.markwhen` respectively.