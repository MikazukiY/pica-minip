import { createSignal } from "solid-js";

interface Signal<T> {
  value: () => T;
  setValue: (value: T | ((prev: T) => T)) => void;
}

function createCustomSignal<T>(val: T): Signal<T> {
  const [s, setS] = createSignal(val);
  return {
    value() {
      return s();
    },
    setValue: setS,
  };
}

export interface SwipeState {
  innerRevealed: Signal<string | boolean>;
  isActive: Signal<boolean>;
  leftActionsWidth: Signal<number>;
  rightActionsWidth: Signal<number>;
  startLeft: Signal<number>;
  timer: Signal<number | undefined>;
  frame: Signal<number | undefined>;
  contentRef: HTMLElement | null;
  leftRef: HTMLElement | null;
  rightRef: HTMLElement | null;
  elRef: HTMLElement | null;
}

export function useSwipeState(
  initialRevealed: string | boolean = false,
  contentRef?: HTMLElement,
  leftRef?: HTMLElement,
  rightRef?: HTMLElement,
  elRef?: HTMLElement
) {
  const state: SwipeState = {
    innerRevealed: createCustomSignal(initialRevealed),
    isActive: createCustomSignal(false),
    leftActionsWidth: createCustomSignal(0),
    rightActionsWidth: createCustomSignal(0),
    startLeft: createCustomSignal(0),
    timer: createCustomSignal<number | undefined>(undefined),
    frame: createCustomSignal<number | undefined>(undefined),
    contentRef: contentRef ?? null,
    leftRef: leftRef ?? null,
    rightRef: rightRef ?? null,
    elRef: elRef ?? null,
  };

  return state;
}
