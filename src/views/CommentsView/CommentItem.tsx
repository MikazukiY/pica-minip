import { GetTimeDescription, HandleImg } from "../../utils";
import defaultAvatar from "../../assets/placeholder_comicViewer.png";
import iconCommentLike from "../../assets/icon_comment_like.png";
import iconCommentLiked from "../../assets/icon_comment_liked.png";
import iconCommentReply from "../../assets/icon_comment_reply.png";
import { Show, createSignal } from "solid-js";
import topCommentIcon from "../../assets/top_comment.png";
import UserInfoDialog from "../../components/UserInfoDialog";
import { PicaComment } from "../../api/model";
import { PicaApi2 } from "../../api/api";
import { navigateTo } from "minip-bridge";

export function CommentItem({
  comment,
  isChildComment = false,
  isParentComment = false,
}: {
  comment: PicaComment;
  isChildComment?: boolean;
  isParentComment?: boolean;
}) {
  let user = comment._user;
  const avatar = user ? user.avatar : null;

  const [likesCount, setLikesCount] = createSignal(comment.likesCount);
  const [isLiked, setIsLiked] = createSignal(comment.isLiked);
  let dialog: any;
  let userName = user ? user.name : "[unknown]";

  function likeComment() {
    PicaApi2.CommentLike(comment._id).then((res) => {
      if (res.code === 200) {
        if (res.data) {
          if (res.data.action === "like") {
            setLikesCount(likesCount() + 1);
            setIsLiked(true);
            comment.likesCount += 1;
            comment.isLiked = true;
          } else {
            setLikesCount(likesCount() - 1);
            setIsLiked(false);
            comment.likesCount -= 1;
            comment.isLiked = false;
          }
        }
      }
    });
  }

  function gotoChildren() {
    navigateTo({
      page:
        "index.html?page=comment_children&parent_comment=" +
        encodeURIComponent(JSON.stringify(comment)),
      title: userName + "的评论",
    });
  }

  return (
    <>
      <UserInfoDialog
        ref={dialog}
        user={user}
        onClick={() => {
          dialog.close();
        }}
      />
      <div
        class="fade-in"
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            height: isChildComment ? "4.2rem" : "4.8rem",
            width: isChildComment ? "4.2rem" : "4.8rem",
            display: "flex",
            "justify-content": "center",
            "align-items": "center",
            "flex-shrink": 0,
          }}
          onClick={() => dialog.showModal()}
        >
          <img
            src={avatar ? "minipimg" + HandleImg(avatar) : defaultAvatar}
            loading="lazy"
            style={{
              width: isChildComment ? "3.1rem" : "3.7rem",
              height: isChildComment ? "3.1rem" : "3.7rem",
              "border-radius": "50%",
              position: "absolute",
              border: "2px solid #da9cb3",
            }}
          />
          <Show when={user && user.character}>
            <img
              style={{
                width: isChildComment ? "4.2rem" : "4.8rem",
                height: isChildComment ? "4.2rem" : "4.8rem",
                position: "absolute",
                "z-index": "1",
              }}
              onError={(e) =>
                ((e.target as HTMLElement).style.display = "none")
              }
              src={user && user.character}
            />
          </Show>
        </div>
        <div
          style={{
            "margin-left": ".5rem",
          }}
        >
          <div
            style={{
              "font-weight": 500,
              "font-size": isChildComment ? ".8rem" : undefined,
            }}
          >
            {userName}
          </div>
          <div
            style={{
              "font-size": isChildComment ? ".7rem" : ".8rem",
              "margin-top": ".5rem",
              "font-weight": 500,
            }}
          >
            <span
              style={{
                color: "#da9cb3",
              }}
            >
              Lv.{user && user.level}
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span
              style={{
                "background-color": "#F3B73D",
                "border-radius": "2rem",
                padding: "0 .5rem",
                color: "white",
              }}
            >
              {user && user.title}
            </span>
          </div>
          <div
            style={{
              "font-size": isChildComment ? "0.8rem" : ".9rem",
              "margin-top": ".5rem",
              "white-space": "pre-line",
            }}
            class="selectable"
          >
            {comment.content}
          </div>
        </div>
      </div>

      <div
        style={{
          "font-size": isChildComment ? ".7rem" : ".8rem",
          color: "gray",
          display: "flex",
          "align-items": "center",
        }}
      >
        <div
          style={{
            flex: 1,
          }}
        >
          <Show
            when={comment.isTop}
            fallback={
              <span>
                {isChildComment && "#"}
                {/* @ts-ignore */}
                {comment.floor}
                {!isChildComment && "楼"} /{" "}
                {GetTimeDescription(comment.created_at)}
              </span>
            }
          >
            <div
              style={{
                display: "flex",
                "align-items": "center",
              }}
            >
              <img
                src={topCommentIcon}
                style={{
                  height: "1.3rem",
                }}
              />
              <span>&nbsp;&nbsp;{GetTimeDescription(comment.created_at)}</span>
            </div>
          </Show>
        </div>
        <div
          style={{
            width: isChildComment ? "3.8rem" : "7.6rem",
            display: "flex",
          }}
        >
          <img
            style={{
              width: isChildComment ? "1.1rem" : "1.3rem",
              height: isChildComment ? "1.1rem" : "1.3rem",
            }}
            src={isLiked() ? iconCommentLiked : iconCommentLike}
            onClick={likeComment}
          />
          <div
            style={{
              width: "2.5rem",
              "text-align": "center",
            }}
            onClick={likeComment}
          >
            {likesCount()}
          </div>
          <Show when={!isChildComment}>
            <img
              style={{
                width: isChildComment ? "1.1rem" : "1.3rem",
                height: isChildComment ? "1.1rem" : "1.3rem",
              }}
              src={iconCommentReply}
              onClick={!isParentComment ? gotoChildren : undefined}
            />
            <div
              style={{
                width: "2.5rem",
                "text-align": "center",
              }}
              onClick={!isParentComment ? gotoChildren : undefined}
            >
              {comment.commentsCount}
            </div>
          </Show>
        </div>
      </div>
    </>
  );
}
