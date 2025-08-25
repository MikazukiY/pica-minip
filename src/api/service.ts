export const PicaService = {
  /// 登陆
  login: "auth/sign-in",

  /// 大家都在搜
  keywords: "keywords",

  /// 首页推荐
  collections: "collections",

  /// 分类
  categories: "categories",

  /// 漫画排行榜
  leaderboard: "comics/leaderboard?tt=%@&ct=%@",

  /// 漫画列表
  comics: "comics?page=%@&c=%@&s=%@",

  /// 作者
  authorComics: "comics?page=%@&a=%@&s=%@",

  /// 汉化组
  chineseTeamComics: "comics?page=%@&ct=%@&s=%@",

  /// 上传者
  creatorComics: "comics?page=%@&ca=%@&s=%@",

  /// 搜索结果
  search: "comics/advanced-search?page=%@",

  /// 漫画详情
  comicDetail: "comics/%@", // id

  /// 漫画章节
  episodes: "comics/%@/eps?page=%@", // id, page

  /// 爱心
  like: "comics/%@/like", // id

  /// 游戏 爱心
  gameLike: "games/%@/like", // id

  /// 收藏
  favourite: "comics/%@/favourite", // id

  /// 漫画图片
  comicImages: "comics/%@/order/%@/pages?page=%@",

  /// 评论
  comments: "comics/%@/comments?page=%@",
  /// 游戏评论
  gameComments: "games/%@/comments?page=%@",

  /// 子评论
  commentChildren: "comments/%@/childrens?page=%@", // id, page

  /// 点赞评论
  commentLike: "comments/%@/like", // id

  /// 打卡
  punchIn: "users/punch-in",

  /// 个人信息
  profile: "users/profile",

  /// 我的收藏
  userFavourite: "users/favourite?page=%@&s=%@", // id, sort

  /// 随机本子
  random: "comics/random",

  /// 游戏列表
  games: "games?page=%@",

  /// 游戏详情
  gameDetail: "games/%@", // id

  /// 漫画详情页推荐
  recommendation: "comics/%@/recommendation", // id

  /// 漫画发送评论
  sendComment: "comics/%@/comments", // comic id

  /// 游戏发送评论
  sendGameComment: "games/%@/comments", // game id

  ///子评论
  sendChildComment: "comments/%@", // comment id
};
