import { getKVStorage, setKVStorage } from "minip-bridge";

export const KVStore = {
  setLastRead(
    comicId: string,
    { order, title }: { order: number; title: string }
  ) {
    return setKVStorage(
      `lastRead-${comicId}`,
      JSON.stringify({ order, title })
    );
  },
  async getLastRead(comicId: string) {
    try {
      const resStr = (await getKVStorage(`lastRead-${comicId}`)).data;
      return JSON.parse(resStr);
    } catch {}
    return null;
  },
  async setHistory(comic: any) {
    let nowList: Array<any> = [];
    try {
      const str = await getKVStorage("history");
      nowList = [...JSON.parse(str.data)];
    } catch {}
    let idx = -1;
    for (let i = 0; i < nowList.length; i++) {
      if (nowList[i] === comic._id) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) {
      nowList.splice(idx, 1);
    }
    nowList = [comic._id, ...nowList];
    setKVStorage("history", JSON.stringify(nowList));
    setKVStorage(comic._id, JSON.stringify(comic));
  },
  async getHistoryCount() {
    let res = 0;
    try {
      const str = (await getKVStorage("history")).data;
      res = JSON.parse(str).length;
    } catch {}
    return res;
  },
  async getHistoryByPage(page = 1, limit = 10) {
    let startIdx = (page - 1) * limit;
    let nowList: Array<any> = [];
    try {
      const str = (await getKVStorage("history")).data;
      nowList = [...JSON.parse(str)];
    } catch {}

    const resIds = nowList.slice(startIdx, limit);
    const res = [];
    for (let id of resIds) {
      try {
        const s = (await getKVStorage(id)).data;
        res.push(JSON.parse(s));
      } catch {}
    }
    return {
      comics: res,
      page: page,
      pages:
        Math.floor(nowList.length / limit) +
        (nowList.length % limit !== 0 ? 1 : 0),
      total: nowList.length,
    };
  },
};
