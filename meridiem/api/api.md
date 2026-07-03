# Meridiem API

[[toc]]

Base URL: `https://meridiem.markwhen.com`

Most `/api/v1/*` endpoints require an OAuth access token. See the [OAuth quickstart](/meridiem/api/oauth) for the authorization flow. Aggregate query endpoints use app credentials with Basic auth instead.

Most document endpoints use a user-facing document name or path in the URL:

```txt
/api/v1/docs/:user/doc/:docName
```

Responses include the immutable `doc_id` when you need a stable identity.

## Get user

### `GET /api/v1/user`

Get user info (email and username) for the user that is using your app.

#### Returns

```ts
{
  "email": string | undefined,
  "username": string | undefined
}
```

| JSON Field | Type                  | Notes |
| ---------- | --------------------- | ----- |
| `email`    | `string \| undefined` |       |
| `username` | `string \| undefined` |       |

#### Required scopes

| Required scope |
| -------------- |
| `openid`       |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |

#### Query Parameters

_None_

#### Body

_None_

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const result = await fetch("https://meridiem.markwhen.com/api/v1/user", {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
});

if (result.ok) {
  const userInfo = await result.json();
  console.log(userInfo.email);
  console.log(userInfo.username);
}
```

:::

## List documents

### `GET /api/v1/docs`

List user's documents. Note that this will return the list of documents that the user has granted your app to access, not necessarily all the user's documents.

#### Returns

```ts
{
  "docs": {
    "uid": string,
    "doc_id": string,
    "updated_at": string | null,
    "header": any,
    "path": string,
    "pathEncoded": string
  }[]
}
```

| JSON Field   | Type             | Notes                                                |
| ------------ | ---------------- | ---------------------------------------------------- |
| `uid`        | `string`         | User ID of the document owner                        |
| `doc_id`     | `string`         | Document ID                                          |
| `updated_at` | `string \| null` | Timestamp when the document was last updated         |
| `header`     | `any`            | Document header metadata                             |
| `path`       | `string`         | Path to the document in the format `username/docName` |
| `pathEncoded` | `string`       | Encoded path for URLs |

#### Required scopes

| Required scope                        |
| ------------------------------------- |
| `docs.read:*` or `docs.read:{docName}` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |

#### Query Parameters

_None_

#### Body

_None_

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const result = await fetch("https://meridiem.markwhen.com/api/v1/docs", {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
});

if (result.ok) {
  const { docs } = await result.json();
  console.log(docs);
}
```

:::

## Get document

### `GET /api/v1/docs/:user/doc/:docName`

Get the content of a specific document.

#### Returns

The document content and parsed markwhen:

```ts
{
  version: number;
  text: string;
  parsed: any;
}
```

#### Required scopes

| Required scope                       |
| ------------------------------------ |
| `docs.read:*` or `docs.read:{docName}` |

#### Headers

| Header          | Value                                            |
| --------------- | ------------------------------------------------ |
| `Authorization` | `Bearer {your app's access_token}`               |

#### Query Parameters

_None_

#### Body

_None_

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docName = "journal"; // Document name/path

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }
);

if (result.ok) {
  const { text, parsed, version } = await result.json();
  console.log(text, parsed, version);
}
```

:::

## Create new document

### `POST /api/v1/docs/:user/doc/:docName`

Create a new document with the specified name/path. Meridiem generates and returns the immutable `doc_id`.

#### Returns

Status code 202 if successful.

#### Required scopes

| Required scope |
| -------------- |
| `docs.write:*` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |
| `Content-Type`  | `application/json`                 |

#### Query Parameters

_None_

#### Body

```ts
{
  "text": string,
  "timezone": string
}
```

| JSON Field | Type     | Notes                                                                            |
| ---------- | -------- | -------------------------------------------------------------------------------- |
| `text`     | `string` | The initial content of the document in markwhen format                           |
| `timezone` | `string` | The timezone to use for datetime formatting (e.g., "utc", "America/Los_Angeles") |

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docName = "garden"; // New document name/path

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}`,
  {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      text: "title: My New Document\n\n2023-01-01: Created a new document",
      timezone: "America/New_York",
    }),
  }
);

