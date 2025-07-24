export function translateX(x: number) {
  if (x === 0) return "";

  return `translate3d(${x}px, 0, 0)`;
}
