import * as React from "react";
import "./styles.css";
import { RadioGroup, Radio } from "@chakra-ui/core";
import { Box, Heading, Stack, Button } from "@chakra-ui/core";
import {
  qtypes,
  QType,
  generateQuestions,
  selectNextQuestion,
  useAll
} from "./state";

export default function Configure() {
  const { state, update } = useAll();

  return (
    <Stack isInline spacing={8} align="center" direction="column">
      <Feature title="Type of questions">
        {Object.keys(qtypes).map(((qtype: QType) => (
          <Button
            key={qtype}
            variant={state.questionTypes[qtype] ? "solid" : "ghost"}
            variantColor="teal"
            onClick={update(state => {
              state.questionTypes[qtype] = !state.questionTypes[qtype];
            })}
          >
            {qtype}
          </Button>
        )) as any)}
      </Feature>
      <Feature title="Numbers to test">
        {state.selectedNumbers.map((selected, nr) => (
          <Button
            key={nr}
            variant={state.selectedNumbers[nr] ? "solid" : "ghost"}
            variantColor="teal"
            onClick={update(state => {
              state.selectedNumbers[nr] = !state.selectedNumbers[nr];
            })}
          >
            {nr + 1}
          </Button>
        ))}
      </Feature>
      <Feature title="Speed">
        <RadioGroup
          onChange={e => {
            const value = parseInt(e.target.value);
            update(state => {
              state.delay = value;
            })();
          }}
          value={"" + state.delay}
        >
          <Radio value="2000">2 seconds</Radio>
          <Radio value="5000">Five seconds</Radio>
          <Radio value="10000">10 secs</Radio>
          <Radio value="60000">Minute</Radio>
        </RadioGroup>
        <Button
          onClick={update(state => {
            generateQuestions(state);
            state.step = "started";
            selectNextQuestion(state);
          })}
        >
          Start!
        </Button>
      </Feature>
    </Stack>
  );
}

function Feature({ title, children }: any) {
  return (
    <Box p={5} shadow="md" borderWidth="1px" flex="1" rounded="md">
      <Heading fontSize="xl">{title}</Heading>
      <Box mt={4}>{children}</Box>
    </Box>
  );
}
