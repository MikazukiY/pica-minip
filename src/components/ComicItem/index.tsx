import { createSignal, Show } from "solid-js";
import { HandleImg, LazyLoad } from "../../utils";
import likesImg from "../../assets/icon_like.png";
import { PicaComic } from "../../api/model";
import "./index.css";
import { navigateTo, previewImage } from "minip-bridge";
import SwipeOut from "../SwipeOut";

function showTags(cats: string[]) {
  const dc = ["禁書目錄", "生肉", "耽美花園"];
  for (const ele of cats) {
    if (dc.indexOf(ele) !== -1) return true;
  }

  return false;
}

export default function ComicItem({
  comic,
  onDelete,
}: {
  comic: PicaComic;
  onDelete?: () => void;
}) {
  let mainRef: any;
  const imgSrc = HandleImg(comic.thumb);
  const [swiped, setSwiped] = createSignal(false);
  const [closeFunc, setCloseFunc] = createSignal(() => {});

  const content = (
    <>
      <img
        ref={(el) => LazyLoad(el)}
        class="lazy-img comic-item-img"
        data-src={"minipimg" + imgSrc}
        onClick={(e) => {
          e.stopPropagation();
          if (swiped()) {
            closeFunc()();
            return;
          }
          previewImage(imgSrc);
        }}
      />
      <div class="flex-1">
        <div>
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
        <div class="text-gray-500 text-[0.9rem]">
          分类: {comic.categories.join()}
        </div>
        <div class="inline-flex gap-[5px] mt-[10px]">
          <img class="w-6" src={likesImg} />
          <div class="text-gray-500 font-semibold text-[1.1rem]">
            {comic.totalLikes ?? comic.likesCount}
          </div>
        </div>
      </div>
      <Show when={showTags(comic.categories)}>
        <div class="w-6 flex flex-col justify-evenly">
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
      <div ref={mainRef} class="px-2">
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
            class="fade-in flex gap-2"
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
      class="fade-in comic-item-main"
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
