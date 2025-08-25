import { For, Show, createSignal, onMount } from "solid-js";
import { FullScreenSpinner } from "../../components/Spinner/FullScreenSpinner";
import { LineCenterSpinner } from "../../components/Spinner/LineCenterSpinner";
import { CommentItem } from "./CommentItem";
import { PicaApi2 } from "../../api/api";
import { navigateTo } from "minip-bridge";

export default function CommentsView({
  comicId,
  gameId,
  parentComment,
}: {
  comicId?: string;
  gameId?: string;
  parentComment?: any;
}) {
  const [comments, setComments] = createSignal<Array<any>>([]);
  const [page, setPage] = createSignal(0);
  const [total, setTotal] = createSignal(0);
  const [isLoading, setIsLoading] = createSignal(true);

  const isChild: boolean = parentComment;

  let commentApi = comicId ? PicaApi2.Comments : PicaApi2.GameComments;
  if (isChild) commentApi = PicaApi2.CommentChildren;

  function nextPage() {
    if (page() !== 0 && page() === total()) {
      return;
    }
    const pg = page() + 1;
    setIsLoading(true);
    commentApi(comicId ?? gameId ?? parentComment._id, pg).then((res) => {
      if (res.code === 200) {
        const total = res.data.comments.total;
        const limit = res.data.comments.limit;
        const docs = res.data.comments.docs;
        for (let i = 0; i < docs.length; i++) {
          // @ts-ignore
          docs[i].floor = total - i - limit * (pg - 1);
        }
        setComments((cur) => {
          if (cur.length === 0 && !isChild)
            return [...res.data.topComments, ...docs];
          else return [...cur, ...docs];
        });
        setPage(parseInt(res.data.comments.page.toString()));
        setTotal(res.data.comments.pages);
        setIsLoading(false);
      }
    });
  }

  onMount(() => {
    nextPage();

    function updateVh() {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight}px`
      );
    }
    updateVh();
    window.addEventListener("resize", updateVh);
    window.addEventListener("orientationchange", updateVh);
    return () => {
      window.removeEventListener("resize", updateVh);
      window.removeEventListener("orientationchange", updateVh);
    };
  });

  return (
    <Show
      when={isChild || !isLoading() || comments().length > 0}
      fallback={<FullScreenSpinner />}
    >
      <div
        onClick={() => {
          let query = "";

          if (isChild) {
            query += `&comic_id=${parentComment._id}&is_child=true`;
          } else if (gameId) {
            query += "&game_id=" + gameId;
          } else if (comicId) {
            query += "&comic_id=" + comicId;
          }

          navigateTo({
            page: "index.html?page=write_comment" + query,
            title: "评论",
          });
        }}
        class="comment-btn"
      >
        写评论
      </div>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          gap: "1rem",
          "padding-left": "0.5rem",
          "padding-right": "0.5rem",
        }}
      >
        <Show when={isChild}>
          <div>
            <CommentItem comment={parentComment} isParentComment={true} />
            <hr />
          </div>
          <div
            style={{
              "padding-left": "0.5rem",
              "padding-right": "0.5rem",
            }}
          >
            <For each={comments()}>
              {(item) => (
                <>
                  <CommentItem isChildComment comment={item} />
                  <hr
                    style={{
                      width: "100%",
                    }}
                  />
                </>
              )}
            </For>
          </div>
        </Show>
        <Show when={!isChild}>
          <For each={comments()}>
            {(item) => (
              <>
                <CommentItem comment={item} />
                <hr
                  style={{
                    width: "100%",
                  }}
                />
              </>
            )}
          </For>
        </Show>
        <Show when={page() !== total() && !isLoading()}>
          <div style={{ "text-align": "center" }}>
            <button class="next-btn" onClick={nextPage}>
              more
            </button>
          </div>
        </Show>
        <Show when={isLoading() && (comments().length > 0 || isChild)}>
          <LineCenterSpinner />
        </Show>
      </div>
    </Show>
  );
}
