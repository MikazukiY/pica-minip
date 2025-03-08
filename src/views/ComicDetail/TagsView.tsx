import { navigateTo } from "minip-bridge";
import { For } from "solid-js";

export default function TagsView({ tags }: { tags: Array<string> }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        "flex-wrap": "wrap",
        gap: "3px",
      }}
    >
      <For each={tags}>
        {(item) => (
          <button
            style={{
              color: "#CB6A89",
              "background-color": "#FAEFF3",
              border: "1px solid #CB6A89",
              "border-radius": "100px",
              "font-size": "1rem",
              "font-weight": 500,
              "padding-left": "8px",
              "padding-right": "8px",
            }}
            onClick={() => {
              navigateTo({
                page:
                  "index.html?page=search_result&keyword=" +
                  encodeURIComponent(item),
                title: "搜索: " + item,
              });
            }}
          >
            {item}
          </button>
        )}
      </For>
    </div>
  );
}
