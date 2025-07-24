// // @ts-ignore
// import hmacSHA256 from 'crypto-js/hmac-sha256';
// import { PicaService } from './service';
// import { useStorageAsync } from '../storage';
// import { SortType } from '../common';

// export const apiConfig = {
//   apis: ["https://api.manhuapica.com/", "https://picaapi.picacomic.com/", "https://api.go2778.com/"],
//   selected: 2
// }

// const getDefaultApiAsync = async () => {
//   const [api, _] = await useStorageAsync("selectedApi", 2)
//   const ss = api()
//   if (ss)
//     apiConfig.selected = parseInt(ss)
//   return apiConfig.apis[apiConfig.selected]
// }

// const secretKey = "~d}$Q7$eIni=V)9\\RK/P.RM4;9[7|@/CA}b~OW!3?EV`:<>M7pddUBL5n|0/*Cn"
// function getDefaultHeaders() {
//   return {
//     "api-key": "C69BAF41DA5ABD1FFEDC6D2FEA56B",
//     "accept": "application/vnd.picacomic.com.v1+json",
//     "app-channel": "1",
//     "time": (Date.now() / 1000).toFixed(0),
//     "nonce": "b1ab87b4800d4d4590a11701b8551afa",//随机static uuid??
//     "signature": "",
//     "app-version": "2.2.1.2.3.3",
//     "app-uuid": "defaultUuid",
//     "app-platform": "android",
//     "app-build-version": "44",
//     "Content-Type": "application/json; charset=UTF-8",
//     "User-Agent": "okhttp/3.8.1",
//     "image-quality": "original",
//   }
// }

// function getSignedHeaders(service: string, method: "GET" | "POST"): HeadersInit {
//   const headers = getDefaultHeaders()

//   const raw = (service + headers.time + headers.nonce + method + headers["api-key"]).toLowerCase()
//   headers["signature"] = hmacSHA256(raw, secretKey).toString()
//   return headers
// }
// let reqCount = 0
// const picaRequest = async (...args: Parameters<typeof fetch>) => {
//   reqCount++
//   const res = await fetch(...args)
//   return res.json().then(res => {
//     reqCount--
//     if (res.message === "unauthorized") {
//       if (reqCount === 0) {
//         jwt = ""
//         window.MinipNative.delKVStore("jwt")
//           .then(() =>
//             window.MinipNative.navigateTo("index.html?page=login")
//           )
//         return new Error("unauthorized")
//       }
//     }
//     return res
//   })
// }

// let getJWTCount = 0
// let jwt = ""
// function getJWT(): Promise<string> {
//   getJWTCount++
//   if (jwt === "")
//     return window.MinipNative.getKVStore("jwt")
//       .then(res => {
//         getJWTCount--
//         jwt = res
//         return res
//       })
//       .catch(() => {
//         jwt = ""
//         getJWTCount--
//         if (getJWTCount === 0)
//           window.MinipNative.navigateTo("index.html?page=login")
//         throw new Error("no jwt")
//       })
//   return new Promise((resolve) => {
//     resolve(jwt)
//   })
// }

