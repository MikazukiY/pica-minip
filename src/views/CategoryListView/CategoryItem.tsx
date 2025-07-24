import { HandleImg, tap } from "../../utils";
import placeHolder from "../../assets/placeholder_comicViewer.png";
import leaderBoardImg from "../../assets/cat_leaderBoard.jpg";
import randomImg from "../../assets/cat_random.jpg";
import latestImg from "../../assets/cat_latest.jpg";
import forumImg from "../../assets/cat_forum.jpg";
import gameImg from "../../assets/cat_game.jpg";
import { PicaCategory } from "../../api/model";
import { navigateTo, openWebsite } from "minip-bridge";

type ConstCatCoverName = "leaderBoard" | "random" | "latest" | "forum" | "game";

function getConstCatCover(name: ConstCatCoverName) {
  if (name === "forum") return forumImg;
  else if (name === "game") return gameImg;
  else if (name === "latest") return latestImg;
  else if (name === "leaderBoard") return leaderBoardImg;
  else if (name === "random") return randomImg;
  return placeHolder;
}

export default function CategoryItem({
  category,

  title,
  target,
  constImgName,
}: {
  category?: PicaCategory;

  title?: string;
  target?: string;
  constImgName?: ConstCatCoverName;
}) {
  const { isWeb, thumb } = category ? category : { isWeb: false, thumb: null };
  const isConstCat = !isWeb && !thumb;

  function getCoverImgUrl() {
    let { path } = thumb!;
    path = path.replace("tobs/", "");
    return HandleImg({ path });
  }

  function setTap(el: HTMLElement) {
    tap(el, () => {
      if (isWeb) {
        openWebsite(category!.link!);
        return;
      } else if (!isConstCat) {
        navigateTo({
          page: `index.html?page=category_detail&category=${encodeURIComponent(
            category!.title
          )}`,
          title: category!.title,
        });
        return;
      }
      navigateTo({ page: target!, title: title! });
    });
  }

  function imgOnError(e: Event) {
    if (isConstCat) return;
    const el = e.target as HTMLImageElement;
    el.src = placeHolder;
  }

  return (
    <div class="fade-in" ref={setTap}>
      <div>
        <img
          class="cat-cover-img"
          src={isConstCat ? getConstCatCover(constImgName!) : getCoverImgUrl()}
          onError={imgOnError}
        />
      </div>
      <div class="text-center">{isConstCat ? title : category?.title}</div>
    </div>
  );
}
