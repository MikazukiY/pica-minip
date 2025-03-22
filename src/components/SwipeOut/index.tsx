import "./index.css";
// @ts-ignore
import vTouchPan from "./directives/touch-horizontal-pan";
// @ts-ignore
import { useTouchPan } from "./directives/touch-pan";
import { createSignal, JSXElement, onCleanup, onMount, Show } from "solid-js";
import { useSwipeState } from "./composables/useSwipeState";
import { useSwipeAnimation } from "./composables/useSwipeAnimation";
import { Direction, useSwipeReveal } from "./composables/useSwipeReveal";
import { useSwipeGestures } from "./composables/useSwipeGestures";

export interface SwipeOutProps {
  threshold?: number;
  revealed?: string | boolean;
  disabled?: boolean;
  passiveListeners?: boolean;
  children: JSXElement;
  left?: JSXElement;
  right?: JSXElement;
  onRevealedUpdate?(e: "update:revealed", value: Direction): void;
  onClosed?(e: "closed"): void;
  onRevealed?(
    e: "revealed",
    value: { side: "left" | "right"; close: () => void }
  ): void;
  onLeftRevealed?(e: "leftRevealed", value: { close: () => void }): void;
  onRightRevealed?(e: "rightRevealed", value: { close: () => void }): void;
  onActive?(e: "active", value: boolean): void;
}

export default function SwipeOut({
  threshold = 45,
  disabled = false,
  passiveListeners = false,
  children,
  left,
  right,
  onRevealedUpdate,
  onClosed,
  onRevealed,
  onLeftRevealed,
  onRightRevealed,
  onActive,
}: SwipeOutProps) {
  let [elRef, leftRef, rightRef, contentRef]: any[] = [];

  onMount(() => {
    function emit(
      e:
        | "update:revealed"
        | "closed"
        | "revealed"
        | "leftRevealed"
        | "rightRevealed"
        | "active",
      value?:
        | Direction
        | { side: "left" | "right"; close: () => void }
        | { close: () => void }
        | boolean
    ) {
      switch (e) {
        case "update:revealed":
          if (onRevealedUpdate) onRevealedUpdate(e, value as Direction);
          break;
        case "closed":
          if (onClosed) onClosed(e);
          break;
        case "revealed":
          if (onRevealed)
            onRevealed(
              e,
              value as { side: "left" | "right"; close: () => void }
            );
          break;
        case "leftRevealed":
          if (onLeftRevealed) onLeftRevealed(e, value as { close: () => void });
          break;
        case "rightRevealed":
          if (onRightRevealed)
            onRightRevealed(e, value as { close: () => void });
          break;
        case "active":
          if (onActive) onActive(e, value as boolean);
          break;
      }
    }
    const state = useSwipeState(
      undefined,
      contentRef,
      leftRef,
      rightRef,
      elRef
    );
    const { animateSlide } = useSwipeAnimation(state, { left, right });
    const { reveal } = useSwipeReveal(state, animateSlide, emit);

    const slots = { left, right };
    const { onPan } = useSwipeGestures({
      state,
      slots,
      threshold: createSignal(threshold)[0],
      disabled: createSignal(disabled)[0],
      animateSlide,
      reveal,
      emit,
    });

    useTouchPan(contentRef, {
      handler: onPan,
      horizontal: true,
      prevent: !passiveListeners,
    });

    onCleanup(() => {
      clearTimeout(state.timer.value());
      if (state.frame.value() !== undefined) {
        cancelAnimationFrame(state.frame.value()!);
      }
    });
  });
  return (
    <div ref={elRef} class={`swipeout ${disabled ? "swipeout--disabled" : ""}`}>
      <Show when={left}>
        <div class="swipeout-left" ref={leftRef}>
          {left}
        </div>
      </Show>
      <Show when={right}>
        <div class="swipeout-right" ref={rightRef}>
          {right}
        </div>
      </Show>
      <div ref={contentRef} class="swipeout-content">
        {children}
      </div>
    </div>
  );
}
