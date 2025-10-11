import {
  closeApp,
  deleteKVStorage,
  getAppInfo,
  getKVStorage,
  setKVStorage,
  showAlert,
  showHUD,
  updateCurrentApp,
  vibrate,
} from "minip-bridge";
import { apiConfig } from "../../api/api";
import ArrowRight from "../../assets/arrow-right.svg";
import "./index.css";
import { createSignal, onMount, Show } from "solid-js";

const CHECK_VERSION_URL = "https://api.github.com/repos/MikazukiY/pica-minip/releases/latest"

function compareVersions(version1: string, version2: string): number {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);

  const maxLength = Math.max(v1.length, v2.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}

export default function SettingsView() {
  const [api, setSS] = createSignal("2");
  const [version, setVersion] = createSignal("")
  const [latestVersion, setLatestVersion] = createSignal("")
  const [loading, setLoading] = createSignal(true)
  onMount(() => {
    getKVStorage("selectedApi").then((res) => {
      if (res.data) setSS(res.data);
      else setSS(apiConfig.selected.toString());
    });
    getAppInfo().then(r => setVersion(r.data.version ?? "unknown"))
      .finally(() => {
        fetch(CHECK_VERSION_URL)
          .then(res => res.json())
          .then(res => {
            setLatestVersion(res.tag_name ?? "unknown")
            console.log(res)
          })
          .catch(err => {
            showHUD({
              type: "error",
              title: "检查更新发生错误",
              message: err?.message ?? "unknown error"
            })
          })
          .finally(() => setLoading(false))
      })
  });

  function needUpdate() {
    return compareVersions(version(), latestVersion()) === -1
  }

  function setNew(s: string) {
    setSS(s);
    setKVStorage("selectedApi", s);
  }

  const changeAPI = () => {
    vibrate("medium");
    showAlert({
      title: "选择API",
      preferredStyle: "actionSheet",
      actions: [
        ...apiConfig.apis.map((item, i) => ({
          title: item,
          key: String(i),
        })),
        {
          title: "取消",
          key: "-1",
          style: "cancel",
        },
      ],
    }).then((res) => {
      if (res.data && res.data.action !== "-1") {
        setNew(res.data.action);
      }
    });
  };

  return (
    <>
      <div style={{ "text-align": "center" }}>
        <div
          style={{
            "font-size": ".8rem",
            color: "gray",
            "margin-top": "1rem",
            "text-align": "left",
            "margin-left": "1rem",
            "padding-left": "12px",
          }}
        >
          设置
        </div>
        <div
          style={{
            margin: ".2rem 1rem 1rem 1rem",
          }}
          class="list-background"
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              padding: "4px 13px",
              margin: 0,
              "min-height": "35px",
            }}
          >
            <div>Test 01</div>
            <div>
              {/* @ts-ignore */}
              <input type="checkbox" switch />
            </div>
          </div>
          <hr
            style={{
              margin: "0 0 0 12px",
            }}
          />
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              padding: "4px 13px",
              margin: 0,
              "min-height": "35px",
            }}
          >
            <div>Test 02</div>
            <div>
              {/* @ts-ignore */}
              <input type="checkbox" switch checked />
            </div>
          </div>
          <hr
            style={{
              margin: "0 0 0 12px",
            }}
          />
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              padding: "4px 13px",
              margin: 0,
              "min-height": "35px",
            }}
          >
            <div>Test 03</div>
            <div>
              {/* @ts-ignore */}
              <input type="checkbox" switch />
            </div>
          </div>
          <hr
            style={{
              margin: "0 0 0 12px",
            }}
          />
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              padding: "4px 13px",
              margin: 0,
              "min-height": "35px",
            }}
            onClick={changeAPI}
          >
            <div>API</div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div style={{ color: "gray" }}>
                {apiConfig.apis[parseInt(api())]}
              </div>
              <img src={ArrowRight} />
            </div>
          </div>
          <hr
            style={{
              margin: "0 0 0 12px",
            }}
          />
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              padding: "4px 13px",
              margin: 0,
              "min-height": "35px",
            }}
          >
            <div>版本</div>
            <div style={{ color: "gray" }}>
              {loading() ? "检测中" : version()}
              <Show when={!loading() && version() !== "unknown" && latestVersion() !== "unknown" && needUpdate()}>
                &nbsp;(&nbsp;最新版本 {latestVersion()}, <span onClick={() => {
                  showHUD({
                    type: "progress",
                    interaction: false
                  })
                  updateCurrentApp("https://github.com/MikazukiY/pica-minip/releases/latest/download/pica-minip.zip")
                    .then(() => {
                      showHUD({
                        type: "success",
                        message: "更新成功, 即将重启应用",
                        delay: 1000
                      })
                      setTimeout(() => {
                        closeApp()
                      }, 1000)
                    })
                    .catch(err => {
                      showHUD({
                        type: "error",
                        title: "更新时发生错误",
                        message: err?.message ?? "unknown error"
                      })
                    })
                }} style={{ color: "red", "font-weight": "bold" }}>点击更新</span>&nbsp;)&nbsp;
              </Show>
            </div>
          </div>
        </div>

        <div
          style={{
            margin: "1rem 2rem 1rem 2rem",
          }}
        >
          <button
            style={{
              "background-color": "red",
              color: "white",
              width: "100%",
              height: "50px",
              "font-size": "1rem",
              "border-radius": "12px",
            }}
            onClick={() => {
              showAlert({
                title: "确认登出？",
                actions: [
                  {
                    title: "确认",
                    style: "destructive",
                    key: "confirm",
                  },
                  {
                    title: "取消",
                    style: "cancel",
                    key: "cancel",
                  },
                ],
              }).then((res) => {
                if (res.data.action === "confirm") {
                  deleteKVStorage("jwt").then((res) => {
                    if (res) {
                      showHUD({
                        type: "success",
                        message: "登出成功",
                      });
                    }
                  });
                }
              });
            }}
          >
            登出
          </button>
        </div>
      </div>
    </>
  );
}
