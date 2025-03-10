import { createSignal, Show } from "solid-js";
import { LazyLoad } from "../../utils";
import likesImg from "../../assets/icon_like.png";
import { PicaComic } from "../../api/model";
import "./index.css";
import { navigateTo, previewImage } from "minip-bridge";
import SwipeOut from "../SwipeOut";

export default function ComicItem({
  comic,
  onDelete,
}: {
  comic: PicaComic;
  onDelete?: () => void;
}) {
  let mainRef;
  const imgSrc = comic.thumb.fileServer + "/static/" + comic.thumb.path;
  const [swiped, setSwiped] = createSignal(false);
  const [closeFunc, setCloseFunc] = createSignal(() => {});

  function showTags() {
    const cats = comic.categories;
    const dc = ["禁書目錄", "生肉", "耽美花園"];
    for (const ele of cats) {
      if (dc.indexOf(ele) !== -1) return true;
    }

    return false;
  }

  const content = (
    <>
      <img
        ref={(el) => LazyLoad(el)}
        class="lazy-img"
        data-src={imgSrc}
        onClick={(e) => {
          e.stopPropagation();
          if (swiped()) {
            closeFunc()();
            return;
          }
          previewImage(imgSrc);
        }}
        style={{
          width: "7rem",
          height: "10rem",
          "object-fit": "cover",
          "border-radius": "0.5rem",
          "flex-shrink": 0,
        }}
      />
      <div
        style={{
          flex: 1,
        }}
      >
        <div style={{}}>
          <span>{comic.title}</span>
          <Show when={comic.pagesCount}>
            <span>&nbsp;&nbsp;({comic.pagesCount}P)&nbsp;&nbsp;</span>
          </Show>
          <Show when={comic.finished}>
            <span style={{ color: "#da9cb3", "font-size": "0.9rem" }}>
              (完)
            </span>
          </Show>
        </div>
        <div
          style={{
            color: "#da9cb3",
          }}
        >
          {comic.author}
        </div>
        <div
          style={{
            color: "gray",
            "font-size": ".9rem",
          }}
        >
          分类: {comic.categories.join()}
        </div>
        <div
          style={{
            display: "inline-flex",
            gap: "5px",
            "margin-top": "10px",
          }}
        >
          <img
            style={{
              width: "1.5rem",
            }}
            src={likesImg}
          />
          <div
            style={{
              color: "gray",
              "font-weight": 600,
              "font-size": "1.1rem",
            }}
          >
            {comic.totalLikes ?? comic.likesCount}
          </div>
        </div>
      </div>
      <Show when={showTags()}>
        <div
          style={{
            width: "1.5rem",
            display: "flex",
            "flex-direction": "column",
            "justify-content": "space-evenly",
          }}
        >
          <Show when={comic.categories.indexOf("禁書目錄") !== -1}>
            <div style={{ "background-color": "#6EC3FF" }} class="cat-label">
              禁書
            </div>
          </Show>
          <Show when={comic.categories.indexOf("生肉") !== -1}>
            <div style={{ "background-color": "#E497B7" }} class="cat-label">
              生肉
            </div>
          </Show>
          <Show when={comic.categories.indexOf("耽美花園") !== -1}>
            <div style={{ "background-color": "#B3F492" }} class="cat-label">
              耽美
            </div>
          </Show>
        </div>
      </Show>
    </>
  );
  if (onDelete) {
    return (
      <div
        ref={mainRef}
        style={{
          "padding-left": "0.5rem",
          "padding-right": "0.5rem",
        }}
      >
        <SwipeOut
          right={
            <div
              class="right-delete-btn swipeout-action"
              onClick={() => {
                if (mainRef) {
                  const el = mainRef as HTMLElement;
                  el.style.maxHeight = el.offsetHeight + "px";
                  el.classList.add("collapsing");
                  setTimeout(onDelete, 200);
                } else {
                  onDelete();
                }
              }}
            >
              删除
            </div>
          }
          onRevealed={(_, r) => {
            setSwiped(true);
            setCloseFunc(() => r.close);
          }}
          onClosed={() => setSwiped(false)}
        >
          <div
            class="fade-in"
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
            onClick={() => {
              if (swiped()) {
                closeFunc()();
                return;
              }
              navigateTo({
                page: `index.html?id=${comic._id}&page=comic_detail`,
                title: comic.title,
              });
            }}
          >
            {content}
          </div>
        </SwipeOut>
      </div>
    );
  }
  return (
    <div
      ref={mainRef}
      class="fade-in"
      style={{
        display: "flex",
        "padding-left": "0.5rem",
        "padding-right": "0.5rem",
        gap: "0.5rem",
      }}
      onClick={() => {
        if (swiped()) {
          closeFunc()();
          return;
        }
        navigateTo({
          page: `index.html?id=${comic._id}&page=comic_detail`,
          title: comic.title,
        });
      }}
    >
      {content}
    </div>
  );
}
