import { Accessor, For } from "solid-js";
import ComicItem from "../../components/ComicItem";
import { PicaComic } from "../../api/model";

export default function CollectionsView({ collections }: { collections: Accessor<PicaComic[]> }) {
  return <>
    <For each={collections()}>
      {item => <ComicItem comic={item} />}
    </For>
  </>
}