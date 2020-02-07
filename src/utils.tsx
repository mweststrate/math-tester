import { useState, useEffect, useRef } from "react";

export function useAnimationFrame(deps: any[]) {
  const start = useRef(Date.now());
  const [_tick, setTick] = useState(0);
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
  }, deps);

  return Date.now() - start.current;
}
