import { HandleImg, LazyLoad } from "../../utils";
import icon18 from "../../assets/icon_game_h.png";
import iconRecommend from "../../assets/icon_game_recommend.png";
import { Show } from "solid-js";
import { PicaGame } from "../../api/model";
import { navigateTo } from "minip-bridge";

export function GameListItem({ game }: { game: PicaGame }) {
  return (
    <div
      style={{
        height: "9.5rem",
        "box-shadow": "0 0 8px gray",
      }}
      onClick={() =>
        navigateTo({
          page: "index.html?page=game_detail&game_id=" + game._id,
          title: game.title,
        })
      }
    >
      <div
        style={{
          height: "6rem",
        }}
      >
        <img
          ref={(e) => {
            LazyLoad(e);
          }}
          class="lazy-img"
          data-src={HandleImg(game.icon)}
          style={{
            height: "6rem",
            width: "11.5rem",
            "object-fit": "cover",
            position: "absolute",
          }}
        />
        <Show when={game.adult}>
          <img
            style={{
              width: "2.6rem",
              position: "absolute",
              "z-index": 1,
              "margin-left": "8.8rem",
              "margin-top": "0.1rem",
            }}
            src={icon18}
          />
        </Show>
        <Show when={game.suggest}>
          <img
            style={{
              width: "2.6rem",
              position: "absolute",
              "z-index": 1,
              "margin-left": "8.8rem",
              "margin-top": "6.3rem",
            }}
            src={iconRecommend}
          />
        </Show>
      </div>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "justify-content": "space-evenly",
          height: "3.5rem",
          padding: "0 4px",
        }}
      >
        <div
          style={{
            "font-size": "1rem",
            "font-weight": 600,
            overflow: "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
          }}
        >
          {game.title}
        </div>
        <div
          style={{
            color: "gray",
            "font-size": "0.9rem",
          }}
        >
          {game.publisher}
        </div>
      </div>
    </div>
  );
}
