import { Show, createSignal, onMount, For } from "solid-js";
import { PicaApi2 } from "../../api/api";
import ComicItem from "../../components/ComicItem";
import styles from "./index.module.css";

export default function RankView() {
  const [h24, setH24] = createSignal<Array<any>>([]);
  const [d7, setD7] = createSignal<Array<any>>([]);
  const [d30, setD30] = createSignal<Array<any>>([]);

  const [page, setPage] = createSignal(0);
  const [scrollY, setScrollY] = createSignal([0, 0, 0, 0]);

  function storeSY(pg: number) {
    setScrollY((prev) => {
      prev[pg] = window.pageYOffset;
      return prev;
    });
  }

  function setSY(pg: number) {
    window.scrollTo(0, scrollY()[pg]);
  }

  function loadH24() {
    storeSY(page());
    setPage(0);
    if (h24().length !== 0) {
      setSY(0);
      return;
    }
    PicaApi2.LeaderBoard("H24", "VC").then((res) => {
      if (res.code === 200) {
        setH24(res.data.comics);
      }
    });
  }
  function loadD7() {
    storeSY(page());
    setPage(1);
    if (d7().length !== 0) {
      setSY(1);
      return;
    }
    PicaApi2.LeaderBoard("D7", "VC").then((res) => {
      if (res.code === 200) {
        setD7(res.data.comics);
      }
    });
  }
  function loadD30() {
    storeSY(page());
    setPage(2);
    if (d30().length !== 0) {
      setSY(2);
      return;
    }
    PicaApi2.LeaderBoard("D30", "VC").then((res) => {
      if (res.code === 200) {
        setD30(res.data.comics);
      }
    });
  }
  onMount(() => {
    loadH24();
  });
  return (
    <div>
      <div
        style={{
          position: "fixed",
          width: "100%",
          "z-index": 2,
          top: 0,
        }}
      >
        <div
          class="header fade-in"
          style={{
            display: "flex",
            border: "1px solid #da9cb3",
            "border-radius": ".5rem",
            overflow: "hidden",
            margin: ".2rem .5rem",
          }}
        >
          <div
            style={{
              "background-color": page() === 0 ? "#da9cb3" : undefined,
              color: page() === 0 ? "white" : undefined,
            }}
            class={styles.segment}
            onClick={loadH24}
          >
            過去 24 小時
          </div>
          <div
            style={{
              "background-color": page() === 1 ? "#da9cb3" : undefined,
              color: page() === 1 ? "white" : undefined,
            }}
            class={styles.segment}
            onClick={loadD7}
          >
            過去 7 天
          </div>
          <div
            style={{
              "background-color": page() === 2 ? "#da9cb3" : undefined,
              color: page() === 2 ? "white" : undefined,
            }}
            class={styles.segment}
            onClick={loadD30}
          >
            過去 30 天
          </div>
          <div
            style={{
              "background-color": page() === 3 ? "#da9cb3" : undefined,
            }}
            class={styles.segment}
          >
            騎士榜
          </div>
        </div>
      </div>
      <div
        style={{
          "margin-top": "3rem",
          display: "flex",
          "flex-direction": "column",
          gap: "0.5rem",
        }}
      >
        <Show when={page() === 0}>
          <For each={h24()}>{(item) => <ComicItem comic={item} />}</For>
        </Show>
        <Show when={page() === 1}>
          <For each={d7()}>{(item) => <ComicItem comic={item} />}</For>
        </Show>
        <Show when={page() === 2}>
          <For each={d30()}>{(item) => <ComicItem comic={item} />}</For>
        </Show>
      </div>
    </div>
  );
}
