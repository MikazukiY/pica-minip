// @ts-ignore
import hmacSHA256 from "crypto-js/hmac-sha256";
import { PicaService } from "./service";
import { SortType } from "../common";
import {
  CategoriesResData,
  CollectionsResData,
  ComicInfoResData,
  ComicRankResData,
  ComicsResData,
  CommentsResData,
  EpisodesResData,
  FavoriteResData,
  GameDetailResData,
  GameResData,
  KeywordsResData,
  LikeResData,
  LoginResData,
  PersonInfoResData,
  PicaResponse,
  PictureResData,
} from "./response";
import { deleteKVStorage, getKVStorage, navigateTo } from "minip-bridge";

export const apiConfig = {
  apis: [
    "https://api.manhuapica.com/",
    "https://picaapi.picacomic.com/",
    "https://api.go2778.com/",
  ],
  selected: 2,
};

const getDefaultApiAsync = async () => {
  const ss = (await getKVStorage("selectedApi")).data;
  if (ss) apiConfig.selected = parseInt(ss);
  if (apiConfig.selected < 0 || apiConfig.selected >= apiConfig.apis.length)
    apiConfig.selected = 2;
  return apiConfig.apis[apiConfig.selected];
};

const secretKey =
  "~d}$Q7$eIni=V)9\\RK/P.RM4;9[7|@/CA}b~OW!3?EV`:<>M7pddUBL5n|0/*Cn";
function getDefaultHeaders() {
  return {
    "api-key": "C69BAF41DA5ABD1FFEDC6D2FEA56B",
    accept: "application/vnd.picacomic.com.v1+json",
    "app-channel": "1",
    time: (Date.now() / 1000).toFixed(0),
    nonce: "b1ab87b4800d4d4590a11701b8551afa", //随机static uuid??
    signature: "",
    "app-version": "2.2.1.2.3.3",
    "app-uuid": "defaultUuid",
    "app-platform": "android",
    "app-build-version": "44",
    "Content-Type": "application/json; charset=UTF-8",
    "User-Agent": "okhttp/3.8.1",
    "image-quality": "original",
  };
}

function getSignedHeaders(
  service: string,
  method: "GET" | "POST"
): HeadersInit {
  const headers = getDefaultHeaders();

  const raw = (
    service +
    headers.time +
    headers.nonce +
    method +
    headers["api-key"]
  ).toLowerCase();
  headers["signature"] = hmacSHA256(raw, secretKey).toString();
  return headers;
}
let reqCount = 0;
const picaRequest = async function <T>(
  ...args: Parameters<typeof fetch>
): Promise<PicaResponse<T>> {
  reqCount++;
  const res = await fetch(...args);
  return res.json().then((res: PicaResponse<T>) => {
    reqCount--;
    if (res.message === "unauthorized") {
      if (reqCount === 0) {
        jwt = "";
        deleteKVStorage("jwt").then(() =>
          navigateTo({
            page: "index.html?page=login",
            title: "登录",
          })
        );
        throw new Error("unauthorized");
      }
    }
    return res;
  });
};

let getJWTCount = 0;
let jwt = "";
function getJWT(): Promise<string> {
  getJWTCount++;
  if (jwt === "")
    return getKVStorage("jwt")
      .then((res) => {
        getJWTCount--;
        jwt = res.data;
        return res.data;
      })
      .catch(() => {
        jwt = "";
        getJWTCount--;
        if (getJWTCount === 0)
          navigateTo({
            page: "index.html?page=login",
            title: "登录",
          });
        throw new Error("no jwt");
      });
  return new Promise((resolve) => {
    resolve(jwt);
  });
}

