import { For, Show, createSignal, onMount } from "solid-js";
import ComicItem from "../../components/ComicItem";
import { FullScreenSpinner } from "../../components/Spinner/FullScreenSpinner";
import { LineCenterSpinner } from "../../components/Spinner/LineCenterSpinner";
import arrowDown from "../../assets/icon_arrow_down_pink.png";
import {
  SortType,
  SortTypeRequestKeys,
  SortTypeToDescription,
} from "../../common";
import { KVStore } from "../../store/KVStore";
import "./index.scss";
import { PicaApi2 } from "../../api/api";
import { PicaComic } from "../../api/model";
import { getKVStorage, setKVStorage, showAlert } from "minip-bridge";
import SwipeOut from "../../components/SwipeOut";

interface ComicListViewProps {
  type:
    | "category"
    | "author"
    | "chineseTeam"
    | "search"
    | "creator"
    | "recentlyUpdate"
    | "random"
    | "favourite"
    | "history";
  data?: string;
  hideSort?: boolean;
}

export default function ComicListView({
  type,
  data,
  hideSort = false,
}: ComicListViewProps) {
  const [comics, setComics] = createSignal<Array<PicaComic>>([]);
  const [page, setPage] = createSignal(0);
  const [total, setTotal] = createSignal(0);
  const [isLoading, setIsLoading] = createSignal(true);
  function setStoredSort(val: string) {
    setKVStorage("sort", val);
  }
  const [sort, setSort] = createSignal<SortType>("dd");

  function updateSort(st: SortType) {
    const old = sort();
    setSort(st);
    setStoredSort(st);

    if (st !== old) {
      setComics([]);
      setPage(0);
      setIsLoading(true);
      nextPage();
    }
  }

  function nextPage() {
    if (page() !== 0 && page() === total()) {
      return;
    }

    if (type === "random") {
      setIsLoading(true);
      PicaApi2.Random().then((res) => {
        if (res.code === 200) {
          setComics(res.data.comics);
          setIsLoading(false);
        }
      });
      return;
    }

    const pg = page() + 1;
    setIsLoading(true);
    let req: Promise<any> | undefined;
    const st = sort();
    if (type === "category" && data) {
      req = PicaApi2.Comics(pg, encodeURIComponent(data), st);
    } else if (type === "author" && data) {
      req = PicaApi2.AuthorComics(pg, encodeURIComponent(data), st);
    } else if (type === "chineseTeam" && data) {
      req = PicaApi2.ChineseTeamComics(pg, encodeURIComponent(data), st);
    } else if (type === "search" && data) {
      req = PicaApi2.Search(data, pg, st);
    } else if (type === "creator" && data) {
      req = PicaApi2.creatorComics(pg, data, st);
    } else if (type === "recentlyUpdate") {
      req = PicaApi2.ComicsRecently(pg);
    } else if (type === "favourite") {
      req = PicaApi2.UserFavourite(pg, st);
    } else if (type === "history") {
      req = KVStore.getHistoryByPage(pg);
    }
    req &&
      req.then((res) => {
        if (type === "history") {
          setComics((cur) => [...cur, ...res.comics]);
          setPage(res.page);
          setTotal(res.pages);
        } else if (res.code === 200) {
          setComics((cur) => [...cur, ...res.data.comics.docs]);
          setPage(res.data.comics.page);
          setTotal(res.data.comics.pages);
        }
        setIsLoading(false);
      });
  }

  function getSortText() {
    const st = sort();
    return SortTypeToDescription(st ?? "dd");
  }

  function changeSort() {
    showAlert({
      title: "排序模式",
      preferredStyle: "alert",
      actions: [
        ...SortTypeRequestKeys.map((st) => ({
          title: SortTypeToDescription(st),
          key: st,
        })),
        {
          title: "取消",
          key: "cancel",
          style: "cancel",
        },
      ],
    }).then((res) => {
      if (res.data !== "cancel") {
        updateSort(res.data as SortType);
      }
    });
  }

  onMount(() => {
    getKVStorage("sort")
      .then((res) => {
        if (res.data) {
          setSort(JSON.parse(res.data));
        }
      })
      .finally(() => nextPage());
  });

  return (
    <Show
      when={!isLoading() || (comics().length > 0 && type !== "random")}
      fallback={<FullScreenSpinner />}
    >
      <Show when={!hideSort}>
        <div class="header sort-header" onClick={changeSort}>
          <img src={arrowDown} />
          <span>{getSortText()}</span>
        </div>
      </Show>
      <div
        class="load-more-btn-box"
        style={{
          "margin-top": !hideSort ? "55px" : "none",
        }}
      >
        <Show when={type !== "random" || !isLoading()}>
          <For each={comics()}>
            {(item) => (
              <ComicItem
                comic={item}
                onDelete={
                  type === "history"
                    ? function () {
                        KVStore.removeHistoryItem(item._id).then((res) => {
                          if (res) {
                            setComics((curr) => curr.filter((i) => i !== item));
                          }
                        });
                      }
                    : undefined
                }
              />
            )}
          </For>
        </Show>
        <Show when={type === "history" && comics().length > 0}>
          <div
            class="text-center"
            style={{
              "font-size": "0.8rem",
              color: "gray",
            }}
          >
            - 左滑删除 -
          </div>
        </Show>
        <Show
          when={
            ((total() !== page() && total() !== 0) || type === "random") &&
            !isLoading()
          }
        >
          <div class="text-center">
            <button class="next-btn" onClick={nextPage}>
              {type === "random" ? "refresh" : "next"}
            </button>
          </div>
        </Show>
        <Show when={isLoading() && comics().length > 0 && type !== "random"}>
          <LineCenterSpinner />
        </Show>
      </div>
    </Show>
  );
}
