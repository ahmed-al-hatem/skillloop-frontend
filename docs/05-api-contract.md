# 05 · API contract

**English** · [العربية](05-api-contract.ar.md)

The agreement between frontend and backend. **We only call endpoints listed here.** A new endpoint is agreed with the backend first, then added here (both languages), then built.

## Conventions

- **Base URL:** `VITE_API_URL` (e.g. `http://localhost:8000/api/v1`)
- **Auth:** `Authorization: Bearer <token>` — added automatically by `shared/api/client.ts`
- **JSON** in and out, field names in `camelCase`, dates in ISO 8601 UTC (`2026-11-25T10:00:00Z`), IDs as strings.

### Success

```json
{ "data": { ... }, "meta": { ... } }
```

### Paginated list

```json
{
  "data": [ ... ],
  "meta": { "page": 1, "perPage": 20, "total": 57, "totalPages": 3 }
}
```

Query: `?page=1&perPage=20`. Frontend type: `Paginated<T>` / `paginatedSchema(item)`.

### Error (every 4xx / 5xx)

```json
{
  "message": "The given data was invalid.",
  "code": "VALIDATION_ERROR",
  "errors": { "email": ["The email has already been taken."] }
}
```

`errors` only on 422. In the frontend every failure becomes an `ApiRequestError` (`message`, `code`, `status`, `errors`).

| Status | Meaning                 | Frontend does                       |
| ------ | ----------------------- | ----------------------------------- |
| 401    | Not logged in / expired | Clears the token, auth handler runs |
| 403    | Not allowed             | Show message                        |
| 404    | Not found               | Show `EmptyState` / not-found       |
| 422    | Validation              | Show `errors` under the form fields |
| 5xx    | Server error            | `ErrorState` with retry             |

## Endpoints

Status (Frontend column): `—` not started · `mocked` MSW handler exists · `live` tested against the real backend.

| Method | Path                   | Feature  | Response `data` | Status (BE) | Frontend |
| ------ | ---------------------- | -------- | --------------- | ----------- | -------- |
| GET    | `/matches/suggestions` | matching | `Match[]`       | draft       | mocked   |

> `GET /matches/suggestions` is a **draft example** to show the format — confirm it with the backend team.
> Add the rest (auth, profile, exchanges, time-bank, reviews) as they are agreed.

## Endpoint details

### GET `/matches/suggestions`

Suggested partners for the current user.

```json
{
  "data": [
    {
      "id": "m1",
      "partner": { "id": "u1", "name": "Sara", "avatarUrl": null, "rating": 4.8 },
      "theyOffer": [{ "id": "s1", "name": "Photoshop", "category": "design" }],
      "theyWant": [{ "id": "s2", "name": "React", "category": "programming" }],
      "score": 92
    }
  ]
}
```

Schema: `features/matching/schemas/match.schema.ts`.

## Adding an endpoint (template)

```md
### METHOD `/path`

What it does, who can call it.

Request body / query: …
Response `data`: … (JSON example)
Errors: 404 …, 422 …
```

Then: add the row to the table → `/add-endpoint` (or follow [06 · Mocking](06-mocking.md)) → set Frontend to `mocked`.
