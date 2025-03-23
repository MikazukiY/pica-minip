import { For, Match, Show, Switch, createSignal, onMount } from "solid-js";
import commonIcon from "../../assets/icon_comment.png";
import favouriteImg from "../../assets/icon_favourite.png";
import favouriteOffImg from "../../assets/icon_favourite_off.png";
import TagsView from "./TagsView";
import likeImg from "../../assets/icon_like.png";
import likeOffImg from "../../assets/icon_like_off.png";
import { FullScreenSpinner } from "../../components/Spinner/FullScreenSpinner";
import { CreatorView } from "./CreatorView";
import { KVStore } from "../../store/KVStore";
import { RecommendView } from "./RecommendView";
import { PicaApi2 } from "../../api/api";
import { PicaComicDetail, PicaEpisode } from "../../api/model";
import { navigateTo, previewImage } from "minip-bridge";

function ComicDetailView({ comic }: { comic: PicaComicDetail }) {
  const imgSrc = comic.thumb.fileServer + "/static/" + comic.thumb.path;
  const [episodes, setEpisodes] = createSignal<Array<PicaEpisode>>([]);
  const [page, setPage] = createSignal(0);
  const [total, setTotal] = createSignal(0);

  const [isFavourited, setIsFavourited] = createSignal(comic.isFavourite);
  const [isLiked, setIsLiked] = createSignal(comic.isLiked);
  const [likesCount, setLikesCount] = createSignal(comic.likesCount);

  const [lastRead, setLastRead] = createSignal<{
    order: number;
    title: string;
  } | null>(null);

  function nextPage() {
    const pg = page() + 1;
    PicaApi2.Episodes(comic._id, pg).then((res) => {
      if (res.code === 200) {
        setEpisodes([...episodes(), ...res.data.eps.docs]);
        setPage(res.data.eps.page);
        setTotal(res.data.eps.pages);
        return;
      }
    });
  }
  onMount(() => {
    nextPage();
    KVStore.getLastRead(comic._id).then((res) => {
      if (res) {
        setLastRead(res);
      }
    });
  });
  return (
    <>
      <div
        style={{
          "padding-left": "0.5rem",
          "padding-right": "0.5rem",
        }}
      >
        <div class="fade-in">
          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <img
              onclick={() => {
                previewImage(imgSrc);
              }}
              style={{
                width: "7rem",
                height: "10rem",
                "object-fit": "cover",
                "border-radius": "0.5rem",
                "flex-shrink": 0,
              }}
              src={"minipimg" + imgSrc}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                "flex-direction": "column",
              }}
            >
              <div class="selectable">
                <span
                  style={{
                    "font-weight": 500,
                    "font-size": "1.1rem",
                  }}
                >
                  {comic.title}&nbsp;&nbsp;({comic.pagesCount}P)&nbsp;&nbsp;
                </span>
                <Show when={comic.finished}>
                  <span
                    style={{
                      color: "#da9cb3",
                      "font-size": "0.9rem",
                    }}
                  >
                    (完)
                  </span>
                </Show>
              </div>
              <div
                style={{
                  flex: 1,
                }}
              >
                <div
                  style={{
                    color: "#da9cb3",
                    "margin-top": "5px",
                  }}
                  onClick={() => {
                    navigateTo({
                      page:
                        "index.html?page=author&author=" +
                        encodeURIComponent(comic.author),
                      title: comic.author,
                    });
                  }}
                >
                  {comic.author}
                </div>
                <Show when={comic.chineseTeam}>
                  <div
                    style={{
                      color: "#83C7F6",
                      "font-size": "0.9rem",
                    }}
                    onClick={() => {
                      navigateTo({
                        page:
                          "index.html?page=chinese_team&chineseTeam=" +
                          encodeURIComponent(comic.chineseTeam),
                        title: comic.chineseTeam,
                      });
                    }}
                  >
                    {comic.chineseTeam}
                  </div>
                </Show>
              </div>
              <div>
                <div
                  style={{
                    "font-size": "0.9rem",
                    color: "gray",
                  }}
                >
                  绅士指名次数: {comic.viewsCount}
                </div>
                <div
                  style={{
                    "font-size": "0.9rem",
                    color: "gray",
                  }}
                >
                  分类: {comic.categories.join()}
                </div>
              </div>
            </div>
            <div
              style={{
                width: "2.5rem",
              }}
            >
              <img
                onClick={() => {
                  PicaApi2.Favourite(comic._id).then((res) => {
                    if (res.code === 200) {
                      setIsFavourited(res.data.action === "favourite");
                    }
                  });
                }}
                style={{
                  width: "2.5rem",
                }}
                src={isFavourited() ? favouriteImg : favouriteOffImg}
              />
            </div>
          </div>
          <div
            style={{
              "margin-top": "10px",
            }}
          >
            <TagsView tags={comic.tags} />
          </div>
          <div
            style={{
              "white-space": "pre-line",
              "margin-top": "10px",
            }}
            class="selectable"
          >
            {comic.description}
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
                KVStore.setHistory(comic);
                const lr = lastRead();
                if (!lr) {
                  navigateTo({
                    page: `index.html?page=comic_viewer&comic_id=${comic._id}&order=1`,
                    title: "第1话",
                  });
                  setLastRead({
                    order: 1,
                    title: "第1话",
                  });
                } else {
                  navigateTo({
                    page: `index.html?page=comic_viewer&comic_id=${comic._id}&order=${lr.order}`,
                    title: lr.title,
                  });
                }
              }}
            >
              {lastRead() ? `续看 ${lastRead()!.title}` : "开始阅读"}
            </button>
            <div
              onClick={() => {
                navigateTo({
                  page: `index.html?page=comments&comic_id=${comic._id}`,
                  title: "发表评论-" + comic.title,
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
                  "margin-left": `-${
                    String(comic.totalComments).length / 3 + 0.5
                  }rem`,
                }}
              >
                {comic.totalComments}
              </span>
            </div>
            <div
              style={{
                "margin-right": "2rem",
              }}
              onClick={() => {
                PicaApi2.Like(comic._id).then((res) => {
                  if (res.code === 200) {
                    setIsLiked(res.data.action === "like");
                    setLikesCount(
                      res.data.action === "like"
                        ? likesCount() + 1
                        : likesCount() - 1
                    );
                  }
                });
              }}
            >
              <img
                style={{
                  width: "3rem",
                  height: "3rem",
                }}
                src={isLiked() ? likeImg : likeOffImg}
              />
              <span
                style={{
                  position: "absolute",
                  color: "white",
                  "background-color": "red",
                  "border-radius": "1rem",
                  padding: "0 .5rem",
                  "margin-left": `-${String(likesCount()).length / 3 + 0.5}rem`,
                }}
              >
                {likesCount()}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            margin: "10px 0",
          }}
        >
          <CreatorView creator={comic._creator} updatedAt={comic.updated_at} />
        </div>
        <div>
          <div
            style={{
              display: "grid",
              "justify-content": "space-between",
              "grid-template-columns": "repeat(auto-fill, 5.7rem)",
              "row-gap": ".2rem",
            }}
          >
            <For each={episodes()}>
              {(eps) => (
                <button
                  class="fade-in"
                  style={{
                    "font-size": ".9rem",
                    color:
                      lastRead() && lastRead()!.order === eps.order
                        ? "white"
                        : "#da9cb3",
                    "background-color":
                      lastRead() && lastRead()!.order === eps.order
                        ? "#F3B73D"
                        : undefined,
                    height: "3rem",
                    "border-radius": "7px",
                  }}
                  onClick={() => {
                    navigateTo({
                      page: `index.html?page=comic_viewer&comic_id=${comic._id}&order=${eps.order}`,
                      title: eps.title,
                    });
                    setLastRead({ order: eps.order, title: eps.title });
                    KVStore.setHistory(comic);
                  }}
                >
                  {eps.title}
                </button>
              )}
            </For>
          </div>
          <div
            style={{
              "text-align": "center",
              "margin-top": ".2rem",
            }}
          >
            <Show when={page() < total()}>
              <button
                style={{
                  "font-size": "1rem",
                  color: "gray",
                  height: "3rem",
                  width: "5.7rem",
                }}
                onClick={nextPage}
              >
                more
              </button>
            </Show>
          </div>
        </div>
        <div style={{ "margin-top": "20px" }}>
          <RecommendView comicId={comic._id} />
        </div>
      </div>
    </>
  );
}

export default function ComicDetail({ id }: { id: string }) {
  const [comic, setComic] = createSignal<PicaComicDetail | undefined>();
  const [loaded, setLoaded] = createSignal(false);
  const [error, setERROR] = createSignal<Error | null>(null);
  onMount(() => {
    PicaApi2.ComicDetail(id)
      .then((res) => {
        if (res.code === 200) {
          setComic(res.data.comic);
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
    <Switch>
      <Match when={!loaded()}>
        <FullScreenSpinner />
      </Match>
      <Match when={error()}>
        <div
          style={{
            "word-break": "break-all",
          }}
        >
          {error()!.message}
        </div>
      </Match>
      <Match when={loaded()}>
        <ComicDetailView comic={comic()!} />
      </Match>
    </Switch>
  );
}
