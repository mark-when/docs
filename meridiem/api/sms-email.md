# SMS & Email

Meridiem supports appending to markwhen documents via texting and email. Generally speaking, you can text or email `${user_name}/${doc_name}@bot.markwhen.com` and a timestamped entry will be appended to that document with the content of the message. If your username was `ester` and your document was `wichita` you would send email to `ester/wichita@bot.markwhen.com` (or `ester.wichita@bot.markwhen.com`, the separator between username and email can be either `.` or `/`.).

**This only works for shared/cloud markwhen documents.**

Here's how it works:

1. You must sign up to Meridiem and choose a username.
2. The email address that you used to sign in to Meridiem is automatically conferred edit permissions for appending via email. You may immediately send email from that email address to your docs to append to them. If this is all you need, you can stop here.
3. If you want others (other email addresses or phone numbers) to also be able to append to documents, there are a few ways you can give them permission:

- Go to `Settings` in Meridiem. Under `Accounts` and `Editor emails and phone numbers`, add the phone numbers or email addresses that you want to give access to **all** your documents.
- If you only want to give access on a per-document basis, [add their email or phone number in the `meridiem.edit` field of a specific document](/meridiem/sharing):

```mw
meridiem:
  edit:
    - 2128675309
    - franklin@gtav.com
```

## Creating new documents

This method can also be used to create new documents. Again, email or text **from an allowlisted** number or email address to a nonexistent document that is under your username and it will be created for you.

## Example

Let's say your username is `tricia` and you have a document in meridiem that has been saved (aka shared) as `kitchen`, and it looks like this:

::: code-group

```mw [tricia/kitchen]
---
title: Kitchen renovation planning
---
2024-05-05: got the plans approved
2024-06-04: met with contractor
```

:::

At `2024-09-08 09:10` you text or email `tricia/kitchen@bot.markwhen.com` from an allowlisted number or email address with the message `the kitchen is done!`. Meridiem recieves the message, parses it, and adds it to your document:

::: code-group

```mw [tricia/kitchen]
---
title: Kitchen renovation planning
---
2024-05-05: got the plans approved
2024-06-04: met with contractor
2024-09-08 09:10: the kitchen is done!
```

:::

::: info Top or bottom
Personally, I like to write my markwhen documents with the most recent entries at the top, unlike Tricia. If Meridiem "notices" that your documents are sorted newest-first, it will add new entries to the top. Otherwise they will be added at the end of the document.

Meridiem will **not** attempt to insert new entries in the middle of a document in sorted order - it will only add at the top or bottom.
:::

## Caveats

- U.S. 10 digit phone numbers only. (it may work with other international numbers but it hasn't been tried).
- Don't add spaces, periods, or dashes when adding phone numbers.
- You will receive no email or sms response, whether it succeeds or fails.
- There is a general movement to [get rid of SMS gateways](https://www.att.com/support/article/wireless/KM1061254/), which is what enables texting an email address in the first place. Unfortunate, but there isn't much I can do about that. So if you're an AT&T customer you already cannot use this feature as they have disabled their gateway as of June 17, 2025.

### SMS/MMS

SMS is a special breed of technology, let's put it that way. Historically, SMS messages have been limited to 160 characters (the reason for twitter's original length limit), though there may be some carrier-specific ways to hide that from users, and MMS will "helpfully" compress your media to the moon and back.

[RCS](https://en.wikipedia.org/wiki/Rich_Communication_Services), SMS's replacement, would represent a more fruitful long-term mechanism for what is currently implemented here in SMS/MMS but is not yet set up - mostly because it's more difficult and rigid. SMS is easier to work with programmatically, which is unfortunately why it has been all but overrun with spam and so its successor is more locked down.

Unfortunately RCS does not support [SMS gateways](https://en.wikipedia.org/wiki/SMS_gateway) (at least as far as I know) and so the one-email-address-per-document model descibed on this page will not work when RCS support does roll out (if ever).

## Remarking

Incidentally this is a super easy way to work with [remarking](https://remark.ing) - just text your updates or posts, just like (very) old school twitter.
