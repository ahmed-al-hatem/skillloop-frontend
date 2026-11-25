---
name: add-endpoint
description: Wire one API endpoint end-to-end in a SkillLoop feature — Zod schema, api function, TanStack Query hook, and MSW mock handler — based on docs/05-api-contract.md. Use when the user asks to connect/fetch/call/mock an endpoint (e.g. "add GET /matches/suggestions"). Do not use for endpoints not in the contract.
---

# add-endpoint

## 1. Find it in the contract

Open `docs/05-api-contract.md` and locate the endpoint (method + path).

- **Not there?** STOP. Tell the user it must be agreed with the backend and added to the contract (both `.md` and `.ar.md`) first. Do not invent it.
- Note the request body, response `data` shape, and status codes.

## 2. Schema — `features/<f>/schemas/<entity>.schema.ts`

- Reuse shared schemas from `@/shared/schemas` (e.g. `UserSummarySchema`, `SkillSchema`) instead of redefining them.
- Export both the schema and the inferred type:

```ts
export const MatchSchema = z.object({ id: z.string() /* … */ });
export type Match = z.infer<typeof MatchSchema>;
```

- For request bodies, add `<Action>InputSchema` (also used by forms).

## 3. API function — `features/<f>/api/<f>.api.ts`

Use the shared client and validate the response:

```ts
import { api } from '@/shared/api/client';

export async function getSuggestions(): Promise<Match[]> {
  const res = await api.get('/matches/suggestions');
  return z.array(MatchSchema).parse(res.data.data);
}
```

## 4. Query/mutation hook — `features/<f>/api/<f>.queries.ts`

- Keep query keys in one object per feature:

```ts
export const matchingKeys = {
  all: ['matching'] as const,
  suggestions: () => [...matchingKeys.all, 'suggestions'] as const,
};
export const useSuggestions = () =>
  useQuery({ queryKey: matchingKeys.suggestions(), queryFn: getSuggestions });
```

- Mutations: `useMutation` + `queryClient.invalidateQueries({ queryKey: <keys>.all })` on success.

## 5. Mock — `features/<f>/mocks/`

- Data in `<f>.data.ts` — realistic, mixed Arabic/English names, typed with the schema type.
- Handler in `<f>.handlers.ts`, using the same envelope as the contract (`{ data, meta }` / error shape):

```ts
export const matchingHandlers = [
  http.get(`${env.API_URL}/matches/suggestions`, async () => {
    await delay(400);
    return HttpResponse.json({ data: suggestions });
  }),
];
```

- If this is the feature's first handler, register it in `src/mocks/handlers.ts` (one line).

## 6. Update the contract status

In `docs/05-api-contract.md` **and** `docs/05-api-contract.ar.md`, set the endpoint's Frontend column to `mocked`.

## 7. Verify

Run `npm run check`. Summarize the files touched for the user. Do not commit.
