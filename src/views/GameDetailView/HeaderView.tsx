import { Show, createSignal } from "solid-js";
import { HandleImg } from "../../utils";
import iconGiftOff from "../../assets/icon_gift_off.png";
import iconGameH from "../../assets/icon_game_h.png";
import iconGameAndroid from "../../assets/icon_game_android.png";
import iconGameIOS from "../../assets/icon_game_ios.png";
import iconGameRecommend from "../../assets/icon_game_recommend.png";
import commonIcon from "../../assets/icon_comment.png";
import { PicaApi2 } from "../../api/api";
import likeImg from "../../assets/icon_like.png";
import likeOffImg from "../../assets/icon_like_off.png";
import { PicaGameDetail } from "../../api/model";
import { navigateTo, openWebsite } from "minip-bridge";

export function HeaderView({ game }: { game: PicaGameDetail }) {
  const {
    _id,
    title,
    icon,
    publisher,
    ios,
    iosLinks,
    android,
    // @ts-ignore
    androidLinks,
    adult,
    suggest,
    // @ts-ignore
    androidSize,
    iosSize,
    likesCount,
    isLiked,
    commentsCount,
  } = game;

  const [isL, setIsL] = createSignal(isLiked);
  const [lC, setLc] = createSignal(likesCount);
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "5px",
          height: "5.8rem",
        }}
      >
        <div
          style={{
            width: "5rem",
          }}
        >
          <img
            style={{
              width: "5rem",
              height: "5rem",
              "border-radius": "10px",
              "object-fit": "cover",
            }}
            src={HandleImg(icon)}
          />
        </div>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
          }}
        >
          <span
            style={{
              "font-size": "1rem",
              "font-weight": 500,
            }}
          >
            {title}
          </span>
          <div
            style={{
              "margin-top": "4px",
            }}
          >
            <Show when={suggest}>
              <img
                style={{
                  width: "2rem",
                  "margin-left": "5px",
                }}
                src={iconGameRecommend}
              />
            </Show>
            <Show when={adult}>
              <img
                style={{
                  width: "2rem",
                  "margin-left": "5px",
                }}
                src={iconGameH}
              />
            </Show>
            <Show when={android}>
              <img
                style={{
                  width: "2rem",
                  "margin-left": "5px",
                }}
                src={iconGameAndroid}
              />
            </Show>
            <Show when={ios}>
              <img
                style={{
                  width: "2rem",
                  "margin-left": "5px",
                }}
                src={iconGameIOS}
              />
            </Show>
          </div>
          <div
            style={{
              "font-size": ".8rem",
              color: "gray",
            }}
          >
            <div>{publisher}</div>
            <div>{iosSize} MB</div>
          </div>
        </div>
        <div
          style={{
            width: "3rem",
          }}
        >
          <img
            style={{
              width: "3rem",
              height: "3rem",
            }}
            src={iconGiftOff}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          margin: ".5rem 0",
          "justify-content": "space-between",
        }}
      >
        <button
          style={{
            "background-color": "#E09BB7",
            border: "0",
            "font-size": "1.1rem",
            color: "white",
            "font-weight": 600,
            "border-radius": "2rem",
            "padding-left": "2.5rem",
            "padding-right": "2.5rem",
            margin: ".2rem 0",
            width: "11rem",
          }}
          onClick={() => {
            openWebsite(iosLinks[0]);
          }}
        >
          下载
        </button>
        <div
          onClick={() => {
            navigateTo({
              page: `index.html?page=comments&game_id=${_id}`,
              title: "发表评论-" + title,
            });
          }}
        >
          <img
            style={{
              width: "3rem",
              height: "3rem",
            }}
            src={commonIcon}
          />
          <span
            style={{
              position: "absolute",
              color: "white",
              "background-color": "red",
              "border-radius": "1rem",
              padding: "0 .5rem",
              "margin-left": `-${String(commentsCount).length / 3 + 0.5}rem`,
            }}
          >
            {commentsCount}
          </span>
        </div>
        <div
          style={{
            "margin-right": "2rem",
          }}
          onClick={() => {
            PicaApi2.GameLike(_id).then((res) => {
              if (res.code === 200) {
                setIsL(res.data.action === "like");
                setLc(res.data.action === "like" ? lC() + 1 : lC() - 1);
              }
            });
          }}
        >
          <img
            style={{
              width: "3rem",
              height: "3rem",
            }}
            src={isL() ? likeImg : likeOffImg}
          />
          <span
            style={{
              position: "absolute",
              color: "white",
              "background-color": "red",
              "border-radius": "1rem",
              padding: "0 .5rem",
              "margin-left": `-${String(lC()).length / 3 + 0.5}rem`,
            }}
          >
            {lC()}
          </span>
        </div>
      </div>
    </div>
  );
}
