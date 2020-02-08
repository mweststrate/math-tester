import { useAll, selectNextQuestion, resetState, Question } from "./state";
import { useState, useRef } from "react";

import * as React from "react";

import {
  useToast,
  Box,
  Progress,
  Button,
  SimpleGrid,
  Stack,
  Text,
  Flex
} from "@chakra-ui/core";
import { useAnimationFrame } from "./utils";

export default function QuestionC() {
  const { state, update } = useAll();
  const q = state.selected!;
  const [input, setInput] = useState("");
  const handleRef = React.useRef<any>(0);
  const lapsed = useAnimationFrame([q]);
  const onTime = useRef(true);

  const toast = useToast();

  React.useEffect(() => {
    handleRef.current = setTimeout(() => {
      onTime.current = false;
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
          state.score += onTime.current ? 2 : 1;
          selectNextQuestion(state);
          onTime.current = true;
        })();
      } else {
        toast({
          title: "Fout :(",
          status: "error",
          duration: 1000,
          isClosable: false
        });
        update(state => {
          state.score -= 0.5;
        })();
      }
      setInput("");
    } else {
      setInput(input + ("" + answer));
    }
  };

  return (
    <Stack height="100vh" spacing={0}>
      <Stack flexGrow={2} spacing={0}>
        <Stack isInline justify="center" align="center" spacing="8">
          <Button
            variant="unstyled"
            onClick={update(state => {
              resetState(state);
            })}
          >
            Back
          </Button>
          <Text>
            {`${state.questionCount - state.questions.length} / ${
              state.questionCount
            }`}
          </Text>
        </Stack>
        <Progress
          color="pink"
          value={Math.round(
            ((state.questionCount - state.questions.length) /
              state.questionCount) *
              100
          )}
        />
        <Box>
          <Box
            width={
              Math.min(100, Math.round((lapsed / state.delay) * 100)) + "%"
            }
            height={3}
            background="pink"
          />
        </Box>
        <Flex align="center" justify="center" flexGrow={1} padding={2}>
          {renderQuestion(
            q,
            <Text color="red" display="inline">
              {input}_
            </Text>
          )}
        </Flex>
      </Stack>
      <Box flexGrow={0}>
        <SimpleGrid columns={3} spacing={0} p={5}>
          {new Array(10).fill(true, 1, 10).map((_, nr) => (
            <Button
              key={nr}
              onClick={() => onClick(nr)}
              width={"100%"}
              height={"12vh"}
              variantColor="pink"
              variant="solid"
              fontSize="1.5em"
            >
              {nr}
            </Button>
          ))}
          <Button
            key={"erase"}
            onClick={() => {
              setInput("");
            }}
            width={"100%"}
            height={"12vh"}
            variant="solid"
            fontSize="1.5em"
            color="grey"
          >
            {"<"}
          </Button>
          <Button
            key={0}
            onClick={() => onClick(0)}
            width={"100%"}
            height={"12vh"}
            variantColor="pink"
            variant="solid"
            fontSize="1.5em"
          >
            {0}
          </Button>
        </SimpleGrid>
      </Box>
    </Stack>
  );
}

function renderQuestion(q: Question, input: React.ReactNode) {
  if (q.type !== "number bonds") {
    return (
      <div style={{ margin: "20 auto", fontSize: "3em" }}>
        {q.question}
        {input}
      </div>
    );
  }
  // TODO: other question types
  let parts: any[] = q.question.split(",");
  // @ts-ignore
  parts = parts.map(part => (part === "?" ? (input as any) : part));
  return (
    <SimpleGrid columns={2} fontSize="2em" gridTemplateRows="40% 40%">
      <Box
        gridColumn="1 / 3"
        borderBottom="1px solid purple"
        textAlign="center"
      >
        {parts[2]}
      </Box>
      <Box padding={2} borderRight="1px solid purple">
        {parts[0]}
      </Box>
      <Box padding={2}>{parts[1]}</Box>
    </SimpleGrid>
  );
}
