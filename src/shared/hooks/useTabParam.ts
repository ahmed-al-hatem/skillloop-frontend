import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

type UseTabParamOptions<V extends string> = {
  /** Search param name. Default `tab`. */
  param?: string;
  /** Tab shown when the param is missing or unknown; kept out of the URL. Default: first value. */
  defaultValue?: V;
};

/**
 * The selected tab kept in the URL (`?tab=resolved`), so links are shareable and a reload
 * keeps the tab. Changing tab resets `page` and replaces the history entry (arrow keys
 * select as they move, so pushing would fill Back with every tab passed).
 *
 *   const [tab, setTab] = useTabParam(['open', 'resolved'] as const);
 *   <Tabs items={...} label="حالة النزاع" value={tab} onValueChange={setTab}>…</Tabs>
 */
export function useTabParam<const V extends string>(
  values: readonly [V, ...V[]],
  { param = 'tab', defaultValue = values[0] }: UseTabParamOptions<V> = {},
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get(param);
  const value = values.find((v) => v === raw) ?? defaultValue;

  const setValue = useCallback(
    (next: V) => {
      setSearchParams(
        (prev) => {
          const result = new URLSearchParams(prev);
          if (next === defaultValue) result.delete(param);
          else result.set(param, next);
          result.delete('page');
          return result;
        },
        { replace: true },
      );
    },
    [param, defaultValue, setSearchParams],
  );

  return [value, setValue] as const;
}
