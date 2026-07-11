# Meridiem Apps

Meridiem supports apps that act on a user's behalf via the [OAuth API](/meridiem/api/).

If you want the fastest path, start with the [OAuth quickstart](/meridiem/api/oauth). If you want a concrete model for what an app can be, read [Build an app like Remark.ing](/meridiem/api/build-remarking-app). If you are connecting an agent, see [MCP](/meridiem/api/mcp).

To create an app, ensure that you are signed into Meridiem. Go to `Settings` -> `Developer` -> Under `Apps`, click `Create`.
Enter your app's information (it can be changed later) and click `Save`.

Your app's `app_id` and `app_secret` will be generated, and there will be additional fields to add more supplemental data:

- `Optional` icon url that will display on the OAuth page
- `Optional` scope justification that will also be displayed on the OAuth page, for explaining the purpose of requesting the scopes that your app requests.
- `Optional` `doc_changed_webhook` url for receiving signed document change webhooks.

For webhook payloads, signature headers, and verification details, see [Webhooks](/meridiem/api/webhooks).

## Start here

| Page | Use it for |
| ---- | ---------- |
| [OAuth quickstart](/meridiem/api/oauth) | Signing users in and calling the API with access tokens |
| [MCP](/meridiem/api/mcp) | Connecting agents like Codex to Meridiem documents |
| [API playground](/meridiem/api/api) | Trying document, media, and aggregate endpoints |
| [Build an app like Remark.ing](/meridiem/api/build-remarking-app) | Understanding the shape of a real Meridiem app |

## Good first apps

Meridiem apps usually do one or more of these things:

- Read markwhen documents and turn them into a focused UI.
- Append new entries from a form, button, automation, SMS, email, or agent.
- Store app-level settings in the document header.
- Store structured per-entry details as event properties.
- React to document changes through webhooks.

For cross-document feeds, search, dashboards, and jobs, see [Aggregate queries](/meridiem/api/aggregate-queries). For more examples, see [What can you build?](/meridiem/api/what-can-you-build).
