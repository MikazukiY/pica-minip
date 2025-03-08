import { Accessor, For } from "solid-js";
import registerNameImg from "../../assets/register_name.png";
import { tap } from "../../utils";
import { navigateTo } from "minip-bridge";

export default function KeywordsView({
  keywords,
}: {
  keywords: Accessor<Array<string>>;
}) {
  return (
    <div
      style={{
        "padding-left": "0.5rem",
        "padding-right": "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <img
          style={{
            width: "1.4rem",
          }}
          src={registerNameImg}
        />
        <div
          style={{
            "font-size": "1.2rem",
            "font-weight": 500,
            color: "#da9cb3",
          }}
        >
          大家都在搜索的关键字
        </div>
      </div>
      <hr />
      <div
        style={{
          display: "flex",
          width: "100%",
          "flex-wrap": "wrap",
          gap: "3px",
        }}
      >
        <For each={keywords()}>
          {(item) => (
            <span
              style={{
                color: "#F1934B",
                "background-color": "#FDEECF",
                border: "1px solid #F1934B",
                "border-radius": "100px",
                "font-size": "1rem",
                "font-weight": 500,
                "padding-left": "8px",
                "padding-right": "8px",
              }}
              ref={(el) =>
                tap(el, () => {
                  navigateTo({
                    page:
                      "index.html?page=search_result&keyword=" +
                      encodeURIComponent(item),
                    title: "搜索: " + item,
                  });
                })
              }
            >
              {item}
            </span>
          )}
        </For>
      </div>

      <hr />
    </div>
  );
}