export const PicaApi2 = {
  async Login(
    username: string,
    password: string
  ): Promise<PicaResponse<LoginResData>> {
    const defaultApi = await getDefaultApiAsync();
    return fetch(defaultApi + PicaService.login, {
      method: "POST",
      headers: getSignedHeaders(PicaService.login, "POST"),
      body: JSON.stringify({
        email: username,
        password,
      }),
    }).then((res) => res.json());
  },
  async Collections(): Promise<PicaResponse<CollectionsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    return picaRequest(defaultApi + PicaService.collections, {
      method: "GET",
      headers: {
        ...getSignedHeaders(PicaService.collections, "GET"),
        authorization: jwt,
      },
    });
  },
  async Keywords(): Promise<PicaResponse<KeywordsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    return picaRequest(defaultApi + PicaService.keywords, {
      method: "GET",
      headers: {
        ...getSignedHeaders(PicaService.keywords, "GET"),
        authorization: jwt,
      },
    });
  },
  async Categories(): Promise<PicaResponse<CategoriesResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    return picaRequest(defaultApi + PicaService.categories, {
      method: "GET",
      headers: {
        ...getSignedHeaders(PicaService.categories, "GET"),
        authorization: jwt,
      },
    });
  },
  async ComicDetail(id: string): Promise<PicaResponse<ComicInfoResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.comicDetail.replace("%@", id);
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async Episodes(
    id: string,
    page: number
  ): Promise<PicaResponse<EpisodesResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.episodes
      .replace("%@", id)
      .replace("%@", String(page));
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async ComicImages(
    comicId: string,
    order: number,
    page: number
  ): Promise<PicaResponse<PictureResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.comicImages
      .replace("%@", comicId)
      .replace("%@", String(order))
      .replace("%@", String(page));
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async Search(
    keyword: string,
    page: number,
    sort: SortType
  ): Promise<PicaResponse<ComicsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.search.replace("%@", String(page));
    return picaRequest(defaultApi + path, {
      method: "POST",
      headers: {
        ...getSignedHeaders(path, "POST"),
        authorization: jwt,
      },
      body: JSON.stringify({
        categories: [],
        keyword,
        sort: sort,
      }),
    });
  },
  async Comics(
    page: number,
    category: string,
    sort: SortType
  ): Promise<PicaResponse<ComicsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.comics
      .replace("%@", String(page))
      .replace("%@", category)
      .replace("%@", sort);
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async AuthorComics(
    page: number,
    authorName: string,
    sort: SortType
  ): Promise<PicaResponse<ComicsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.authorComics
      .replace("%@", String(page))
      .replace("%@", authorName)
      .replace("%@", sort);
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async ChineseTeamComics(
    page: number,
    chineseTeamName: string,
    sort: SortType
  ): Promise<PicaResponse<ComicsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.chineseTeamComics
      .replace("%@", String(page))
      .replace("%@", chineseTeamName)
      .replace("%@", sort);
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async creatorComics(
    page: number,
    creatorId: string,
    sort: SortType
  ): Promise<PicaResponse<ComicsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.creatorComics
      .replace("%@", String(page))
      .replace("%@", creatorId)
      .replace("%@", sort);
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async ComicsRecently(page: number): Promise<PicaResponse<ComicsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = `comics?page=${page}&s=dd`;
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async Comments(
    comicId: string,
    page: number
  ): Promise<PicaResponse<CommentsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.comments
      .replace("%@", comicId)
      .replace("%@", String(page));
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async GameComments(
    gameId: string,
    page: number
  ): Promise<PicaResponse<CommentsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.gameComments
      .replace("%@", gameId)
      .replace("%@", String(page));
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async LeaderBoard(
    tt: "H24" | "D7" | "D30",
    ct: string
  ): Promise<PicaResponse<ComicRankResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.leaderboard.replace("%@", tt).replace("%@", ct);
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async Favourite(comicId: string): Promise<PicaResponse<FavoriteResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.favourite.replace("%@", comicId);
    return picaRequest(defaultApi + path, {
      method: "POST",
      headers: {
        ...getSignedHeaders(path, "POST"),
        authorization: jwt,
      },
    });
  },
  async Like(comicId: string): Promise<PicaResponse<LikeResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.like.replace("%@", comicId);
    return picaRequest(defaultApi + path, {
      method: "POST",
      headers: {
        ...getSignedHeaders(path, "POST"),
        authorization: jwt,
      },
    });
  },
  async GameLike(gameId: string): Promise<PicaResponse<LikeResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.gameLike.replace("%@", gameId);
    return picaRequest(defaultApi + path, {
      method: "POST",
      headers: {
        ...getSignedHeaders(path, "POST"),
        authorization: jwt,
      },
    });
  },
  async Profile(): Promise<PicaResponse<PersonInfoResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.profile;
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async PunchIn(): Promise<PicaResponse<any>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.punchIn;
    return picaRequest(defaultApi + path, {
      method: "POST",
      headers: {
        ...getSignedHeaders(path, "POST"),
        authorization: jwt,
      },
    });
  },
  async UserFavourite(
    page: number,
    sort: SortType = "dd"
  ): Promise<PicaResponse<ComicsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.userFavourite
      .replace("%@", String(page))
      .replace("%@", String(sort));
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async Random(): Promise<PicaResponse<any>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.random;
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async Games(page: number): Promise<PicaResponse<GameResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.games.replace("%@", String(page));
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async GameDetail(gameId: string): Promise<PicaResponse<GameDetailResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.gameDetail.replace("%@", gameId);
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async CommentLike(commentId: string): Promise<PicaResponse<LikeResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.commentLike.replace("%@", commentId);
    return picaRequest(defaultApi + path, {
      method: "POST",
      headers: {
        ...getSignedHeaders(path, "POST"),
        authorization: jwt,
      },
    });
  },
  async CommentChildren(
    parentCommentId: string,
    page: number
  ): Promise<PicaResponse<CommentsResData>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.commentChildren
      .replace("%@", parentCommentId)
      .replace("%@", String(page));
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async Recommendation(comicId: string): Promise<PicaResponse<any>> {
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();
    const path = PicaService.recommendation.replace("%@", comicId);
    return picaRequest(defaultApi + path, {
      method: "GET",
      headers: {
        ...getSignedHeaders(path, "GET"),
        authorization: jwt,
      },
    });
  },
  async SubmitComment(
    comment: string,
    comicID?: string,
    gameID?: string
  ): Promise<PicaResponse<undefined>> {
    if (!comicID && !gameID) throw new Error("comicID or gameID is required");
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();

    let path;
    if (comicID) path = PicaService.sendComment.replace("%@", comicID);
    else if (gameID) path = PicaService.sendGameComment.replace("%@", gameID);
    if (!path) throw new Error("path is required");
    console.log(path);
    return picaRequest(defaultApi + path, {
      method: "POST",
      headers: {
        ...getSignedHeaders(path, "POST"),
        authorization: jwt,
      },
      body: JSON.stringify({ content: comment }),
    });
  },
  async SubmitChildComment(
    comment: string,
    parentCommentId?: string
  ): Promise<PicaResponse<undefined>> {
    if (!parentCommentId) throw new Error("parentCommentId is required");
    const jwt = await getJWT();
    const defaultApi = await getDefaultApiAsync();

    const path = PicaService.sendChildComment.replace("%@", parentCommentId);
    return picaRequest(defaultApi + path, {
      method: "POST",
      headers: {
        ...getSignedHeaders(path, "POST"),
        authorization: jwt,
      },
      body: JSON.stringify({ content: comment }),
    });
  },
};
