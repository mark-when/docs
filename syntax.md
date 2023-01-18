<!-- ### Table of contents

- [Overview](#overview)
- [Timeline](#timeline)
- [Header](#header)
  - [Title](#title)
  - [Description](#description)
  - [Viewers](#viewers)
  - [Tags and colors](#tags-and-colors)
  - [Date formatting](#date-formatting)
  - [Header Quick Reference](#header-quick-reference)
- [Events](#events)
  - [Quick Reference](#quick-reference)
  - [EDTF Date Ranges](#edtf-date-ranges)
    - [EDTF Date](#edtf-date)
  - [Date Ranges](#date-ranges)
    - [Dates](#dates)
  - [Relative Dates](#relative-dates)
    - [Event IDs](#event-ids)
    - [Due dates](#ue-dates)
    - [Week days](#week-days)
  - [Event Description](#event-description)
    - [Tags](#tags)
    - [Links](#links)
    - [Locations](#locations)
    - [Photos](#photos)
    - [References](#references)
    - [Task list](#task-list)
    - [Percent](#percent)
- [Groups and Sections](#groups-and-sections)
- [Pages](#pages)
- [Sorting](#sorting)
- [Drag and Drop](#drag-and-drop)
- [Editing from the timeline](#editing-from-the-timeline)
- [Saving and sharing](#saving-and-sharing)
  - [Sharing](#sharing)
    - [Random url](#random-url)
    - [Custom url](#custom-url)
    - [Access control](#access-control)
  - [Exporting](#exporting)
    - [Text](#text)
    - [PNG or PDF](#png-or-pdf)
  - [Importing](#importing)

-->

# Syntax

A markwhen document is a simple text file. Its content type is `text/markwhen`; though, when importing from other sources, `text/plain` works fine. A markwhen document is separated into timeline pages via a page break token (`\n_-_-_break_-_-_\n`).

## Timeline

A Timeline page is composed of an optional [header](#header) and one or more [events](#events).



### Event Description



## Pages

When one timeline isn't enough, add pages. Pages are implemented by inserting a special token (`\n_-_-_break_-_-_\n`) at the point where a new page should be.

![](/images/pages.gif)

## Sorting

![](/images/sorting.gif)

Timelines can be sorted one of three ways: how they were originally written (default), ascending, or descending. Event groups will be sorted internally and then they themselves sorted based on their collective earliest and latest dates.

## Drag and Drop

If you find yourself not wanting to edit the text of the timeline or just have some quick edits to make, you may find the drag and drop option to be helpful for you. You can edit the start and end times for an event, as well as moving it forward or backward in time.

![](/images/dragdrop.gif)

This setup works well when sorting, as events will automatically move themselves to the correct order after they've been edited.

## Editing from the timeline

Basic editing of events can be done from the timeline view. Edits made in the timeline will be reflected back to the text editor. Currently, events can be resized (start and end dates can be moved) or moved up or down (that is, appearing before or after other events in the timeline). Events can also be created from the timeline view, by hovering over the new event button and clicking and dragging to the desired start and end dates for your event.

![](/images/timeline_edit.gif)

Note that the interpolated events' date formats will be inferred from the date formats of already defined dates, otherwise it will default to [EDTF](#edtf-date). So, if you want to create an event with the format `m/d/y` from the timeline by dragging the new event button, you should already have an event defined that uses that format.

## Saving and sharing

To save a markwhen document, click the `Save locally` button from the `File` menu while on the Editor tab of the sidebar. It will be saved locally **in your browser**, and you can come back and edit or view it later, as long as it's on the same device.

You can view markwhen documents that you've saved from the profile tab of the sidebar.

### Sharing

#### Random url

To share a markwhen document with a link, click the `Share` button. You do not need an account to do this.

#### Custom url

To share a markwhen document with a custom link like `/jeff/mylife`, and to be able to edit it later, you will need to make an account. You can make an account by sending yourself a signin link from the profile page. Once signed in, you will need to choose a username from which your markwhen documents will be hosted. For example, if you choose the name `jeff`, all your markwhen documents will be accessible from `https://markwhen.com/jeff/...`. If you share a markwhen document with the same name as your username, it will be accessible from `https://markwhen.com/[your username]/`, otherwise, it will be accessible from `https://markwhen.com/[your username]/[markwhen name]`.

All in all, the steps are:

1. Send yourself a signin link from the profile tab.
2. Click the link to login.
3. Choose a username - all your shared timelines will be available from `https://markwhen.com/[your username]/...`
4. Share your markwhen page

#### Access control


Specify who can view your shared timeline by adding a `view` field to your header:

```
// Only allow Jill, Corey, and everyone at example.com
// to view this shared timeline
view: jill@webkit.org, corey@internetexplorer.com, *@example.com
```

**This only affects markwhen documents shared on markwhen.com**, and is a paid feature - you need a subscription for the `view` field to take effect.

See [viewers](#viewers).

### Exporting

#### Text

There are a few ways to export your markwhen file, all of which can be found in the export file menu. You can download a `.mw` file or copy the whole text document.

![](/images/file_menu.png)

And, while not in the file menu, by adding `.mw` to a shared markwhen.com page, you can view the page's raw text.

### Importing

Similar to [exporting](#exporting) a markwhen page, you can import a markwhen file from your computer or load one via a url. Note that the url should return raw text (either `text/markwhen` or `text/plain`), **not** html.

![](/images/file_import.png)

Importing from a url can also be done by appending a hash to markwhen.com of the form `#from={url}`. For example, `markwhen.com/#from=markwhen.com/rob/wedding` will load the markwhen file at `/rob/wedding`.
