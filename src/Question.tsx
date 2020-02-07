import { useAll, selectNextQuestion, resetState, Question } from "./state";
import { useState } from "react";

import * as React from "react";

import { useToast, Box, Progress, Button } from "@chakra-ui/core";
import { useAnimationFrame } from "./utils";

export default function QuestionC() {
  const { state, update } = useAll();
  const q = state.selected!;
  const [input, setInput] = useState("");
  const handleRef = React.useRef<any>(0);
  const lapsed = useAnimationFrame([q]);

  const toast = useToast();

  React.useEffect(() => {
    handleRef.current = setTimeout(() => {
      toast({
        title: "Too slow",
        status: "error",
        duration: 1000,
        isClosable: false
      });
    }, state.delay);

    return () => {
      clearInterval(handleRef.current);
    };
  }, [q]);

  const onClick = (answer: number) => {
    // TODO: use strings instead of numbers
    const newInput = input + ("" + answer);
    console.log(newInput, ("" + q.answer).length);
    if (newInput.length === ("" + q.answer).length) {
      if (newInput === "" + q.answer) {
        clearTimeout(handleRef.current);
        toast({
          title: "Goed!",
          status: "success",
          duration: 1000,
          isClosable: false
        });
        update(state => {
          selectNextQuestion(state);
        })();
      } else {
        toast({
          title: "Fout :(",
          status: "error",
          duration: 1000,
          isClosable: false
        });
      }
      setInput("");
    } else {
      setInput(input + ("" + answer));
    }
  };

  return (
    <Box>
      <Progress
        value={Math.round(
          ((state.questionCount - state.questions.length) /
            state.questionCount) *
            100
        )}
      />
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            width: Math.round((lapsed / state.delay) * 100) + "%",
            height: 8,
            backgroundColor: "red"
          }}
        />
      </div>
      {renderQuestion(q)}
      <hr />
      {input}_<br />
      {new Array(10).fill(true, 0, 10).map((_, nr) => (
        <Button
          key={nr}
          onClick={() => onClick((nr + 1) % 10)}
          m={5}
          width={50}
          height={50}
        >
          {(nr + 1) % 10}
        </Button>
      ))}
      <Button width={50} height={50} bg="darkred" onClick={() => {
        setInput("")
      }}>🧹
        </Button>
      <hr />
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

function renderQuestion(q: Question) {
  if (q.type !== "number bonds") {
    return <div style={{ margin: "20 auto", fontSize: "3em" }}>{q.question}</div>
  }
  // TODO: other question types
  const parts = q.question.split(",");
  return (
    <div>
      <table style={{ margin: "auto", fontSize: "3em" }}>
        <tbody>
          <tr>
            <td
              colSpan={2}
              style={{ borderBottom: "2px solid black", padding: 20 }}
            >
              {parts[2]}
            </td>
          </tr>
          <tr>
            <td style={{ borderRight: "2px solid black", padding: 20 }}>
              {parts[0]}
            </td>
            <td style={{ padding: 20 }}>{parts[1]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
