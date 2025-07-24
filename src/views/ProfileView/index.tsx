import { Match, Switch, createSignal, onMount } from "solid-js";
import { UserInfoView } from "./UserInfoView";
import { RecordView } from "./RecordView";
import { CommentsView } from "./CommentsView";
import { KVStore } from "../../store/KVStore";
import { PicaApi2 } from "../../api/api";
import { PicaComic, PicaMyInfo } from "../../api/model";
import {
  enablePullDownRefresh,
  onPullDownRefresh,
  showHUD,
  stopPullDownRefresh,
} from "minip-bridge";

export default function ProfileView() {
  const [selected, setSelected] = createSignal(0);

  const [info, setInfo] = createSignal<PicaMyInfo | null>(null);
  const [fav, setFav] = createSignal<Array<PicaComic>>([]);
  const [favTotal, setFavTotal] = createSignal(-1);
  const [his, setHis] = createSignal<Array<any>>([]);
  const [hisTotal, setHisTotal] = createSignal(-1);

  function getProfile() {
    return PicaApi2.Profile().then((res) => {
      setInfo(res.data.user);
    });
  }

  function getHistory() {
    KVStore.getHistoryByPage(1, 4).then((res) => {
      setHis(res.comics);
      setHisTotal(res.total);
    });
  }

  function getFavourite() {
    return PicaApi2.UserFavourite(1).then((res) => {
      if (res.code === 200) {
        setFav(res.data.comics.docs.slice(0, 4));
        setFavTotal(res.data.comics.total);
      }
    });
  }

  function refreshData(isFirst: boolean) {
    return Promise.all([getProfile(), getHistory(), getFavourite()])
      .catch(() => {
        showHUD({
          type: "error",
          message: "网络错误",
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
    <div>
      <UserInfoView info={info} setInfo={setInfo} />
      <hr
        style={{
          opacity: 0.1,
        }}
      />
      <div>
        <div
          style={{
            display: "flex",
            "font-size": "1rem",
            "line-height": "2.5rem",
            "font-weight": 550,
          }}
        >
          <div
            style={{
              flex: 1,
              "text-align": "center",
              color: selected() !== 0 ? "gray" : undefined,
            }}
            onClick={() => {
              setSelected(0);
            }}
          >
            记录
          </div>
          <div
            style={{
              flex: 1,
              "text-align": "center",
              color: selected() !== 1 ? "gray" : undefined,
            }}
            onClick={() => {
              setSelected(1);
            }}
          >
            评论
          </div>
        </div>
        <Switch>
          <Match when={selected() === 0}>
            <div
              class="fade-in"
              style={{
                width: "50%",
                height: "4px",
                "background-color": "#da9cb3",
              }}
            ></div>
          </Match>
          <Match when={selected() === 1}>
            <div
              class="fade-in"
              style={{
                width: "50%",
                height: "4px",
                "background-color": "#da9cb3",
                "margin-left": "50%",
              }}
            ></div>
          </Match>
        </Switch>

        <Switch>
          <Match when={selected() === 0}>
            <RecordView
              fav={fav}
              favTotal={favTotal}
              his={his}
              hisTotal={hisTotal}
            />
          </Match>
          <Match when={selected() === 1}>
            <CommentsView />
          </Match>
        </Switch>
      </div>
    </div>
  );
}
