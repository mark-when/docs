# MCP

Meridiem exposes an authenticated [Model Context Protocol](https://modelcontextprotocol.io/) server for agents that can read and write a user's Meridiem documents.

```txt
https://meridiem.markwhen.com/_mcp
```

The MCP server uses OAuth. A client starts with the MCP URL, discovers the protected resource metadata, sends the user through Meridiem authorization, and then calls MCP tools with the returned bearer token.

## Connect Codex

Codex can connect to Meridiem using Meridiem's hosted Codex client metadata document:

```bash
codex mcp add meridiem \
  --url https://meridiem.markwhen.com/_mcp \
  --oauth-resource https://meridiem.markwhen.com/_mcp \
  --oauth-client-id https://meridiem.markwhen.com/.well-known/oauth-client/codex.json
```

Then authenticate:

```bash
codex mcp login meridiem --scopes 'openid,docs.read:*,docs.write:*'
```

Meridiem will ask the user to approve the requested document access.

## Connect Claude Code

Claude Code can connect to Meridiem as a remote HTTP MCP server:

```bash
claude mcp add --transport http meridiem https://meridiem.markwhen.com/_mcp
```

Then open Claude Code and run:

```txt
/mcp
```

Choose the Meridiem server and follow the browser login flow. Claude Code supports OAuth Client ID Metadata Documents, so it can use Meridiem's OAuth discovery metadata without a manually created Meridiem app.

If you want to restrict the requested scopes, add the server from JSON configuration:

```bash
claude mcp add-json meridiem \
  '{"type":"http","url":"https://meridiem.markwhen.com/_mcp","oauth":{"scopes":"openid docs.read:* docs.write:*"}}'
```

Claude Code uses a loopback callback URL during OAuth. Meridiem accepts loopback redirect URIs with OS-assigned ports for metadata-document clients.

## Discovery

Meridiem publishes OAuth discovery documents:

| Document | URL |
| -------- | --- |
| MCP protected resource metadata | `https://meridiem.markwhen.com/.well-known/oauth-protected-resource/_mcp` |
| OAuth authorization server metadata | `https://meridiem.markwhen.com/.well-known/oauth-authorization-server` |
| Codex client metadata | `https://meridiem.markwhen.com/.well-known/oauth-client/codex.json` |

The protected resource metadata advertises the MCP resource:

```json
{
  "resource": "https://meridiem.markwhen.com/_mcp",
  "authorization_servers": ["https://meridiem.markwhen.com"],
  "scopes_supported": ["docs.read:*", "docs.write:*"],
  "bearer_methods_supported": ["header"]
}
```

## Client metadata documents

Meridiem supports OAuth Client ID Metadata Documents. In this flow, the OAuth `client_id` is an HTTPS URL that serves a JSON metadata document for the client.

Third-party clients normally host their own metadata document. Meridiem fetches it, validates it, and uses it as the client's registration. Meridiem only hosts the Codex metadata document as a convenience for users who want a ready-to-copy setup.

A public client metadata document looks like this:

```json
{
  "client_id": "https://agent.example/.well-known/oauth-client.json",
  "client_name": "Example Agent",
  "client_uri": "https://agent.example",
  "redirect_uris": [
    "http://127.0.0.1/callback",
    "http://127.0.0.1/callback/*",
    "http://localhost/callback",
    "http://localhost/callback/*"
  ],
  "token_endpoint_auth_method": "none"
}
```

Requirements:

- `client_id` must exactly match the metadata document URL.
- `client_name` is shown to the user on the authorization screen.
- `redirect_uris` must include every redirect URI shape the client may use.
- Public clients must use `token_endpoint_auth_method: "none"` and PKCE with `S256`.

For loopback redirect URIs, Meridiem follows the native-app OAuth pattern: a registered loopback URI without a port can match the same loopback host with an OS-assigned port at authorization time. For example, registering `http://localhost/callback` allows a runtime redirect like `http://localhost:61264/callback`.

## Authorization parameters

MCP clients should include:

| Parameter | Value |
| --------- | ----- |
| `response_type` | `code` |
| `client_id` | The client metadata document URL |
| `redirect_uri` | One of the client's registered redirect URI shapes |
| `scope` | Usually `openid docs.read:* docs.write:*` |
| `resource` | `https://meridiem.markwhen.com/_mcp` |
| `code_challenge_method` | `S256` |

The token exchange happens at:

```txt
https://meridiem.markwhen.com/oauth/token
```

Tokens issued for the MCP resource are audience-bound to `https://meridiem.markwhen.com/_mcp`.
