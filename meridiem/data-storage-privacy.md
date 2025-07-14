# Data Storage

There are three ways your markwhen documents can be stored if you're using Meridiem - in the browser, as a file, or in the cloud.

## Browser storage

Also sometimes referred to by me and elsewhere in these docs as "local storage," because that's what it's called, this is a [feature of browsers](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) that gives a domain an amount of space with which to store user data. It is only readable and writable by that origin. That is, other websites can't read it.

### Pros

- Easy to use and work with for both users and developers
- Little overhead (no other requirements, can be used on mobile)

### Cons

- Max storage capacity of 5mb (though this is rarely met, or at least would be difficult on Meridiem)
- Less understood than regular files or even the cloud
- Not as accessible outside of Meridiem

## Files

Regular ol' files. Create them on your computer, read them elsewhere, open, edit, save, delete, send, etc. At the end of the day, regardless of which storage option you choose, your markwhen documents are essentially files - that's why we like them!

### Pros

- Ubiquitious
- Easy to work with

### Cons

- More overhead than `localStorage` because ~~browsers don't trust websites~~ bad actors have ruined it for the rest of us, so websites have to ask for permission to read from and write to the file system. This is just an added burden to users, which is unfortunate.

## Cloud storage

> I don't like the term cloud but that is what we've settled on and so that is the term I'll use here.

The third option is storage by proxy - Meridiem can store your files, associated with your account, same as iCloud or OneDrive or Dropbox or the like.

### Pros

- Multi device usage - you can access your data from any device anywhere, so long as you log in
- [Sharing and live collaborative editing](/meridiem/sharing)
- API access
- Calendar-like features

### Cons

- An internet connection is generally required
- "Is my data safe?""

### Data privacy and security

I personally find it more than a little annoying when some company suffers a "data breach" as they call it and you get a canned letter and $12 from a settlement 3 years later.

At the end of the day, there is an element of trust involved, and you may just not want to give it. And I understand, I'm a pretty skeptical person at this point too, and I would say use the other forms of storage.

#### FAQ

#### Is my data encrypted?

Yes, at rest as part of Google Cloud's default encryption and in transit as everything is over HTTPS.

#### Is it encrypted end to end?

No - Meridiem can read your cloud data, in addition to you.

#### Who is Meridiem? When do you read my cloud data and why?

[I](https://github.com/kochrt) am Meridiem, I'm the developer of Markwhen, Meridiem, Remarking, the VSCode extension, the obsidian extension, the parser, the timeline, the resume view, the maps view, and the calendar view.

I don't personally read your data because I don't want to, I wouldn't want others to do that to my data, and honestly it's not super straightforward to do so. If I think I need to read your data for debugging purposes I'll ask you to share it with me via the standard sharing sytanx.

My trustworthiness is on the line and that's worth a lot to me.

Now Meridiem as a system "reads" your data fairly regularly, to insert it into a database and to offer API access to any applications **that you have authorized** to give access (as of 2025-07 there is only one application - remarking). End to end encryption would not allow this functionality, as it would be reading nonsensical encrypted data instead of markwhen.

No part of markwhen or meridiem or remarking is in the data brokerage or data selling business, and never will be. I hate that shit. Data selling is dragging the whole internet down, imho.

I'll say it again though, because it bears repeating - this all takes trust on your part, and if you don't trust me, then don't give me your stuff to store. My feelings are not hurt.

For those that do trust me, stewardship of your data is my responsibility and I take it seriously.