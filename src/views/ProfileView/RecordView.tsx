import registerNameImg from "../../assets/register_name.png";
import ArrowRight from "../../assets/arrow-right.svg";
import { For, Show } from "solid-js";
import { HandleImg } from "../../utils";
import { navigateTo } from "minip-bridge";

function RecordCollection({ comics }: { comics: any }) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          "justify-content": "space-between",
          "grid-template-columns": "repeat(auto-fill, 21vw)",
        }}
      >
        <For each={comics()}>
          {(item) => (
            <div
              style={{
                width: "21vw",
                height: "29vw",
              }}
              onClick={() => {
                navigateTo({
                  page: `index.html?id=${item._id}&page=comic_detail`,
                  title: item.title,
                });
              }}
            >
              <div>
                <img
                  style={{
                    width: "21vw",
                    height: "28vw",
                    "border-radius": ".5rem",
                    "object-fit": "cover",
                  }}
                  src={"minipimg" + HandleImg(item.thumb)}
                  class="fade-in"
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  "text-overflow": "ellipsis",
                  "white-space": "nowrap",
                  height: "1rem",
                  "font-size": ".8rem",
                  color: "gray",
                  "text-align": "center",
                }}
              >
                {item.title}
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export function RecordView({
  fav,
  favTotal,
  his,
  hisTotal,
}: {
  fav: any;
  favTotal: any;
  his: any;
  hisTotal: any;
}) {
  return (
    <div
      style={{
        "margin-top": "10px",
        padding: "0 15px",
      }}
    >
      <div>
        <hr />
        <div
          style={{
            display: "flex",
          }}
          onClick={() =>
            navigateTo({
              page: "index.html?page=history",
              title: "最近观看的本子",
            })
          }
        >
          <img
            style={{
              width: "1.4rem",
            }}
            src={registerNameImg}
          />
          <div
            style={{
              "margin-left": "5px",
              flex: 1,
            }}
          >
            最近觀看
          </div>
          <div
            style={{
              color: "gray",
              width: "2rem",
              "font-size": ".9rem",
              display: "inline-flex",
              "align-items": "center",
              "justify-content": "end",
              "padding-right": ".5rem",
            }}
          >
            {hisTotal() === -1 ? "" : hisTotal()}
          </div>
          <img src={ArrowRight} />
        </div>
        <hr />
        <div
          style={{
            height: "30vw",
          }}
        >
          <Show when={his().length > 0}>
            <RecordCollection comics={his} />
          </Show>
        </div>
      </div>

      <div
        style={{
          "margin-top": "1rem",
        }}
      >
        <hr />
        <div
          style={{
            display: "flex",
          }}
          onClick={() =>
            navigateTo({
              page: "index.html?page=favourite",
              title: "已收藏的本子",
            })
          }
        >
          <img
            style={{
              width: "1.4rem",
            }}
            src={registerNameImg}
          />
          <div
            style={{
              "margin-left": "5px",
              flex: 1,
            }}
          >
            已收藏
          </div>
          <div
            style={{
              color: "gray",
              width: "2rem",
              "font-size": ".9rem",
              display: "inline-flex",
              "align-items": "center",
              "justify-content": "end",
              "padding-right": ".5rem",
            }}
          >
            {favTotal() === -1 ? "" : favTotal()}
          </div>
          <img src={ArrowRight} />
        </div>
        <hr />
        <div
          style={{
            height: "29vw",
          }}
        >
          <Show when={fav().length > 0}>
            <RecordCollection comics={fav} />
          </Show>
        </div>
      </div>
    </div>
  );
}
