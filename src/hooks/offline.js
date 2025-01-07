import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPages } from "@apiv2/getPages";



const saveChapterOffline = async(chapterId, mangaId, metadata, lg = "pt-br", chapter) => {
  const pageFilePaths = [];

  try {
    // Carregar capítulos salvos anteriormente
    const allChapters = JSON.parse(await AsyncStorage.getItem("chapters")) || {};

    // Verificar se o capítulo já está salvo
    if (allChapters[chapterId]) {
      // Remover as páginas salvas do capítulo
      const savedPages = allChapters[chapterId].pages;
      
      // Verificar se 'savedPages' é um array
      if (!Array.isArray(savedPages)) {
        console.error(`Páginas salvas para o capítulo ${chapterId} não estão no formato esperado.`);
        return { status: false };
      }

      for (const pagePath of savedPages) {
        await FileSystem.deleteAsync(pagePath, { idempotent: true });
      }

      // Remover o capítulo do armazenamento
      delete allChapters[chapterId];
      await AsyncStorage.setItem("chapters", JSON.stringify(allChapters));

      console.log(`Capítulo ${chapterId} já estava salvo e foi removido.`);
      return { status: false };
    }

    // Buscar as URLs das páginas usando a função getPages
    const res = await getPages(chapterId, mangaId, lg);
    
    // Verificar se 'res' é válido e se 'pages' é um array
    if (!res || !Array.isArray(res.pages)) {
      console.error(`Erro ao obter as páginas: ${JSON.stringify(res)}`);
      return { status: false };
    }
    
    const imageUrls = res.pages;

    // Baixar e salvar cada página localmente
    for (let i = 0; i < imageUrls.length; i++) {
      const fileUri = `${FileSystem.documentDirectory}chapter_${chapterId}_page_${i}.jpg`;
      const download = await FileSystem.downloadAsync(imageUrls[i], fileUri);

      if (download.status === 200) {
        pageFilePaths.push(fileUri);
      } else {
        console.error(`Erro ao baixar a página ${i + 1}`);
      }
    }

    allChapters[chapterId] = {
      pages: pageFilePaths,
      manga_id: metadata.id,
      manga_name: metadata.name,
      manga_capa: metadata.capa,
      language: chapter.language,
      title: chapter.title,
      pages_total: chapter.pages,
      volume: chapter.volume,
      publish_date: chapter.publish_date,
      chapter: chapter.chapter
    };

    await AsyncStorage.setItem("chapters", JSON.stringify(allChapters));

    return { status: true };
  } catch (error) {
    console.error("Erro ao salvar o capítulo offline:", error);
    return { status: false, error };
  }
};
const loadChapterOffline = async(chapterId) => {
  try {
    const chapters = JSON.parse(await AsyncStorage.getItem("chapters")) || {};
    const chapterInfo = chapters[chapterId];
    if (chapterInfo) {
      console.log(chapterInfo);
      return chapterInfo;  // Retorna o conteúdo do capítulo com os URIs das páginas
    } else {
      console.log("Capítulo não encontrado offline");
      return null;
    }
  } catch (error) {
    console.error("Erro ao carregar o capítulo offline:", error);
    return null;
  }
};

const getAllSavedChapters = async() => {
  try {
    const allChapters = JSON.parse(await AsyncStorage.getItem("chapters")) || {};
    
    // Objeto para agrupar mangas e seus respectivos capítulos
    const mangas = {};

    for (const chapterId in allChapters) {
      const chapterData = allChapters[chapterId];
      
      // Obter o ID do manga e os dados do capítulo
      const { manga_id, manga_name, manga_capa, chapter } = chapterData;
      
      // Verificar se o manga já existe no objeto
      if (!mangas[manga_id]) {
        mangas[manga_id] = {
          manga_id,
          manga_name,
          manga_capa,
          chapter,
          chapters: [] // Inicializar um array para os capítulos
        };
      }

      // Adicionar o capítulo ao array de capítulos do manga
      mangas[manga_id].chapters.push({
        chapterId,
        title: chapterData.title,
        chapter: chapterData.chapter,
        publish_date: chapterData.publish_date
        // Adicione outros metadados que você deseja incluir
      });
    }

    // Converter o objeto em um array para retornar
    return Object.values(mangas); // Retorna um array de mangas com seus capítulos
  } catch (error) {
    console.error("Erro ao carregar capítulos salvos:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};


const deleteChapterOffline = async(chapterId) => {
  try {
    // Carregar os capítulos salvos
    const allChapters = JSON.parse(await AsyncStorage.getItem("chapters")) || {};

    // Verificar se o capítulo existe
    if (allChapters[chapterId]) {
      const savedPages = allChapters[chapterId].pages; // Acessar as páginas do capítulo

      // Excluir cada arquivo de página do capítulo
      if (Array.isArray(savedPages)) { // Verificar se savedPages é um array
        for (let fileUri of savedPages) {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        }
      } else {
        console.warn(`Páginas salvas para o capítulo ${chapterId} não são um array:`, savedPages);
      }

      // Remover o capítulo do armazenamento
      delete allChapters[chapterId];
      await AsyncStorage.setItem("chapters", JSON.stringify(allChapters));

      console.log(`Capítulo ${chapterId} excluído com sucesso!`);
      return true;
    } else {
      console.log(`Capítulo ${chapterId} não encontrado.`);
      return false;
    }
  } catch (error) {
    console.error("Erro ao excluir o capítulo offline:", error);
    return false;
  }
};

const verifyOffline = async(mangaId, chapterId) => {
  try {
    const allChapters = JSON.parse(await AsyncStorage.getItem("chapters")) || {};
    
    // Verificar se o mangaId existe
    const manga = Object.values(allChapters).find(item => item.manga_id === mangaId);

    if (manga) {
      console.log("Manga encontrado, páginas:", manga.pages);
      return manga.pages && manga.pages.includes(chapterId); // Retorna true ou false
    }

    return false; // Mangá não encontrado ou capítulo não encontrado para o manga
  } catch (error) {
    console.error("Erro ao verificar se o capítulo está salvo offline:", error);
    return false; // Retorna false em caso de erro
  }
};




const deleteAllChaptersOffline = async() => {
  try {
    // Carregar capítulos salvos anteriormente
    const allChapters = JSON.parse(await AsyncStorage.getItem("chapters")) || {};

    // Remover cada capítulo
    for (const chapterId in allChapters) {
      const savedPages = allChapters[chapterId].pages;

      // Verificar se savedPages é um array antes de iterar
      if (Array.isArray(savedPages)) {
        // Deletar cada página salva
        for (const pagePath of savedPages) {
          await FileSystem.deleteAsync(pagePath, { idempotent: true });
        }
      } else {
        console.warn(`Páginas salvas para o capítulo ${chapterId} não são um array:`, savedPages);
      }
    }
    // Limpar o AsyncStorage
    await AsyncStorage.removeItem("chapters");

    console.log("Todos os capítulos offline foram deletados com sucesso.");
    return true; // Indica que a operação foi bem-sucedida
  } catch (error) {
    console.error("Erro ao deletar capítulos offline:", error);
    return false; // Indica que houve um erro
  }
};

export { saveChapterOffline, loadChapterOffline, getAllSavedChapters, deleteChapterOffline, verifyOffline, deleteAllChaptersOffline };
