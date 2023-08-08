// useSet hook - a React hook for convenient use of Set objects
//
// Source (adapted): https://www.30secondsofcode.org/react/s/use-set/

import { useCallback, useState } from "react";

// Public interface
export interface Actions<T> {
  add: (item: T) => void
  remove: (item: T) => void
  clear: Set<T>['clear']
}

// We hide some setters from the returned map to disable autocompletion
type Return<T> = [Set<T>, Actions<T>]

export function useSet<T>(initialValue: Set<T> = new Set()): Return<T> {
  const [set, setSet] = useState(new Set(initialValue));

  const actions: Actions<T> = {
    add: useCallback((item) => setSet(prevSet => new Set([...prevSet, item])), []),
    remove: useCallback((item) =>
      setSet(prevSet => new Set([...prevSet].filter(i => i !== item))), []),
    clear: useCallback(() => setSet(new Set()), []),
  }

  return [set, actions];
};