if (result.ok) {
  const { doc_id, name } = await result.json();
  console.log("Document created successfully", doc_id, name);
}
```

:::

## Append to document

### `PATCH /api/v1/docs/:user/doc/:docName`

Append content to an existing document. Note that this will add to the end of the document if the document is "sorted" from oldest to newest (top to bottom), otherwise it will add new entries to the top. Technically it just looks at the top two events (if there are any) and if the first one is newer than the second one, appends to the top of the document (after the header). It does not insert events in sorted order. In fact, this method does not assume that a new event is even being inserted necessarily. One could, for example, insert the text `Hello world` which would presumably just be added to the event description of the last event.

That being said, if you do want to insert a new event, be sure that it is a [valid markwhen event format](/syntax/).

To add an event that corresponds to "now," or, when this API call is made, you may optionally include a date time interpolation token in the text to be added - the server will automatically convert it to the format specified. The token format is `dt` followed by a date time format string surrounded by curly brackets:

| Input string                                  | Interpolated value                  |
| --------------------------------------------- | ----------------------------------- |
| `dt{yyyy}`                                    | `2025`                              |
| `this month (dt{MMMM})`                       | `this month (August)`               |
| `It's been dt{HH 'hours and' mm 'minutes'}` | `It's been 20 hours and 55 minutes` |

For example, `"dt{yyyy-MM-dd}: Hello world!` will be interpolated to `2025-06-01: Hello world!` (or whatever today's date is when the request is made).

[Read more about date time formatting tokens.](https://moment.github.io/luxon/#/formatting?id=table-of-tokens)

#### Returns

Status code 202 if successful, with a JSON response containing any new URLs added:

```ts
{
  "added": string[]
}
```

#### Required scopes

| Required scope                         |
| -------------------------------------- |
| `docs.write:*` or `docs.write:{docName}` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |
| `Content-Type`  | `application/json`                 |

#### Query Parameters

_None_

#### Body

```ts
{
  "edits": {
    "text": string,
    "timezone"?: string,
    "from"?: number,
    "to"?: number,
    "length"?: number,
    "version"?: number
  }[]
}
```

| JSON Field | Type | Notes |
| ---------- | ---- | ----- |
| `edits` | `array` | One or more edits to apply. Without `from`, Meridiem appends near the top or bottom based on document order. |

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docName = "journal"; // Document name/path

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}`,
  {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      edits: [
        {
          text: "dt{yyyy-MM-dd}: New entry added via API",
          timezone: "America/New_York",
        },
      ],
    }),
  }
);

if (result.ok) {
  const { added } = await result.json();
  console.log("New URLs added:", added);
}
```

:::

## Delete document

### `DELETE /api/v1/docs/:user/doc/:docName`

Delete a document.

#### Returns

Status code 200 if successful.

#### Required scopes

| Required scope                         |
| -------------------------------------- |
| `docs.write:*` or `docs.write:{docName}` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |

#### Query Parameters

_None_

#### Body

_None_

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docName = "journal"; // Document name/path

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}`,
  {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }
);

if (result.ok) {
  console.log("Document deleted successfully");
}
```

:::

## Get document metadata

### `GET /api/v1/docs/:user/doc/:docName/metadata`

Get metadata for a specific document.

#### Returns

```ts
{
  "uid": string,
  "doc_id": string,
  "updated_at": string | null,
  "header": any,
  // Additional document metadata fields
}
```

#### Required scopes

| Required scope                       |
| ------------------------------------ |
| `docs.read:*` or `docs.read:{docName}` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |

#### Query Parameters

_None_

#### Body

_None_

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docName = "journal"; // Document name/path

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}/metadata`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }
);

if (result.ok) {
  const metadata = await result.json();
  console.log(metadata);
}
```

:::

## Amend document header

### `PATCH /api/v1/docs/:user/doc/:docName/header`

Update a document's header.

#### Returns

Status code 200 if successful.

#### Required scopes

| Required scope                         |
| -------------------------------------- |
| `docs.write:*` or `docs.write:{docName}` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |
| `Content-Type`  | `application/json`                 |

#### Query Parameters

_None_

#### Body

```ts
{
  "set"?: object,
  "merge"?: object
}
```

| JSON Field | Type | Notes |
| ---------- | ---- | ----- |
| `set` | `object` | Replace header values with these values |
| `merge` | `object` | Merge these values into the existing header |

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docName = "journal"; // Document name/path

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}/header`,
  {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      merge: {
        title: "Updated Document Title",
      },
    }),
  }
);

if (result.ok) {
  console.log("Document header updated successfully");
}
```

:::

## Get all entries (events) from a document

### `POST /api/v1/docs/:user/doc/:docName/entries`

Get all entries from a document, optionally filtered by properties.

#### Returns

```ts
[
  {
    uid: string,
    doc_id: string,
    url: string,
    from_ts: number,
    to_ts: number,
    content: string,
    // Additional entry fields
  },
];
```

#### Required scopes

| Required scope                       |
| ------------------------------------ |
| `docs.read:*` or `docs.read:{docName}` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |

#### Query Parameters

_None_

#### Body

```ts
{
  "property_filter"?: object,
  "property_exclude"?: object
}
```

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docName = "journal"; // Document name/path

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}/entries`,
  {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  }
);

if (result.ok) {
  const entries = await result.json();
  console.log(entries);
}
```

:::

