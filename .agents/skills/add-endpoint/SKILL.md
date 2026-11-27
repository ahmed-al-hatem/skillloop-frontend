---
name: add-endpoint
description: Wire one API endpoint end-to-end in a SkillLoop feature — Zod schema, api function, TanStack Query hook, and MSW mock handler — based on the backend's openapi.yaml (see docs/05-api-contract.md). Use when the user asks to connect/fetch/call/mock an endpoint (e.g. "add GET /categories"). Do not use for endpoints not in openapi.yaml.
---

# add-endpoint

## 1. Find it in the contract

The contract is the backend's `openapi.yaml`, kept locally at `local-docs/api/openapi.yaml` (gitignored). Rules in `docs/05-api-contract.md`.

- **File missing?** STOP. Ask the user for the latest `openapi.yaml` from the backend team.
- **Endpoint not there?** STOP. Tell the user the backend team must add it to `openapi.yaml` first. Do not invent it.
- Note who can call it, the request body/query, the response schema (follow its `$ref`s under `components/schemas`), and the error codes.

## 2. Schema — `features/<f>/schemas/<entity>.schema.ts`

- Mirror the OpenAPI schema field by field (UUID ids → `z.string()`, points → `z.number().int()`, dates → ISO strings).
- A schema used by 2+ features goes in `src/shared/schemas/` (create the folder if needed) instead of being redefined.
- Export both the schema and the inferred type:

```ts
export const CategorySchema = z.object({ id: z.string() /* … */ });
export type Category = z.infer<typeof CategorySchema>;
```

- For request bodies, add `<Action>InputSchema` (also used by forms).

## 3. API function — `features/<f>/api/<f>.api.ts`

Use the shared client and validate the response. Match the response shape in `openapi.yaml`:

- single object (no envelope) → `XSchema.parse(res.data)`
- list `{ data }` → `listSchema(XSchema).parse(res.data).data` (from `@/shared/api/types`)
- paginated `{ data, meta }` → `paginatedSchema(XSchema).parse(res.data)`, params typed with `PageParams`

```ts
import { api } from '@/shared/api/client';
import { listSchema } from '@/shared/api/types';

export async function getCategories(): Promise<Category[]> {
  const res = await api.get('/categories');
  return listSchema(CategorySchema).parse(res.data).data;
}
```

## 4. Query/mutation hook — `features/<f>/api/<f>.queries.ts`

- Keep query keys in one object per feature:

```ts
export const categoriesKeys = {
  all: ['categories'] as const,
  list: () => [...categoriesKeys.all, 'list'] as const,
};
export const useCategories = () =>
  useQuery({ queryKey: categoriesKeys.list(), queryFn: getCategories });
```

- Mutations: `useMutation` + `queryClient.invalidateQueries({ queryKey: <keys>.all })` on success.

## 5. Mock — `features/<f>/mocks/`

- Data in `<f>.data.ts` — realistic, mixed Arabic/English names, typed with the schema type.
- Handler in `<f>.handlers.ts`, using the same shape as `openapi.yaml` (single objects bare, lists `{ data }`, paginated `{ data, meta: { page, pageSize, total } }`, errors `{ error: { code, message, details? } }`):

```ts
export const categoriesHandlers = [
  http.get(`${env.API_URL}/categories`, async () => {
    await delay(400);
    return HttpResponse.json({ data: categories });
  }),
];
```

- If this is the feature's first handler, register it in `src/mocks/handlers.ts` (one line).

## 6. Verify

Run `npm run check`. Summarize the files touched for the user. Do not commit.
