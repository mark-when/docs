# Webhooks

Meridiem apps can receive webhook events when documents change.

## Configure a webhook URL

Create an app in Meridiem and set a `doc_changed_webhook` URL in app settings.

Webhooks are sent only for documents your app is authorized to access via `docs.read:*`, `docs.write:*`, or matching document-scoped permissions.

## Event type

### `doc.changed`

Sent when a document change has been merged and persisted.

#### Payload

```ts
{
  type: "doc.changed";
  uid: string;
  docId: string;
  version: number;
  requestTimestampSeconds?: number;
  emittedAt: string;
}
```

| JSON Field | Type | Notes |
| ---------- | ---- | ----- |
| `type` | `"doc.changed"` | Event name |
| `uid` | `string` | Document owner uid |
| `docId` | `string` | Document id |
| `version` | `number` | Merged document version |
| `requestTimestampSeconds` | `number \| undefined` | Internal scheduling timestamp |
| `emittedAt` | `string` | ISO timestamp generated at send time |

## Signature headers

Each webhook request includes HMAC headers signed with your app secret.

| Header | Value |
| ------ | ----- |
| `x-markwhen-signature` | `v1=<hex hmac sha256>` |
| `x-markwhen-timestamp` | Unix timestamp in seconds |
| `x-markwhen-event-id` | `doc.changed:{uid}:{docId}:{version}` |
| `x-markwhen-client-id` | Your app `client_id` |

### Signature payload format

The signature is computed over this exact string:

```text
${timestamp}.${eventId}.${rawBody}
```

- `timestamp`: value of `x-markwhen-timestamp`
- `eventId`: value of `x-markwhen-event-id`
- `rawBody`: exact raw request body bytes

::: warning
Do not parse and re-serialize JSON before verification. Verify against the raw body bytes exactly as received.
:::

## Verify signatures (Node.js)

```js
import crypto from "crypto";

export function verifyMarkwhenWebhook(req, appSecret) {
  const signatureHeader = req.headers["x-markwhen-signature"] || "";
  const timestamp = req.headers["x-markwhen-timestamp"] || "";
  const eventId = req.headers["x-markwhen-event-id"] || "";

  if (
    typeof signatureHeader !== "string" ||
    typeof timestamp !== "string" ||
    typeof eventId !== "string"
  ) {
    return false;
  }

  const expectedPrefix = "v1=";
  if (!signatureHeader.startsWith(expectedPrefix)) {
    return false;
  }

  const receivedHex = signatureHeader.slice(expectedPrefix.length);
  const payloadToSign = `${timestamp}.${eventId}.${req.rawBody.toString("utf8")}`;
  const computedHex = crypto
    .createHmac("sha256", appSecret)
    .update(payloadToSign)
    .digest("hex");

  const received = Buffer.from(receivedHex, "hex");
  const computed = Buffer.from(computedHex, "hex");

  if (received.length !== computed.length) {
    return false;
  }
  return crypto.timingSafeEqual(received, computed);
}
```

## Recommended protections

1. Reject signatures that fail verification.
2. Reject old timestamps (for example, older than 5 minutes).
3. Store recent `x-markwhen-event-id` values for replay protection.
4. Handle duplicates idempotently.

## Delivery notes

- Webhook requests are sent as `POST` with `Content-Type: application/json`.
- Treat deliveries as asynchronous notifications.
- Design handlers to be idempotent.