## Get entry by url

### `GET /api/v1/docs/:user/doc/:docName/entries/:entry_url`

Get a specific entry from a document by its URL.

#### Returns

```ts
{
  "uid": string,
  "doc_id": string,
  "url": string,
  "from_ts": number,
  "to_ts": number,
  "content": string,
  "documents": {
    "header": any
  },
  "users": {
    "username": string
  }
  // Additional entry fields
}
```

#### Required scopes

| Required scope                       |
| ------------------------------------ |
| `docs.read:*` or `docs.read:{docName}` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |

#### Query Parameters

_None_

#### Body

_None_

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docName = "journal"; // Document name/path
const entryUrl = "entry-url"; // Entry URL

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docName}/entries/${entryUrl}`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }
);

if (result.ok) {
  const entry = await result.json();
  console.log(entry);
}
```

:::

## Aggregate queries

Aggregate endpoints let server-side apps query metadata, entries, and document content across the documents the app is authorized to read. They are useful for feeds, search, dashboards, notification jobs, and apps that need to combine entries from multiple documents.

For a fuller walkthrough and examples, see [Aggregate queries](/meridiem/api/aggregate-queries).

Unlike the document endpoints above, aggregate endpoints authenticate with the app's `app_id` and `app_secret`:

```js
const basicAuth = btoa(`${appId}:${appSecret}`);
```

Use the header:

| Header | Value |
| ------ | ----- |
| `Authorization` | `Basic ${basicAuth}` |
| `Content-Type` | `application/json` for `POST` requests |

Aggregate queries return only resources matching the app's authorized scopes. `docs.read:*` or `docs.write:*` can read all documents a user granted to the app. Document-specific scopes like `docs.read:{docName}` or `docs.read:{doc_id}` read only matching documents. The optional `docs` field narrows the result set; it is not required for document-specific scopes to work.

`docs` values use `username/docName` or `username/path/to/doc`. A bare username such as `alice` means documents owned by that user. Responses include `doc_id` for stable identity and `doc_path` for the current user-facing path when available.

### `POST /api/v1/aggregate/metadata`

Query document metadata across authorized documents.

#### Body

```ts
{
  docs?: string[];
  limit?: number;
  offset?: number;
  header_filter?: object[];
  header_exclude?: object[];
}
```

| JSON Field | Type | Notes |
| ---------- | ---- | ----- |
| `docs` | `string[]` | Optional document/user filters, for example `["alice/journal"]` or `["alice"]` |
| `limit` | `number` | Defaults to `40`; maximum `100` |
| `offset` | `number` | Defaults to `0` |
| `header_filter` | `object[]` | Return docs whose header contains at least one object |
| `header_exclude` | `object[]` | Exclude docs whose header contains any object |

#### Returns

```ts
{
  uid: string;
  username: string;
  doc_id: string;
  doc_version: number;
  header: any;
  updated_at: string;
  doc_path: string;
  canonical_url?: string;
}[]
```

#### Example

::: code-group

```js [JS]
const basicAuth = btoa(`${appId}:${appSecret}`);

const response = await fetch(
  "https://meridiem.markwhen.com/api/v1/aggregate/metadata",
  {
    method: "POST",
    headers: {
      authorization: `Basic ${basicAuth}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      docs: ["alice"],
      header_filter: [{ remarking: { view: "*" } }],
      limit: 20,
    }),
  }
);

const docs = await response.json();
```

:::

### `POST /api/v1/aggregate/entries`

Query entries across authorized documents.

#### Body

```ts
{
  docs?: string[];
  limit?: number;
  offset?: number;
  header_filter?: object[];
  header_exclude?: object[];
  property_filter?: object[];
  property_exclude?: object[];
  merge_with?: string[];
  from_ts_gte?: string;
  from_ts_lte?: string;
}
```

| JSON Field | Type | Notes |
| ---------- | ---- | ----- |
| `docs` | `string[]` | Optional document/user filters |
| `limit` | `number` | Defaults to `40`; maximum `100` |
| `offset` | `number` | Defaults to `0` |
| `header_filter` | `object[]` | Return entries from docs whose header contains at least one object |
| `header_exclude` | `object[]` | Exclude entries from docs whose header contains any object |
| `property_filter` | `object[]` | Return entries whose properties contain at least one object |
| `property_exclude` | `object[]` | Exclude entries whose properties contain any object |
| `merge_with` | `string[]` | Header path whose value names additional docs to include |
| `from_ts_gte` | `string` | ISO timestamp lower bound for entry start |
| `from_ts_lte` | `string` | ISO timestamp upper bound for entry start; defaults to now |

#### Returns

```ts
{
  id: number;
  created_at: string;
  from_ts: string;
  to_ts: string;
  doc_id: string;
  uid: string;
  username: string;
  url: string;
  tags: any;
  entry: any;
  properties: any;
  header: any;
  doc_path: string;
  canonical_url?: string;
}[]
```

#### Example

::: code-group

```js [JS]
const basicAuth = btoa(`${appId}:${appSecret}`);

