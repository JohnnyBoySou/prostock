import { toggleMarkToManga } from "./marks"; //mangaid chapterid
import { saveChapterOffline } from "./offline"; //chapterId, mangaId, itm, item
import { addReadChapter } from "./read"; //mangaitm chapterid

export const addRead = addReadChapter;
export const addMark = toggleMarkToManga;
export const addOffline = saveChapterOffline;