// export const PicaApi = {
//   async Login(username: string, password: string) {
//     const defaultApi = await getDefaultApiAsync()
//     return fetch(defaultApi + PicaService.login, {
//       method: "POST",
//       headers: getSignedHeaders(PicaService.login, "POST"),
//       body: JSON.stringify({
//         email: username,
//         password
//       })
//     })
//   },
//   async Collections() {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     return picaRequest(defaultApi + PicaService.collections, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(PicaService.collections, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async Keywords() {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     return picaRequest(defaultApi + PicaService.keywords, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(PicaService.keywords, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async Categories() {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     return picaRequest(defaultApi + PicaService.categories, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(PicaService.categories, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async ComicDetail(id: string) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.comicDetail.replace("%@", id)
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async Episodes(id: string, page: number) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.episodes.replace("%@", id).replace("%@", String(page))
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async ComicImages(comicId: string, order: SortType, page: number) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.comicImages
//       .replace("%@", comicId)
//       .replace("%@", String(order))
//       .replace("%@", String(page))
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async Search(keyword: string, page: number, sort: SortType) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.search
//       .replace("%@", String(page))
//     return picaRequest(defaultApi + path, {
//       method: "POST",
//       headers: {
//         ...getSignedHeaders(path, "POST"),
//         "authorization": jwt,
//       },
//       body: JSON.stringify({
//         categories: [],
//         keyword,
//         sort: sort,
//       })
//     })
//   },
//   async Comics(page: number, category: string, sort: SortType) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.comics
//       .replace("%@", String(page))
//       .replace("%@", category)
//       .replace("%@", sort)
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async AuthorComics(page: number, authorName: string, sort: SortType) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.authorComics
//       .replace("%@", String(page))
//       .replace("%@", authorName)
//       .replace("%@", sort)
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async ChineseTeamComics(page: number, chineseTeamName: string, sort: SortType) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.chineseTeamComics
//       .replace("%@", String(page))
//       .replace("%@", chineseTeamName)
//       .replace("%@", sort)
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async creatorComics(page: number, creatorId: string, sort: SortType) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.creatorComics
//       .replace("%@", String(page))
//       .replace("%@", creatorId)
//       .replace("%@", sort)
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async ComicsRecently(page: number) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = `comics?page=${page}&s=dd`
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async Comments(comicId: string, page: number) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.comments
//       .replace("%@", comicId)
//       .replace("%@", String(page))
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async GameComments(gameId: string, page: number) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.gameComments
//       .replace("%@", gameId)
//       .replace("%@", String(page))
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async LeaderBoard(tt: "H24" | "D7" | "D30", ct: string) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.leaderboard
//       .replace("%@", tt)
//       .replace("%@", ct)
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async Favourite(comicId: string) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.favourite
//       .replace("%@", comicId)
//     return picaRequest(defaultApi + path, {
//       method: "POST",
//       headers: {
//         ...getSignedHeaders(path, "POST"),
//         "authorization": jwt,
//       }
//     })
//   },
//   async Like(comicId: string) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.like
//       .replace("%@", comicId)
//     return picaRequest(defaultApi + path, {
//       method: "POST",
//       headers: {
//         ...getSignedHeaders(path, "POST"),
//         "authorization": jwt,
//       }
//     })
//   },
//   async GameLike(gameId: string) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.gameLike
//       .replace("%@", gameId)
//     return picaRequest(defaultApi + path, {
//       method: "POST",
//       headers: {
//         ...getSignedHeaders(path, "POST"),
//         "authorization": jwt,
//       }
//     })
//   },
//   async Profile() {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.profile
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       }
//     })
//   },
//   async PunchIn() {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.punchIn
//     return picaRequest(defaultApi + path, {
//       method: "POST",
//       headers: {
//         ...getSignedHeaders(path, "POST"),
//         "authorization": jwt,
//       }
//     })
//   },
//   async UserFavourite(page: number, sort: SortType = "dd") {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.userFavourite
//       .replace("%@", String(page))
//       .replace("%@", String(sort))
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       }
//     })
//   },
//   async Random() {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.random
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       }
//     })
//   },
//   async Games(page: number) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.games
//       .replace("%@", String(page))
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       }
//     })
//   },
//   async GameDetail(gameId: string) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.gameDetail
//       .replace("%@", gameId)
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       }
//     })
//   },
//   async CommentLike(commentId: string) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.commentLike
//       .replace("%@", commentId)
//     return picaRequest(defaultApi + path, {
//       method: "POST",
//       headers: {
//         ...getSignedHeaders(path, "POST"),
//         "authorization": jwt,
//       }
//     })
//   },
//   async CommentChildren(parentCommentId: string, page: number) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.commentChildren
//       .replace("%@", parentCommentId)
//       .replace("%@", String(page))
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   },
//   async Recommendation(comicId: string) {
//     const jwt = await getJWT()
//     const defaultApi = await getDefaultApiAsync()
//     const path = PicaService.recommendation
//       .replace("%@", comicId)
//     return picaRequest(defaultApi + path, {
//       method: "GET",
//       headers: {
//         ...getSignedHeaders(path, "GET"),
//         "authorization": jwt,
//       },
//     })
//   }
// }
