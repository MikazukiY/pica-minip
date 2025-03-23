import { Accessor, Setter, Show } from "solid-js";
import { PicaApi2 } from "../../api/api";
import { HandleImg } from "../../utils";
import defaultAvatar from "../../assets/placeholder_avatar_2.png";
import punchInImg from "../../assets/icon_punch_in.png";
import { PicaMyInfo } from "../../api/model";
import { showAlert } from "minip-bridge";

export function UserInfoView({
  info,
  setInfo,
}: {
  info: Accessor<PicaMyInfo | null>;
  setInfo: Setter<PicaMyInfo | null>;
}) {
  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <div
        style={{
          "min-height": "13.5rem",
        }}
      >
        <Show when={info()}>
          <Show when={!info()!.isPunched}>
            <div
              style={{
                position: "absolute",
                right: "7px",
                top: "7px",
                width: "3rem",
                "text-align": "center",
                "font-size": ".8rem",
              }}
              onClick={() => {
                PicaApi2.PunchIn().then((res) => {
                  if (res.code === 200) {
                    setInfo({
                      ...info()!,
                      isPunched: true,
                    });

                    showAlert({
                      title: "打卡成功",
                      message:
                        "成功打了一张卡，得到10经验值，距离成为高雅的BIKA又踏进了一步！",
                      actions: [
                        {
                          title: "确定",
                          key: "ok",
                        },
                      ],
                    });
                  }
                });
              }}
            >
              <img
                class="fade-in"
                src={punchInImg}
                style={{
                  width: "3rem",
                  filter: !info()!.isPunched
                    ? "drop-shadow(0 0 2px black)"
                    : undefined,
                }}
              />
              <div
                style={{
                  "margin-top": "-0.3rem",
                }}
              >
                打卡
              </div>
            </div>
          </Show>
          <div
            class="fade-in"
            style={{
              width: "100%",
              height: "13rem",
              position: "absolute",
              "z-index": "-1",
              // "background-image": info()!.avatar ? `url(${HandleImg(info()!.avatar)})` : undefined,
              // "background-position": "center",
              // filter: "blur(20px) brightness(0.4)"
            }}
          ></div>
          <div
            style={{
              "text-align": "center",
            }}
          >
            <span>Lv.&nbsp;{info()!.level}</span>
          </div>
          <div
            class="fade-in"
            style={{
              height: "7.5rem",
              display: "flex",
              "justify-content": "center",
              "align-items": "center",
            }}
          >
            <img
              style={{
                width: "5.4rem",
                height: "5.4rem",
                "border-radius": "50%",
                position: "absolute",
                border: "2px solid #da9cb3",
              }}
              src={
                info()!.avatar
                  ? "minipimg" + HandleImg(info()!.avatar)
                  : defaultAvatar
              }
            />
            <Show when={info()!.character}>
              <img
                style={{
                  width: "7.5rem",
                  height: "7.5rem",
                  position: "absolute",
                  "z-index": "1",
                }}
                onError={(e) =>
                  ((e.target as HTMLImageElement).style.display = "none")
                }
                src={info()!.character}
              />
            </Show>
          </div>

          <div
            style={{
              "text-align": "center",
              "font-weight": 600,
            }}
          >
            <span>{info()!.name}</span>
          </div>
          <div
            style={{
              "text-align": "center",
              "font-weight": 500,
              color: "white",
              "margin-top": "5px",
            }}
          >
            <span
              style={{
                "background-color": "#F3B73D",
                "border-radius": "2rem",
                padding: "0 .5rem",
              }}
            >
              {info()!.title}
            </span>
          </div>
          <div
            style={{
              "text-align": "center",
              "margin-top": "5px",
            }}
          >
            <span>"{info()!.slogan}"</span>
          </div>
        </Show>
      </div>
    </div>
  );
}
