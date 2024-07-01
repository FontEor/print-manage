import type { RouteLocationRaw, Router } from 'vue-router';

import { useRouter } from 'vue-router';

export type PathAsPageEnum<T> = T;
export type RouteLocationRawEx = PathAsPageEnum<RouteLocationRaw>;

function handleError(e: Error) {
  console.error(e);
}

/**
 * page switch
 */
export function useGo(_router?: Router) {
  const { push, replace } = _router || useRouter();
  async function go(opt: RouteLocationRawEx, isReplace = false, needReaload = false) {
    if (!opt) {
      return;
    }
    isReplace ? await replace(opt).catch(handleError) : await push(opt).catch(handleError);
    needReaload ? location.reload() : null;
  }
  return go;
}
