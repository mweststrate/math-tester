import * as React from "react";
import "./styles.css";
import produce from "immer";
import { useState, useCallback } from "react";
import { ThemeProvider, theme, Box } from "@chakra-ui/core";
import { Button } from "@chakra-ui/core";
import { initialState, State, Context, useAll, resetState } from "./state";
import Configure from "./Configure";
import Question from "./Question";

export default function App() {
  const [state, _setState] = useState(initialState);
  const update = useCallback((fn: (state: State, ...args: any[]) => void) => {
    return function(...args: any[]) {
      _setState(state => produce(fn)(state, ...args));
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={{ state, update }}>
        <div className="App">
          {state.step === "configure" ? (
            <Configure />
          ) : state.step === "started" ? (
            <Question />
          ) : (
            <TheEnd />
          )}
        </div>
      </Context.Provider>
    </ThemeProvider>
  );
}

function TheEnd() {
  const { state, update } = useAll();
  return (
    <Box padding={5} bg="pink" color="white" height="100vh">
      Completed on level {11 - (state.delay / 1000)}! Score:
      <p style={{fontSize: "3em"}}>
      {Math.round(100*(state.score / (state.questionCount * 2)))}
      </p>
      <Button
        onClick={update(state => {
          resetState(state);
        })}
      >
        Start again
      </Button>
    </Box>
  );
}
