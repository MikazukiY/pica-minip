import { For, createSignal, onMount } from "solid-js";
import CategoryItem from "./CategoryItem";
import "./index.scss";
import { PicaApi2 } from "../../api/api";
import { PicaCategory } from "../../api/model";
import {
  enablePullDownRefresh,
  onPullDownRefresh,
  showHUD,
  stopPullDownRefresh,
} from "minip-bridge";

export default function CategoryListView() {
  const [categories, setCategories] = createSignal<Array<PicaCategory>>([]);

  function getCategory() {
    return PicaApi2.Categories().then((res) => {
      if (res.code === 200) {
        setCategories(res.data.categories);
      }
    });
  }

  function refreshData(isFirst: boolean) {
    return getCategory()
      .catch((err: Error) => {
        showHUD({
          type: "error",
          message: "网络错误 " + err.message,
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
  });

  return (
    <div class="cat-list">
      <CategoryItem
        target="index.html?page=rank"
        title="排行榜"
        constImgName="leaderBoard"
      />
      <CategoryItem
        target="index.html?page=comments_board"
        title="嗶咔留言板"
        constImgName="forum"
      />
      <CategoryItem
        target="index.html?page=random"
        title="隨機本子"
        constImgName="random"
      />
      <CategoryItem
        target="index.html?page=recently_updated"
        title="最近更新"
        constImgName="latest"
      />
      <CategoryItem
        target="index.html?page=game_list"
        title="游戏"
        constImgName="game"
      />
      <For each={categories()}>
        {(item) => <CategoryItem category={item} />}
      </For>
    </div>
  );
}
