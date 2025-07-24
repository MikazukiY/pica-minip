// @ts-nocheck

import { Switch, Match } from 'solid-js';
import Login from './views/Login';
import Home from './views/Home';
import ComicDetail from './views/ComicDetail';
import ComicViewer from './views/ComicViewer';
import CategoryListView from './views/CategoryListView';
import ComicListView from './views/ComicListView';
import CommentsView from './views/CommentsView';
import RankView from './views/RankView';
import ProfileView from './views/ProfileView';
import GameListView from './views/GameListView/GameListView';
import GameDetailView from './views/GameDetailView/GameDetailView';
import SettingsView from './views/SettingsView';

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop as string),
});

function App() {
  const page = params.page ?? "home"
  return (
    <>
      <Switch>
        <Match when={page === "home"}>
          <Home />
        </Match>
        <Match when={page === "login"}>
          <Login />
        </Match>
        <Match when={page === "comic_detail"}>
          <ComicDetail id={params.id} />
        </Match>
        <Match when={page === "comic_viewer"}>
          <ComicViewer comicId={params.comic_id} order={params.order} />
        </Match>
        <Match when={page === "category"}>
          <CategoryListView />
        </Match>
        <Match when={page === "category_detail"}>
          <ComicListView type="category" data={params.category} />
        </Match>
        <Match when={page === "comments"}>
          <CommentsView comicId={params.comic_id} gameId={params.game_id} />
        </Match>
        <Match when={page === "comment_children"}>
          <CommentsView parentComment={JSON.parse(params.parent_comment)} />
        </Match>
        <Match when={page === "rank"}>
          <RankView />
        </Match>
        <Match when={page === "comments_board"}>
          <CommentsView comicId="5822a6e3ad7ede654696e482" />
        </Match>
        <Match when={page === "search_result"}>
          <ComicListView type='search' data={params.keyword} />
        </Match>
        <Match when={page === "author"}>
          <ComicListView type="author" data={params.author} />
        </Match>
        <Match when={page === "chinese_team"}>
          <ComicListView type="chineseTeam" data={params.chineseTeam} />
        </Match>
        <Match when={page === "creator"}>
          <ComicListView type="creator" data={params.creator} />
        </Match>
        <Match when={page === "random"}>
          <ComicListView type="random" hideSort />
        </Match>
        <Match when={page === "favourite"}>
          <ComicListView type="favourite" />
        </Match>
        <Match when={page === "history"}>
          <ComicListView type="history" hideSort />
        </Match>
        <Match when={page === "recently_updated"}>
          <ComicListView type="recentlyUpdate" hideSort />
        </Match>
        <Match when={page === "profile"}>
          <ProfileView />
        </Match>
        <Match when={page === "game_list"}>
          <GameListView />
        </Match>
        <Match when={page === "game_detail"}>
          <GameDetailView gameId={params.game_id} />
        </Match>
        <Match when={page === "settings"}>
          <SettingsView />
        </Match>
      </Switch>
    </>
  )
}

export default App;
