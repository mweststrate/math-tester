import { useState, useEffect, useRef } from "react";

export function useAnimationFrame(deps: any[]) {
  const start = useRef(Date.now());
  const setTick = useState(0)[1];
  useEffect(() => {
    let done = false;
    function next() {
      requestAnimationFrame(() => {
        if (!done) {
          setTick(x => x + 1);
          next();
        }
      });
    }
    next();
    return () => {
      start.current = Date.now();
    };
  // eslint-disable-next-line
  }, deps);

  return Date.now() - start.current;
}
