import { GetTimeDescription, HandleImg } from "../../utils";
import defaultAvatar from "../../assets/placeholder_comicViewer.png";
import UserInfoDialog from "../../components/UserInfoDialog";
import { PicaUser } from "../../api/model";
import { navigateTo } from "minip-bridge";

export function CreatorView({
  creator,
  updatedAt,
}: {
  creator: PicaUser | null;
  updatedAt: string;
}) {
  const avatar = creator ? creator.avatar : null;
  const creatorName = creator ? creator.name : "[unknown]";

  let dialog: any;
  return (
    <>
      <UserInfoDialog
        ref={dialog}
        user={creator}
        onClick={() => {
          dialog.close();
        }}
      />
      <div class="flex gap-2">
        <img
          class="w-12 h-12 rounded-full border-solid border-2"
          style={{
            "border-color": "#da9cb3",
          }}
          src={avatar ? HandleImg(avatar) : defaultAvatar}
          onClick={() => {
            dialog.showModal();
          }}
          onError={(e) => ((e.target as HTMLImageElement).src = defaultAvatar)}
        />
        <div>
          <div
            style={{ color: "#da9cb3", "font-size": "1.1rem" }}
            onClick={() => {
              navigateTo({
                page:
                  "index.html?page=creator&creator=" +
                  encodeURIComponent(creator!.id ?? creator!._id),
                title: creatorName,
              });
            }}
          >
            {creatorName}
          </div>
          <div
            style={{
              color: "gray",
              "font-size": "0.8rem",
              "margin-top": "5px",
            }}
          >
            {GetTimeDescription(updatedAt)} 更新
          </div>
        </div>
      </div>
    </>
  );
}
