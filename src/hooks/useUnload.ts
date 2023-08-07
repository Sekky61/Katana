// Hook to run a callback function when the user leaves the page
//
// Source: https://stackoverflow.com/questions/39094138/reactjs-event-listener-beforeunload-added-but-not-removed

import { useRef, useEffect } from 'react';

type BeforeUnloadEventListener = (ev: BeforeUnloadEvent) => any;

const useUnload = (fn: BeforeUnloadEventListener) => {
  const cb = useRef(fn); // init with fn, so that type checkers won't assume that current might be undefined

  useEffect(() => {
    cb.current = fn;
  }, [fn]);

  useEffect(() => {
    const onUnload = (ev: BeforeUnloadEvent) => cb.current?.(ev);

    window.addEventListener("beforeunload", onUnload);

    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);
};

export default useUnload;