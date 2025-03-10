import { createSignal, onMount } from "solid-js";
import KeywordsView from "./KeywordsView";
import CollectionsView from "./CollectionsView";
import { PicaApi2 } from "../../api/api";
import { PicaComic } from "../../api/model";
import {
  enablePullDownRefresh,
  getKVStorage,
  navigateTo,
  onPullDownRefresh,
  setKVStorage,
  showHUD,
  stopPullDownRefresh,
} from "minip-bridge";

export default function Home() {
  const [collections, setCollections] = createSignal<Array<PicaComic>>([]);
  const [keywords, setKeywords] = createSignal<Array<string>>([]);
  const [searchText, setSearchText] = createSignal("");

  function getCollections() {
    return PicaApi2.Collections().then((res) => {
      if (res.code === 200) {
        const cs: Array<PicaComic> = [];
        for (const coll of res.data.collections) {
          cs.push(...coll.comics);
        }
        setCollections(cs);
      }
    });
  }

  function getKeywords() {
    return PicaApi2.Keywords().then((res) => {
      if (res.code === 200) {
        const kw = res.data.keywords;
        const mp: Record<string, boolean> = {};
        keywords().forEach((ele) => (mp[ele] = true));
        for (let ele of kw) {
          if (!(ele in mp)) {
            setKeywords(res.data.keywords);
            setKVStorage("keywords", JSON.stringify(res.data.keywords));
            break;
          }
        }
      }
    });
  }

  function refreshData(isFirst: boolean) {
    return Promise.all([getCollections(), getKeywords()])
      .catch((err) => {
        showHUD({
          type: "error",
          message: "错误: " + err.message,
        });
      })
      .finally(() => {
        stopPullDownRefresh();
        if (isFirst) {
          onPullDownRefresh(() => {
            refreshData(false);
          });
          enablePullDownRefresh();
        }
      });
  }

  onMount(() => {
    refreshData(true);
    getKVStorage("keywords").then((res) => {
      if (!res.hasData()) return;
      setKeywords((prev) => {
        if (prev.length !== 0) return prev;
        return JSON.parse(res.data);
      });
    });
  });

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          "padding-left": "0.5rem",
          "padding-right": "0.5rem",
          "margin-top": "5px",
        }}
      >
        <form
          action="."
          onSubmit={(e) => {
            e.preventDefault();
            navigateTo({
              page:
                "index.html?page=search_result&keyword=" +
                encodeURIComponent(searchText()),
              title: "搜索: " + searchText(),
            });
          }}
        >
          <input
            class="search"
            style={{
              "font-size": "1rem",
              width: "100%",
              "line-height": "2rem",
              "border-radius": "10px",
              border: "1px solid gray",
            }}
            type="search"
            autocomplete="off"
            placeholder="搜索作品、作者、标签、上传者"
            value={searchText()}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
      </div>
      <KeywordsView keywords={keywords} />
      <CollectionsView collections={collections} />
    </div>
  );
}
