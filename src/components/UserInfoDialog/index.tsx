import { Show } from "solid-js";
import { HandleImg } from "../../utils";
import defaultAvatar from "../../assets/placeholder_comicViewer.png";
import { previewImage } from "minip-bridge";

export default function UserInfoDialog({
  user,
  ref,
  onClick,
}: {
  user: any;
  ref: any;
  onClick: any;
}) {
  const avatar = user ? user.avatar : null;
  return (
    <dialog
      class="user-info fade-in"
      ref={ref}
      onClick={onClick}
      style={{
        "min-width": "15rem",
      }}
    >
      <div>
        <div
          style={{
            "text-align": "center",
            "font-weight": 600,
            "font-size": "1.1rem",
          }}
        >
          Lv. {user.level}
        </div>
        <div
          style={{
            height: "10rem",
            display: "flex",
            "justify-content": "center",
            "align-items": "center",
            "flex-shrink": 0,
          }}
        >
          <img
            src={avatar ? HandleImg(avatar) : defaultAvatar}
            loading="lazy"
            style={{
              width: "8rem",
              height: "8rem",
              "border-radius": "50%",
              position: "absolute",
              border: "2px solid #da9cb3",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (avatar) {
                previewImage(HandleImg(avatar));
              }
            }}
          />
          <Show when={user.character}>
            <img
              style={{
                width: "10rem",
                height: "10rem",
                position: "absolute",
                "z-index": "1",
              }}
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
              src={user.character}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (avatar) {
                  previewImage(HandleImg(avatar));
                }
              }}
            />
          </Show>
        </div>

        <div
          style={{
            "text-align": "center",
            "font-weight": 600,
            "font-size": "1.1rem",
          }}
        >
          {user.name}
        </div>
        <div
          style={{
            "text-align": "center",
            "font-weight": 400,
            "font-size": ".9rem",
            "margin-top": "15px",
          }}
        >
          <span
            style={{
              "background-color": "#F3B73D",
              "border-radius": "2rem",
              padding: ".2rem .5rem",
              color: "white",
            }}
          >
            {user.title}
          </span>
        </div>
        <div
          style={{
            "white-space": "pre-line",
            "text-align": "center",
            "margin-top": "15px",
            "font-size": ".9rem",
          }}
          class="selectable"
        >
          "{user.slogan}"
        </div>
      </div>
    </dialog>
  );
}
