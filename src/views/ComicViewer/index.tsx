import { For, Show, createSignal, onMount } from "solid-js";
import { AllowZoom, LazyLoad, LongPress } from "../../utils";
import { KVStore } from "../../store/KVStore";
import { PicaApi2 } from "../../api/api";
import { PicaComicImage } from "../../api/model";
import { previewImage, showAlert, showHUD, vibrate } from "minip-bridge";

export default function ComicViewer({
  comicId,
  order,
}: {
  comicId: string;
  order: string;
}) {
  const [images, setImages] = createSignal<Array<PicaComicImage>>([]);
  const [page, setPage] = createSignal(0);
  const [total, setTotal] = createSignal(0);

  function nextPage() {
    if (total() !== 0 && page() === total()) {
      return;
    }
    const pg = page() + 1;
    setPage(pg);
    PicaApi2.ComicImages(comicId, parseInt(order), pg)
      .then((res) => {
        if (res.code === 200) {
          setImages((cur) => [...cur, ...res.data.pages.docs]);
          setTotal(res.data.pages.pages);
          if (pg === 1) {
            KVStore.setLastRead(comicId, {
              order: parseInt(order),
              title: res.data.ep.title,
            });
          }
          return;
        }
      })
      .catch((err) => setImages(err.message));
  }

  function setUpImgDom(el: HTMLImageElement) {
    LazyLoad(el, (dom) => {
      const el = dom.target as HTMLElement;
      el.style.height = "auto";
      el.style.opacity = "1";
    });
    LongPress(el, 400, () => {
      vibrate();
      showAlert({
        title: "保存到相册",
        preferredStyle: "actionSheet",
        actions: [
          {
            title: "预览",
            key: "preview",
          },
          {
            title: "保存",
            key: "save",
          },
          {
            title: "取消",
            key: "cancel",
            style: "cancel",
          },
        ],
      }).then((res) => {
        if (res.data === "save") {
          showHUD({
            type: "error",
            message: `not implement`,
          });
        } else if (res.data === "preview") {
          const src = el.getAttribute("data-src");
          if (src) previewImage(src);
        }
      });
    });
  }

  onMount(() => {
    nextPage();
    AllowZoom();
  });

  return (
    <div class="flex flex-col gap-0">
      <For each={images()}>
        {(item) => (
          <img
            class="lazy-img min-w-full max-w-full opacity-0"
            ref={setUpImgDom}
            style={{
              height: "800px",
              transition: "opacity 1s",
            }}
            data-src={item.media.fileServer + "/static/" + item.media.path}
          />
        )}
      </For>
      <Show when={page() !== 0 && total() !== 0 && page() !== total()}>
        <div class="text-center">
          <button class="next-btn" onClick={nextPage}>
            more
          </button>
        </div>
      </Show>
    </div>
  );
}
