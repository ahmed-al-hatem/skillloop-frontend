# 05 · API contract

**English** · [العربية](05-api-contract.ar.md)

The agreement between frontend and backend is the backend team's **OpenAPI file** (`openapi.yaml`, API v1). It lists every endpoint, its request, its response and its errors. **We only call endpoints that are in that file.** If a screen needs something that isn't there, ask the backend team to add it to `openapi.yaml` first, then build it.

## Where to find it

- Ask the backend team for the latest `openapi.yaml`. Keep a local copy at `local-docs/api/openapi.yaml`. The `local-docs/` folder is in `.gitignore`, so it is **not** committed to this repo.
- To read it comfortably, open it in VS Code with an OpenAPI preview extension, or paste it into https://editor.swagger.io.
- Each endpoint lists who can call it (anyone / member / verified member / admin) and the SRS requirement it implements.

## Basics (from `openapi.yaml`)

| Topic    | Rule                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------- |
| Base URL | `VITE_API_URL`, ending in `/api/v1` (e.g. `http://localhost:3000/api/v1`)                      |
| Format   | JSON. `multipart/form-data` only for image uploads                                             |
| Auth     | `Authorization: Bearer <accessToken>` (15 min), renewed with `POST /auth/refresh`              |
| IDs      | UUID strings                                                                                   |
| Dates    | ISO 8601 UTC, e.g. `2026-11-27T18:30:00Z`                                                      |
| Language | `Accept-Language: ar` or `en` (error messages are translated)                                  |
| Lists    | `?page=1&pageSize=20` (max 50) → `{ "data": [...], "meta": { "page", "pageSize", "total" } }`  |
| Points   | Always integers. Balances and prices are computed by the backend; the frontend only shows them |

### Error (every 4xx / 5xx)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Some fields are invalid",
    "details": [{ "field": "phone", "message": "Phone number is already used" }]
  }
}
```

`code` is stable, so use it in code. `message` is already translated, so show it to the user. `details` appears only for `VALIDATION_ERROR`, with one item per field. The full list of codes is at the top of `openapi.yaml`.

> ⚠️ `src/shared/api/client.ts` and `src/shared/api/types.ts` still follow the first draft (a flat error with `errors`, plus `perPage`). Align them with this format when the first real endpoint (auth) is built.

## Building an endpoint

1. Find it in `openapi.yaml`.
2. Run `/add-endpoint` in Claude Code / Codex, or follow [06 · Mocking](06-mocking.md). This writes the Zod schema (matching the OpenAPI schema), the api function, the query hook and the MSW mock.
3. When the real backend is up, test with `VITE_USE_MOCKS=false`.
