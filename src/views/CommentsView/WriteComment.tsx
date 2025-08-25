import { createSignal, Show } from "solid-js";
import "./WriteComment.css";
import { LineCenterSpinner } from "../../components/Spinner/LineCenterSpinner";
import { PicaApi2 } from "../../api/api";
import { navigateBack, showHUD } from "minip-bridge";

export default function WriteComment({
  comicID,
  gameID,
  isChild,
}: {
  comicID?: string;
  gameID?: string;
  isChild: boolean;
}) {
  const [content, setContent] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  function submitComment() {
    if (loading() || content().trim() === "") return;
    setLoading(true);
    let req;
    if (isChild) {
      req = PicaApi2.SubmitChildComment(content(), comicID);
    } else {
      req = PicaApi2.SubmitComment(content(), comicID, gameID);
    }
    req
      .then((res) => {
        if (res.code === 200) {
          navigateBack();
          return;
        }
        showHUD({
          type: "error",
          message: `评论失败: ${res.message}`,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      <div
        style={{
          "padding-left": "1rem",
          "padding-right": "1rem",
          "margin-top": "5px",
        }}
      >
        <textarea
          class="write-comment-textarea"
          placeholder="写评论..."
          value={content()}
          onInput={(e) => setContent(e.currentTarget.value)}
        />
      </div>
      <div
        style={{
          margin: "5px 1rem",
        }}
      >
        <button
          style={{
            "background-color": "#da9cb3",
            color: "white",
            width: "100%",
            height: "50px",
            "font-size": "1rem",
            "border-radius": "12px",
          }}
          onClick={submitComment}
        >
          提交
        </button>
      </div>
      <Show when={loading()}>
        <LineCenterSpinner />
      </Show>
    </div>
  );
}
