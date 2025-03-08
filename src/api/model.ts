export interface PicaCategory {
  title: string;
  thumb: PicaThumb;
  isWeb: boolean;
  active: boolean;
  link: string;
}

export interface PicaCollection {
  title: string;
  comics: PicaComic[];
}

export interface PicaComic {
  _id: string;
  title: string;
  author: string;
  pagesCount: number;
  epsCount: number;
  finished: boolean;
  categories: string[];
  thumb: PicaThumb;
  likesCount: number;
  totalViews: number;
  totalLikes: number;
}

export interface PicaComicDetail {
  _id: string;
  _creator: PicaUser;
  title: string;
  description: string;
  thumb: PicaThumb;
  author: string;
  chineseTeam: string;
  categories: string[];
  tags: string[];
  pagesCount: number;
  epsCount: number;
  finished: boolean;
  updated_at: string;
  created_at: string;
  allowDownload: boolean;
  viewsCount: number;
  likesCount: number;
  isFavourite: boolean;
  isLiked: boolean;
  commentsCount: number;
  totalComments: number;
}

export interface PicaComicImage {
  _id: string;
  media: PicaThumb;
  id: string;
}

export interface PicaComment {
  _id: string;
  _user?: PicaUser;
  _comic: string;
  isTop: boolean;
  hide: boolean;
  created_at: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  content: string;
}

export interface PicaEpisode {
  _id: string;
  title: string;
  order: number;
  updated_at: string;
  id: string;
}

export interface PicaGame {
  _id: string;
  adult: boolean;
  android: boolean;
  ios: boolean;
  icon: PicaThumb;
  publisher: string;
  suggest: boolean;
  title: string;
  version: string;
}

export interface PicaGameDetail {
  _id: string;
  adult: boolean;
  android: boolean;
  ios: boolean;
  icon: PicaThumb;
  publisher: string;
  suggest: boolean;
  title: string;
  version: string;
  description: string;
  iosLinks: string[];
  androidLinks: string[];
  downloadsCount: number;
  screenshots: PicaThumb[];
  androidSize: number;
  iosSize: number;
  updateContent: string;
  videoLink: string;
  updated_at: string;
  created_at: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
}

export interface PicaMyInfo {
  _id: string;
  birthday: string;
  email: string;
  gender: string;
  name: string;
  title: string;
  verified: boolean;
  exp: number;
  level: number;
  characters: string[];
  character: string;
  created_at: string;
  isPunched: boolean;
  slogan: string;
  avatar: PicaThumb;
}

export interface PicaRankComic {
  _id: string;
  title: string;
  author: string;
  pagesCount: number;
  epsCount: number;
  finished: boolean;
  categories: string[];
  thumb: PicaThumb;
  likesCount: number;
  totalViews: number;
  totalLikes: number;
  viewsCount: number;
  leaderboardCount: number;
}

export interface PicaThumb {
  originalName: string;
  path: string;
  fileServer: string;
}

export interface PicaUser {
  _id: string;
  id: string;
  gender: string;
  name: string;
  slogan: string;
  title: string;
  verified: boolean;
  exp: number;
  level: number;
  characters: string[];
  role: string;
  avatar: PicaThumb;
  character: string;
  comicsUploaded: number;
}