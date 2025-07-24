import {
  PicaCategory,
  PicaCollection,
  PicaComic,
  PicaComicDetail,
  PicaComicImage,
  PicaComment,
  PicaEpisode,
  PicaGame,
  PicaGameDetail,
  PicaMyInfo,
  PicaRankComic,
  PicaUser,
} from "./model";

export interface PicaResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface LoginResData {
  token: string;
}

export interface CategoriesResData {
  categories: PicaCategory[];
}

export interface ComicsResData {
  comics: Comics;
}

export interface Comics {
  docs: PicaComic[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface ComicRankResData {
  comics: PicaRankComic[];
}

export interface ComicInfoResData {
  comic: PicaComicDetail;
}

export interface EpisodesResData {
  eps: Eps;
}

export interface Eps {
  docs: PicaEpisode[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface PictureResData {
  pages: Pages;
  ep: Ep;
}

export interface Pages {
  docs: PicaComicImage[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface Ep {
  _id: string;
  title: string;
}

export interface KeywordsResData {
  keywords: string[];
}

export interface LikeResData {
  action: string;
}

export interface CommentsResData {
  comments: Comments;
  topComments: PicaComment[];
}

export interface Comments {
  total: number;
  limit: number;
  page: number | string;
  pages: number;
  docs: PicaComment[];
}

export interface FavoriteResData {
  action: string;
}

export interface PersonInfoResData {
  user: PicaMyInfo;
}

export interface CollectionsResData {
  collections: PicaCollection[];
}

export interface RandomResData {
  comics: PicaComic[];
}

export interface GameResData {
  games: Games;
}

export interface Games {
  limit: number;
  page: number;
  pages: number;
  total: number;
  docs: PicaGame[];
}

export interface GameDetailResData {
  game: PicaGameDetail;
}

export interface KnightRankResData {
  users: PicaUser[];
}
