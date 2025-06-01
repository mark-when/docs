# Meridiem API

[[toc]]

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
    "path": string
  }[]
}
```

| JSON Field   | Type             | Notes                                                |
| ------------ | ---------------- | ---------------------------------------------------- |
| `uid`        | `string`         | User ID of the document owner                        |
| `doc_id`     | `string`         | Document ID                                          |
| `updated_at` | `string \| null` | Timestamp when the document was last updated         |
| `header`     | `any`            | Document header metadata                             |
| `path`       | `string`         | Path to the document in the format `username/doc_id` |

#### Required scopes

| Required scope                        |
| ------------------------------------- |
| `docs.read:*` or `docs.read:{doc_id}` |

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

### `GET /api/v1/docs/:user/doc/:docId`

Get the content of a specific document.

#### Returns

The document content in the requested format:

- If `Accept: application/json` header is provided, returns the parsed document as JSON
- Otherwise, returns the raw document content as text/markwhen

#### Required scopes

| Required scope                       |
| ------------------------------------ |
| `docs.read:*` or `docs.read:{docId}` |

#### Headers

| Header          | Value                                            |
| --------------- | ------------------------------------------------ |
| `Authorization` | `Bearer {your app's access_token}`               |
| `Accept`        | `application/json` (optional, for JSON response) |

#### Query Parameters

_None_

#### Body

_None_

#### Examples

::: code-group

```js [JS - Raw Format]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docId = "doc123"; // Document ID

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docId}`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }
);

if (result.ok) {
  const markwhenText = await result.text();
  console.log(markwhenText);
}
```

```js [JS - JSON Format]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docId = "doc123"; // Document ID

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docId}`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: "application/json",
    },
  }
);

if (result.ok) {
  const parsedDocument = await result.json();
  console.log(parsedDocument);
}
```

:::

## Create new document

### `POST /api/v1/docs/:user/doc/:docId`

Create a new document with the specified ID.

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
const docId = "newdoc123"; // New document ID

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docId}`,
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
  console.log("Document created successfully");
}
```

:::

## Append to document

### `PATCH /api/v1/docs/:user/doc/:docId`

Append content to an existing document. Note that this will add to the end of the document if the document is "sorted" from oldest to newest (top to bottom), otherwise it will add new entries to the top. Technically it just looks at the top two events (if there are any) and if the first one is newer than the second one, appends to the top of the document (after the header). It does not insert events in sorted order. In fact, this method does not assume that a new event is even being inserted necessarily. One could, for example, insert the text `Hello world` which would presumably just be added to the event description of the last event.

That being said, if you do want to insert a new event, be sure that it is a [valid markwhen event format](/syntax).

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
| `docs.write:*` or `docs.write:{docId}` |

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
| `text`     | `string` | The content to append to the document in markwhen format                         |
| `timezone` | `string` | The timezone to use for datetime formatting (e.g., "utc", "America/Los_Angeles") |

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docId = "doc123"; // Document ID

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docId}`,
  {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      text: "dt{yyyy-MM-dd}: New entry added via API",
      timezone: "America/New_York",
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

### `DELETE /api/v1/docs/:user/doc/:docId`

Delete a document.

#### Returns

Status code 200 if successful.

#### Required scopes

| Required scope                         |
| -------------------------------------- |
| `docs.write:*` or `docs.write:{docId}` |

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
const docId = "doc123"; // Document ID

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docId}`,
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

### `GET /api/v1/docs/:user/doc/:docId/metadata`

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
| `docs.read:*` or `docs.read:{docId}` |

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
const docId = "doc123"; // Document ID

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docId}/metadata`,
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

### `PATCH /api/v1/docs/:user/doc/:docId/header`

Update a document's header.

#### Returns

Status code 200 if successful.

#### Required scopes

| Required scope                         |
| -------------------------------------- |
| `docs.write:*` or `docs.write:{docId}` |

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
  "key": string,
  "value": any
}
```

| JSON Field | Type     | Notes                            |
| ---------- | -------- | -------------------------------- |
| `key`      | `string` | The header key to update         |
| `value`    | `any`    | The new value for the header key |

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const username = "username"; // Document owner's username
const docId = "doc123"; // Document ID

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docId}/header`,
  {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      key: "title",
      value: "Updated Document Title",
    }),
  }
);

if (result.ok) {
  console.log("Document header updated successfully");
}
```

:::

## Get all entries (events) from a document

### `GET /api/v1/docs/:user/doc/:docId/entries`

Get all entries from a document.

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
| `docs.read:*` or `docs.read:{docId}` |

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
const docId = "doc123"; // Document ID

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docId}/entries`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }
);

if (result.ok) {
  const entries = await result.json();
  console.log(entries);
}
```

:::

## Get entry by url

### `GET /api/v1/docs/:user/doc/:docId/entries/:entry_url`

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
| `docs.read:*` or `docs.read:{docId}` |

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
const docId = "doc123"; // Document ID
const entryUrl = "entry-url"; // Entry URL

const result = await fetch(
  `https://meridiem.markwhen.com/api/v1/docs/${username}/doc/${docId}/entries/${entryUrl}`,
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

### `POST /api/v1/media`

Upload media files.

#### Returns

```ts
{
  "paths": string[]
}
```

| JSON Field | Type       | Notes                                      |
| ---------- | ---------- | ------------------------------------------ |
| `paths`    | `string[]` | Array of paths to the uploaded media files |

#### Required scopes

| Required scope  |
| --------------- |
| `media.write:*` |

#### Headers

| Header          | Value                              |
| --------------- | ---------------------------------- |
| `Authorization` | `Bearer {your app's access_token}` |
| `Content-Type`  | `multipart/form-data`              |

#### Query Parameters

_None_

#### Body

A multipart form with one or more files.

#### Examples

::: code-group

```js [JS]
const accessToken = ""; // Your app's access token
const fileInput = document.querySelector('input[type="file"]');
const formData = new FormData();

// Add files from file input
for (const file of fileInput.files) {
  formData.append("files", file);
}

const result = await fetch("https://meridiem.markwhen.com/api/v1/media", {
  method: "POST",
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
  body: formData,
});

if (result.ok) {
  const { paths } = await result.json();
  console.log("Uploaded file paths:", paths);
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
