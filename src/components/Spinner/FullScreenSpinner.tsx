import Spinner from ".";

export function FullScreenSpinner() {
  return (
    <div style={{
      display: "flex",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      "justify-content": "center",
      "align-items": "center",
    }}>
      <Spinner />
    </div>
  )
}