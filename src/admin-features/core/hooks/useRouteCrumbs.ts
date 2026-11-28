import { useEffect } from 'react';
import { useMatches } from 'react-router';
import type { AdminRouteHandle } from '../routes';

export type RouteCrumb = { id: string; label: string; to: string };

function hasCrumb(handle: unknown): handle is AdminRouteHandle {
  return typeof handle === 'object' && handle !== null && 'crumb' in handle;
}

/**
 * Breadcrumb from every matched route's `handle.crumb`, outermost first.
 * Also sets `document.title` to the current page's crumb.
 */
export function useRouteCrumbs(): RouteCrumb[] {
  const crumbs = useMatches().flatMap((match) =>
    hasCrumb(match.handle) ? [{ id: match.id, label: match.handle.crumb, to: match.pathname }] : [],
  );
  const current = crumbs.at(-1)?.label;

  useEffect(() => {
    const previous = document.title;
    document.title = current ? `${current} · إدارة SkillLoop` : 'إدارة SkillLoop';
    return () => {
      document.title = previous;
    };
  }, [current]);

  return crumbs;
}
