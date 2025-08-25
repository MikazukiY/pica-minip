import { createSignal, onMount } from "solid-js";
import { PicaApi2 } from "../../api/api";
import { showHUD } from "minip-bridge";

export function CommentsView() {
  const [loading, setLoading] = createSignal(true);
  const [msg, setMsg] = createSignal("");
  function getComments() {
    setLoading(true);
    PicaApi2.UserComments(1)
      .then((res) => {
        if (res.code === 200) {
          setMsg(JSON.stringify(res.data, null, 2));
        } else {
          showHUD({
            type: "error",
            message: res.message,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }
  onMount(() => {
    getComments();
  });
  return <div>{loading() ? "Loading..." : msg()}</div>;
}
