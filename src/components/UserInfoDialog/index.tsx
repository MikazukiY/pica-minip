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
      class="user-info fade-in  min-w-[15rem]"
      ref={ref}
      onClick={onClick}
    >
      <div>
        <div class="text-center font-semibold text-[1.1rem]">
          Lv. {user.level}
        </div>
        <div class="h-40 flex justify-center items-center flex-shrink-0 relative">
          <img
            src={avatar ? "minipimg" + HandleImg(avatar) : defaultAvatar}
            loading="lazy"
            class="w-32 h-32 rounded-full absolute border-2 border-[#da9cb3]"
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
              class="w-40 h-40 absolute z-10"
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

        <div class="text-center font-semibold text-[1.1rem]">{user.name}</div>
        <div class="text-center font-normal text-sm mt-4">
          <span class="bg-[#F3B73D] rounded-full px-2 py-0.5 text-white">
            {user.title}
          </span>
        </div>
        <div class="selectable text-center mt-4 text-sm whitespace-pre-line">
          "{user.slogan}"
        </div>
      </div>
    </dialog>
  );
}
