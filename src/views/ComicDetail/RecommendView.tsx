import { For, createSignal, onMount } from "solid-js";
import { HandleImg, LazyLoad } from "../../utils";
import { PicaApi2 } from "../../api/api";
import { navigateTo } from "minip-bridge";

export function RecommendView({ comicId }: { comicId: string }) {
  const [comics, setComics] = createSignal<Array<any>>([]);
  onMount(() => {
    PicaApi2.Recommendation(comicId).then((res) => {
      if (res.code === 200) {
        setComics(res.data.comics);
      }
    });
  });

  return (
    <div>
      <div
        style={{
          "font-size": ".9rem",
          "font-weight": 500,
        }}
      >
        看了這個本子的人也有在看
      </div>
      <div
        style={{
          width: "100%",
          "overflow-x": "auto",
          gap: "10px",
          display: "flex",
          height: "11rem",
          "margin-top": "5px",
        }}
      >
        <For each={comics()}>
          {(item) => (
            <div
              style={{
                width: "6rem",
                height: "9rem",
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
                  ref={(d) => LazyLoad(d)}
                  style={{
                    width: "6rem",
                    height: "8.5rem",
                    "border-radius": ".5rem",
                    "object-fit": "cover",
                  }}
                  data-src={HandleImg(item.thumb)}
                  class="lazy-img"
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
