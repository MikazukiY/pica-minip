import { For } from "solid-js";
import { HandleImg } from "../../utils";
import { PicaThumb } from "../../api/model";
import { previewImage } from "minip-bridge";

export function ScreenShotsView({
  screenshots,
}: {
  screenshots: Array<PicaThumb>;
}) {
  return (
    <div
      style={{
        width: "100%",
        "overflow-x": "auto",
        display: "flex",
        height: "12rem",
        "margin-top": "5px",
      }}
    >
      <For each={screenshots.slice(1)}>
        {(item) => (
          <img
            onClick={() => {
              previewImage(HandleImg(item));
            }}
            style={{
              height: "12rem",
            }}
            src={HandleImg(item)}
          />
        )}
      </For>
    </div>
  );
}