const response = await fetch(
  "https://meridiem.markwhen.com/api/v1/aggregate/entries",
  {
    method: "POST",
    headers: {
      authorization: `Basic ${basicAuth}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      docs: ["alice/journal"],
      property_filter: [{ mood: "great" }],
      from_ts_gte: "2026-01-01T00:00:00.000Z",
      limit: 20,
    }),
  }
);

const entries = await response.json();
```

:::

### `GET /api/v1/aggregate/content`

Fetch content and metadata for one authorized document by user-facing path.

#### Query Parameters

| Parameter | Type | Notes |
| --------- | ---- | ----- |
| `username` | `string` | Document owner's username |
| `doc_path` | `string` | Document name/path |

#### Returns

```ts
{
  uid: string;
  doc_id: string;
  doc_path: string;
  doc_type: string;
  header: any;
  content: string;
  doc_version: number;
  updated_at: string;
}
```

#### Example

::: code-group

```js [JS]
const basicAuth = btoa(`${appId}:${appSecret}`);
const params = new URLSearchParams({
  username: "alice",
  doc_path: "journal",
});

const response = await fetch(
  `https://meridiem.markwhen.com/api/v1/aggregate/content?${params}`,
  {
    headers: {
      authorization: `Basic ${basicAuth}`,
    },
  }
);

const document = await response.json();
```

:::

### Path and entry helpers

Aggregate also includes helper endpoints for path-based apps:

| Endpoint | Purpose |
| -------- | ------- |
| `GET /api/v1/aggregate/documents/resolve?username={username}&doc_path={docPath}` | Resolve a user-facing document path to `uid`, `doc_id`, and canonical path |
| `GET /api/v1/aggregate/documents/canonical?uid={uid}&doc_id={doc_id}` | Get the current canonical path for a stable document identity |
| `GET /api/v1/aggregate/entries/by-path?username={username}&doc_path={docPath}&entry_url={entryUrl}` | Fetch one entry by user-facing document path and entry URL |
| `GET /api/v1/aggregate/entries/by-id?uid={uid}&doc_id={doc_id}&entry_url={entryUrl}` | Fetch one entry by stable document identity and entry URL |

## List media

### `GET /api/v1/media`

List media files owned by the authenticated user.

#### Returns

```ts
{
  "media": [
    {
      "name": string,
      "metadata": any
    }
  ]
}
```

#### Required scopes

| Required scope                    |
| --------------------------------- |
| `media.read:*` or `media.write:*` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |

#### Query Parameters

_None_

#### Body

_None_

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token

const result = await fetch("https://meridiem.markwhen.com/api/v1/media", {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
});

if (result.ok) {
  const { media } = await result.json();
  console.log(media);
}
```

:::

## Upload media

### `GET /api/v1/media/upload`

Create signed upload links for media files.

#### Returns

```ts
{
  "links": string[]
}
```

| JSON Field | Type       | Notes                   |
| ---------- | ---------- | ----------------------- |
| `links`    | `string[]` | Signed upload URLs      |

#### Required scopes

| Required scope  |
| --------------- |
| `media.write:*` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |

#### Query Parameters

| Parameter | Type | Notes |
| --------- | ---- | ----- |
| `extensions` | `string` | Comma-separated extension counts, for example `.jpg:2,.png:1` |

#### Body

_None_

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token

const result = await fetch(
  "https://meridiem.markwhen.com/api/v1/media/upload?extensions=.jpg:1",
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }
);

if (result.ok) {
  const { links } = await result.json();
  await fetch(links[0], {
    method: "PUT",
    headers: {
      "content-type": "image/jpeg",
    },
    body: file,
  });
}
```

:::

## Delete media

### `DELETE /api/v1/media`

Delete media files.

#### Returns

Status code 200 if successful.

#### Required scopes

| Required scope  |
| --------------- |
| `media.write:*` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |
| `Content-Type`  | `application/json`                 |

#### Query Parameters

_None_

#### Body

```ts
{
  "files": string[]
}
```

| JSON Field | Type       | Notes                         |
| ---------- | ---------- | ----------------------------- |
| `files`    | `string[]` | Array of file paths to delete |

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const filesToDelete = ["userId/filename1.jpg", "userId/filename2.png"];

const result = await fetch("https://meridiem.markwhen.com/api/v1/media", {
  method: "DELETE",
  headers: {
    authorization: `Bearer ${accessToken}`,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    files: filesToDelete,
  }),
});

if (result.ok) {
  console.log("Files deleted successfully");
}
```

:::
