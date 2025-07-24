export const SortTypeRequestKeys = ["dd", "da", "ld", "vd"] as const

export type SortType = typeof SortTypeRequestKeys[number]

export function SortTypeToDescription(type: SortType) {
  if (type === "dd")
    return "新到旧"
  else if (type === "da")
    return "旧到新"
  else if (type === "ld")
    return "最多爱心"
  else
    return "最多指名次数"
}