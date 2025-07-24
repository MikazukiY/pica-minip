import { Show } from "solid-js";
import iconVideoPlay from "../../assets/icon_video_play.png";
import { previewVideo } from "minip-bridge";

export function GameCover({
  pic,
  videoLink,
}: {
  pic: string;
  videoLink: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "60vw",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      }}
    >
      <img
        style={{
          width: "100%",
          height: "60vw",
          "object-fit": "cover",
        }}
        src={pic}
      />
      <Show when={videoLink && videoLink.trim().length > 0}>
        <img
          style={{
            position: "absolute",
            width: "5rem",
            height: "5rem",
          }}
          src={iconVideoPlay}
          onClick={() => {
            previewVideo(videoLink);
          }}
        />
      </Show>
    </div>
  );
}
