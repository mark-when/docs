<script setup lang="ts">
import { onMounted } from "vue"
import FlexRow from "../src/FlexRow.vue"

onMounted(() => {
  if (window.remarking) {
    window.remarking.scan?.()
  }
})
</script>

# Remark.ing

[Remarking](https://remark.ing) is a twitter-like blogging site, but as an aggregation of markwhen documents. You write markwhen and each entry in it is its own "remark."

Let's say Rob, Kris, and Esteban all join Remarking and create their markwhen docs:

::: code-group

```mw [rob/my-remarks.mw]
2025-06-01: Example for documentation
2025-04-21: Pool day 🏊🏼‍♂️
```

```mw [kris/events.mw]
2025-04-30: 🛫 here we go
2025-05-01: 🛬 finally
```

```mw [esteban/esteban.mw]
2025-02-30: still cold
2025-07-04: 🎇
```

:::

Remarking adds them all together, and you get:

::: code-group

```mw [remark.ing]
2025-07-04: 🎇
2025-06-01: Example for documentation
2025-05-01: 🛬 finally
2025-04-30: 🛫 here we go
2025-04-21: Pool day 🏊🏼‍♂️
2025-02-30: still cold
```

:::

Which then turns each event into something like this:

<blockquote data-remarking-uri="/rob/rob/Example-for-the-documentation"></blockquote>

Remarking is built on top of [Meridiem](/meridiem/) and its [OAuth API](/meridiem/api/). This way, you can edit your markwhen documents directly via Meridiem, or you can use the Remarking interface.

::: tip Note
In the example above, Rob, Kris, and Esteban would all have had to connect and authorize Remarking to access those specific documents.
:::

## Benefits of blogging with Markwhen

- Future posts can be drafted by just giving them a date in the future
- Exporting or moving your writing is as simple as copy pasting
- Everything is very searchable - `ctrl`/`cmd` + `f`
- Editting and deleting is super easy - you can edit all remarks directly in Meridiem

## Setup

1. Go to [remark.ing](https://remark.ing) and click on `Log in / Sign up`.
2. If you aren't already logged in to Meridiem, you'll be asked to send a login link to your email.
3. If you don't have an account, you'll be prompted to choose a username. This username works across Meridiem and Remark.ing; your document urls will correspond to Remark.ing urls. That is, if you choose the username `jo` and `meridiem.markwhen.com/jo/stuff` is linked to Remark.ing, it will be viewable at `remark.ing/jo/stuff`.
4. You'll be prompted to allow Remark.ing to access your Meridiem cloud documents.
5. You'll be redirected to Remark.ing where you can either create a new blog or tailor the settings of your existing blogs.

### Profile page

![](/images/remarking_profile.png)

You can customize your profile page through Remark.ing (by clicking on the edit button at the top right of the profile page) or by adding specific entries to your markwhen documents.

If you add an author name and avatar image, they will be shown next to your remarks when they appear in a feed.

The following is the header for `rob/rob` to give it the appearance it has at [remark.ing/rob/rob](https://remark.ing/rob/rob).

```mw
remarking:
  image: https://media.markwhen.com/7mGszd2clHRHudsf0lLX4Kb1ChI3/cef3-a901-e1b7-5585.png
  author:
    name: Rob Koch
    avatar: https://media.markwhen.com/7mGszd2clHRHudsf0lLX4Kb1ChI3/0bc5-25f1-db6a-3706.jpg
  description: |
    mostly [markwhen](https://markwhen.com) stuff
    [Github](https://github.com/kochrt)
```

Indeed, editing the profile page using the Remark.ing UI merely changes these values in the header of your markwhen document.

::: warning Add a timezone
Add a timezone to any markwhen document you want to use for remark.ing!
:::
