import { Match, Switch, createSignal, onMount } from "solid-js";
import { FullScreenSpinner } from "../../components/Spinner/FullScreenSpinner";
import { GameCover } from "./GameCover";
import { HandleImg } from "../../utils";
import { HeaderView } from "./HeaderView";
import { ScreenShotsView } from "./ScreenShotsView";
import { PicaApi2 } from "../../api/api";
import { PicaGameDetail } from "../../api/model";

export default function GameDetailView({ gameId }: { gameId: string }) {
  const [game, setGame] = createSignal<PicaGameDetail | null>(null);

  const [loaded, setLoaded] = createSignal(false);
  const [error, setERROR] = createSignal<Error | null>(null);
  onMount(() => {
    PicaApi2.GameDetail(gameId)
      .then((res) => {
        if (res.code === 200) {
          setGame(res.data.game);
          return;
        }
        setERROR(new Error(JSON.stringify(res)));
      })
      .catch((err) => setERROR(err.message))
      .finally(() => {
        setLoaded(true);
      });
  });

  return (
    <Switch fallback={<FullScreenSpinner />}>
      <Match when={loaded() && error()}>
        <div
          style={{
            "word-break": "break-all",
          }}
        >
          {error()?.message}
        </div>
      </Match>
      <Match when={loaded()}>
        <div class="fade-in">
          <GameCover
            pic={HandleImg(game()!.screenshots[0])}
            videoLink={game()!.videoLink}
          />
          <div
            style={{
              "margin-top": ".5rem",
              "margin-left": ".5rem",
              "margin-right": ".5rem",
            }}
          >
            <HeaderView game={game()!} />
          </div>
          <div>
            <ScreenShotsView screenshots={game()!.screenshots} />
          </div>
          <div
            style={{
              "margin-left": ".5rem",
              "margin-right": ".5rem",
            }}
          >
            <div
              style={{
                "font-size": ".9rem",
                "font-weight": 500,
                "margin-top": "8px",
              }}
            >
              最近更新
            </div>
            <div
              style={{
                "white-space": "pre-line",
                "font-size": ".8rem",
                "margin-top": "8px",
              }}
              class="selectable"
            >
              {game()!.updateContent}
            </div>
            <div
              style={{
                "font-size": ".9rem",
                "font-weight": 500,
                "margin-top": "8px",
              }}
            >
              游戏简介
            </div>
            <div
              style={{
                "white-space": "pre-line",
                "font-size": ".8rem",
                "margin-top": "8px",
              }}
              class="selectable"
            >
              {game()!.description}
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  );
}
