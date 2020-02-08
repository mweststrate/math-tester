import { useContext, createContext } from "react";

export const qtypes = {
  multiply: false,
  division: false,
  "number bonds": true,
  add: false,
  subtract: false
};

export type QType = keyof typeof qtypes;

const generators = {
  multiply(nr: number, questions: Question[]) {
    for (let i = 0; i < 12; i++) {
      questions.push({
        type: "multiply",
        question: `${i} x ${nr} = `,
        answer: nr * i
      });
      questions.push({
        type: "multiply",
        question: `${i} x ${nr} = `,
        answer: nr * i
      });
    }
  },
  division(nr: number, questions: Question[]) {
    for (let i = 1; i < 10; i++) {
      questions.push({
        type: "division",
        question: `${i * nr} ÷ ${nr} = `,
        answer: i
      });
      questions.push({
        type: "division",
        question: `${i * nr} ÷ ${i} = `,
        answer: nr
      });
    }
  },
  add(nr: number, questions: Question[]) {
    for (let i = 1; i < nr; i++) {
      questions.push({
        type: "add",
        question: `${i} + ${nr} = `,
        answer: i + nr
      });
      questions.push({
        type: "add",
        question: `${nr} + ${i} = `,
        answer: nr + i
      });
    }
  },
  subtract(nr: number, questions: Question[]) {
    for (let i = 1; i < nr; i++) {
      questions.push({
        type: "subtract",
        question: `${nr} - ${i} = `,
        answer: nr - i
      });
      questions.push({
        type: "subtract",
        question: `${nr+i} - ${nr} = `,
        answer: i
      });
      questions.push({
        type: "subtract",
        question: `${nr+i} - ${i} = `,
        answer: nr
      });
    }
  },
  "number bonds"(nr: number, questions: Question[]) {
    for (let i = 0; i <= Math.floor(nr / 2); i++) {
      questions.push({
        type: "number bonds",
        question: `${i},?,${nr}`,
        answer: nr - i
      });
      questions.push({
        type: "number bonds",
        question: `${nr - i},?,${nr}`,
        answer: i
      });
      questions.push({
        type: "number bonds",
        question: `${i},${nr - i},?`,
        answer: nr
      });
    }
  }
};

export interface State {
  step: "configure" | "started" | "done";
  selectedNumbers: boolean[];
  questionTypes: typeof qtypes;
  questions: Question[];
  questionCount: number;
  delay: number;
  selected?: Question;
  score: number;
}

export interface Question {
  type: QType;
  question: string;
  answer: number;
}

type Update = (recipe: (state: State, ...args: any[]) => void) => () => void;

export function initialState(): State {
  return {
    step: "configure",
    selectedNumbers: new Array(20).fill(false, 0, 20).fill(true, 2, 5),
    questionTypes: { ...qtypes },
    questionCount: 0,
    questions: [],
    delay: 5000,
    score: 0
  };
}

export function generateQuestions(state: State) {
  state.questions.splice(0);
  Object.keys(state.questionTypes).forEach((q: any) => {
    if ((state.questionTypes as any)[q])
      state.selectedNumbers.forEach((selected, x) => {
        if (selected) (generators as any)[q](x + 1, state.questions);
      });
  });
  // randomly remove questions until we have 20
  while(state.questions.length > 20) {
    state.questions.splice(Math.floor(Math.random() * state.questions.length), 1)
  }
  state.questionCount = state.questions.length;
}

export function selectNextQuestion(state: State) {
  if (state.questions.length === 0) {
    state.step = "done";
    return;
  }
  const idx = Math.floor(state.questions.length * Math.random());
  state.selected = state.questions[idx];
  state.questions.splice(idx, 1);
}

export const Context = createContext<{ state: State; update: Update }>(
  undefined as any
);

export function useAll() {
  return useContext(Context);
}

export function resetState(state: State) {
  Object.assign(state, {
    step: "configure",
    questions: [],
    score: 0
  });
}
