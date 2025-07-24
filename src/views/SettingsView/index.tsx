import {
  deleteKVStorage,
  getKVStorage,
  setKVStorage,
  showAlert,
  showHUD,
  vibrate,
} from "minip-bridge";
import { apiConfig } from "../../api/api";
import ArrowRight from "../../assets/arrow-right.svg";
import "./index.css";
import { createSignal, onMount } from "solid-js";

export default function SettingsView() {
  const [api, setSS] = createSignal("2");
  onMount(() => {
    getKVStorage("selectedApi").then((res) => {
      if (res.data) setSS(res.data);
      else setSS(apiConfig.selected.toString());
    });
  });

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
