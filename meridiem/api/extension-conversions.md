# Extension Conversions

If you have [permission to view a document](/meridiem/sharing), you may append a supported extension to a Meridiem document link to get its transformed format.

| Extension | Format                         |
| --------- | ------------------------------ |
| `.mw`     | Raw `text/markwhen` file       |
| `.json`   | Parsed `json`                  |
| `.ics`    | [iCal](https://icalendar.org/) |

For example, since [meridiem.markwhen.com/example](https://meridiem.markwhen.com/example) is [publicly viewable](/meridiem/sharing#publicly-viewable), we can get its raw text and parsed json:

| `https://meridiem.markwhen.com/example.mw`                | `https://meridiem.markwhen.com/example.json`                |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| <iframe src="https://meridiem.markwhen.com/example.mw" /> | <iframe src="https://meridiem.markwhen.com/example.json" /> |

## Calendar

The `.ics` extension is useful for subscribing to your markwhen events from your calendar. For example, in Google Calendar you can add a calendar by url:

![](/images/gcal1.png)
![](/images/gcal2.png)

::: tip Note
Only [publicly viewable](/meridiem/sharing) documents can be added to another calendar application via an `.ics` url.
:::
