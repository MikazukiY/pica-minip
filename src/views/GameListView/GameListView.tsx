import { For, Show, createSignal, onMount } from "solid-js";
import { FullScreenSpinner } from "../../components/Spinner/FullScreenSpinner";
import { LineCenterSpinner } from "../../components/Spinner/LineCenterSpinner";
import { GameListItem } from "./GameListItem";
import { PicaApi2 } from "../../api/api";
import { PicaGame } from "../../api/model";

export default function GameListView() {
  const [games, setGames] = createSignal<Array<PicaGame>>([]);
  const [page, setPage] = createSignal(0);
  const [total, setTotal] = createSignal(0);
  const [isLoading, setIsLoading] = createSignal(true);

  function nextPage() {
    if (page() !== 0 && page() === total()) {
      return;
    }
    const pg = page() + 1;
    setIsLoading(true);
    PicaApi2.Games(pg).then((res) => {
      if (res.code === 200) {
        setGames((cur) => [...cur, ...res.data.games.docs]);
        setPage(res.data.games.page);
        setTotal(res.data.games.pages);
        setIsLoading(false);
      }
    });
  }

  onMount(() => {
    nextPage();
  });

  return (
    <Show
      when={!isLoading() || games().length > 0}
      fallback={<FullScreenSpinner />}
    >
      <div>
        <div
          style={{
            display: "grid",
            "justify-content": "space-evenly",
            "grid-template-columns": "repeat(auto-fill, 11.5rem)",
            "row-gap": ".5rem",
            "margin-top": "8px",
          }}
        >
          <For each={games()}>{(item) => <GameListItem game={item} />}</For>
        </div>
        <div style={{ "margin-top": "15px" }}>
          <Show when={total() !== page() && !isLoading()}>
            <div style={{ "text-align": "center" }}>
              <button class="next-btn" onClick={nextPage}>
                next
              </button>
            </div>
          </Show>
          <Show when={isLoading() && games().length > 0}>
            <LineCenterSpinner />
          </Show>
        </div>
      </div>
    </Show>
  );
}
