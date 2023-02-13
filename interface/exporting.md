<script setup>
import { computed, reactive, ref } from "vue";

const hwRatioNumerator = ref(100);
const rowHeight = ref("3");
const dark = ref(false);
const showDateText = ref(true);
const showEventTitles = ref(true);
const roundedRight = ref(true);
const roundedLeft = ref(true);
const markers = ref("year");
const scale = ref("1")
const hwRatio = computed(() => hwRatioNumerator.value / 100);

const ito = (string, val) => {
  return val ? { [string]: true } : {}
}
const query = computed(
  () =>
    new URLSearchParams({
      rowHeight: "" + rowHeight.value,
      markers: markers.value,
      scale: scale.value,
      ...ito("dark", dark.value),
      ...ito('showEventTitles', showEventTitles.value),
      ...ito('showDateText', showDateText.value),
      ...ito('roundedLeft', roundedLeft.value),
      ...ito('roundedRight', roundedRight.value)
    })
);
const imgSrc = computed(
  () => `https://markwhen.com/example.svg?${query.value.toString()}`
);
</script>

# Exporting

## Images

Go to the export menu click on `SVG...` to bring up the options to export your timeline to svg.

![](/images/export_svg.png)

## Auto-updating image links

<SubscriptionPillButtons />

If you are a markwhen.com subscriber, you can append `.svg` to your own **public** markwhen.com links to get a svg. It will reflect the latest changes that have been made to that timeline automatically.

Supported query parameters:
|Parameter|Possible value|Example value|
|---|---|---|
|`dark`|`true` or `false`|<input type="checkbox" v-model="dark">|
|`showEventTitles`|`true` or `false`|<input type="checkbox" v-model="showEventTitles"/>|
|`showDateText`|`true` or `false`|<input type="checkbox" v-model="showDateText"/>|
|`rowHeight`| `2` or `3` or `4`|<select v-model="rowHeight"><option>2</option><option>3</option><option>4</option></select>|
|`scale`|`1` to `10`|<select v-model="scale"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select>|
|`roundedLeft`|`true` or `false`|<input type="checkbox" v-model="roundedLeft"/>|
|`roundedRight`|`true` or `false`|<input type="checkbox" v-model="roundedRight"/>|
|`markers`|`decade`, `year`, `month`, `day`, `hour`, `minute`|<select v-model="markers"><option>decade</option><option>year</option><option>month</option><option>day</option><option>hour</option><option>minute</option></select>|

`{{ imgSrc }}`

(give it a second to load...)

<img :src="imgSrc" :style="`height: 15rem; background-color: ${ dark ? 'black' : 'white'};`"/>

### Caveats

- Initial load is slow
- Groups are not supported

## Text

Appending `.mw` to a markwhen url will yield the raw text in `text/markwhen` format: `https://markwhen.com/example.mw`. The markwhen at that url must be public or you must have access to it for this to work.

You can also copy the entire timeline to your clipboard from the export menu and click on `Copy entire timeline to clipboard`.