import { createEffect, onCleanup } from "solid-js";
import { position, leftClick, listenOpts } from "../utils/event";
import { setObserver, removeObserver } from "../utils/touch-observer";
import { remToPx } from "../utils/remToPx";

function getDirection(mod) {
  const none = mod.horizontal !== true && mod.vertical !== true;
  const dir = {
    all: none === true || (mod.horizontal === true && mod.vertical === true),
  };

  if (mod.horizontal === true || none === true) dir.horizontal = true;

  if (mod.vertical === true || none === true) dir.vertical = true;

  return dir;
}

function processChanges(evt, ctx, isFinal) {
  const pos = position(evt);
  let direction;
  const distX = pos.left - ctx.event.x;
  const distY = pos.top - ctx.event.y;
  const absDistX = Math.abs(distX);
  const absDistY = Math.abs(distY);

  if (ctx.direction.horizontal && !ctx.direction.vertical)
    direction = distX < 0 ? "left" : "right";
  else if (!ctx.direction.horizontal && ctx.direction.vertical)
    direction = distY < 0 ? "up" : "down";
  else if (absDistX >= absDistY) direction = distX < 0 ? "left" : "right";
  else direction = distY < 0 ? "up" : "down";

  return {
    evt,
    position: pos,
    direction,
    isFirst: ctx.event.isFirst,
    isFinal: isFinal === true,
    isMouse: ctx.event.mouse,
    duration: new Date().getTime() - ctx.event.time,
    distance: {
      x: absDistX,
      y: absDistY,
    },
    offset: {
      x: distX,
      y: distY,
    },
    delta: {
      x: pos.left - ctx.event.lastX,
      y: pos.top - ctx.event.lastY,
    },
  };
}

function shouldTrigger(ctx, changes) {
  if (ctx.direction.horizontal && ctx.direction.vertical) return true;

  if (ctx.direction.horizontal && !ctx.direction.vertical)
    return Math.abs(changes.delta.x) > 0;

  if (!ctx.direction.horizontal && ctx.direction.vertical)
    return Math.abs(changes.delta.y) > 0;

  return undefined;
}

export function useTouchPan(el, options) {
  createEffect(() => {
    if (!el) return;

    const mouse = options.mouse === true;
    const mouseEvtPassive =
      options.mouseMightPrevent !== true && options.mousePrevent !== true;
    const mouseEvtOpts =
      listenOpts.passive === undefined
        ? true
        : { passive: mouseEvtPassive, capture: true };
    const touchEvtPassive =
      options.mightPrevent !== true && options.prevent !== true;
    const touchEvtOpts = touchEvtPassive ? listenOpts.passive : null;

    const ctx = {
      handler: options.handler,
      direction: getDirection(options),
      event: null,
      start(evt) {
        removeObserver(ctx);
        setObserver(el, evt, ctx);

        const pos = position(evt);
        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          mouse: false,
          detected: false,
          abort: false,
          isFirst: true,
          isFinal: false,
          lastX: pos.left,
          lastY: pos.top,
        };
      },
      move(evt) {
        if (!ctx.event) return;
        if (ctx.event.abort === true) return;

        // 原生页面返回手势和这里的touch会同时触发，所以左边区域不响应touch
        if (ctx.event.x < 30) return;

        if (ctx.event.detected === true) {
          if (options.stop) evt.stopPropagation();
          if (options.prevent) evt.preventDefault();
          const changes = processChanges(evt, ctx, false);
          if (shouldTrigger(ctx, changes)) {
            ctx.handler(changes);
            ctx.event.lastX = changes.position.left;
            ctx.event.lastY = changes.position.top;
            ctx.event.isFirst = false;
          }
          return;
        }

        const pos = position(evt);
        const distX = Math.abs(pos.left - ctx.event.x);
        const distY = Math.abs(pos.top - ctx.event.y);

        if (distX === distY) return;

        ctx.event.detected = true;

        if (ctx.direction.all === false && ctx.event.mouse === false)
          ctx.event.abort = ctx.direction.vertical
            ? distX > distY
            : distX < distY;

        if (ctx.event.abort !== true) {
          document.body.classList.add("swipeout-no-pointer-events");
          document.body.classList.add("swipeout-non-selectable");
        }

        ctx.move(evt);
      },
      end(evt) {
        if (!ctx.event) return;
        removeObserver(ctx);

        document.body.classList.remove("swipeout-no-pointer-events");
        document.body.classList.remove("swipeout-non-selectable");

        if (
          ctx.event.abort === true ||
          ctx.event.detected !== true ||
          ctx.event.isFirst === true
        )
          return;

        ctx.handler(processChanges(evt, ctx, true));
      },
    };
    el.addEventListener("touchstart", ctx.start, touchEvtOpts);
    el.addEventListener("touchmove", ctx.move, touchEvtOpts);
    el.addEventListener("touchend", ctx.end, touchEvtOpts);
    el.addEventListener("touchcancel", ctx.end, touchEvtOpts);

    onCleanup(() => {
      el.removeEventListener("touchstart", ctx.start, touchEvtOpts);
      el.removeEventListener("touchmove", ctx.move, touchEvtOpts);
      el.removeEventListener("touchend", ctx.end, touchEvtOpts);
      el.removeEventListener("touchcancel", ctx.end, touchEvtOpts);
    });
  });
}
