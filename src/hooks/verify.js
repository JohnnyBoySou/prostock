import { verifyOffline } from "./offline"; // mangaId, idChapter
import { verifyMark } from "./marks"; // mangaId, idChapter
import { verifyRead } from "./read"; // mangaId, idChapter

export const verifyList = async(mangaId, chapterId) => {
  try {
    const offline = await verifyOffline(mangaId, chapterId);
    const mark = await verifyMark(mangaId, chapterId);
    const read = await verifyRead(mangaId, chapterId);
  
    const data = {
      offline: offline !== undefined ? offline : false,
      mark: mark !== undefined ? mark : false,
      read: read !== undefined ? read : false
    };

    return data;
  } catch (error) {
    console.error("Erro ao verificar status do capítulo:", error);
    return {
      offline: false,
      mark: false,
      read: false
    };
  }
};
  
