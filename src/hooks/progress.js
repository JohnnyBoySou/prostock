import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "@settings";
import { getChapters } from "@apiv2/getChapters";

const addChaptersToManga = async(manga, newChapter) => {
  try {
    // 1. Obtém o objeto de preferences do AsyncStorage
    const preferencesData = await AsyncStorage.getItem(KEY);
    let preferences = preferencesData ? JSON.parse(preferencesData) : {};

    // 2. Verifica se existe um array de progresso
    if (!preferences.progress) {
      preferences.progress = [];
    }

    // 3. Procura o mangá pelo ID no array de progresso
    const mangaIndex = preferences.progress.findIndex(item => item.id === manga.id);

    // Se o mangá for encontrado
    if (mangaIndex !== -1) {
      // 4. Adiciona o capítulo enviado ao campo "chapters" do mangá existente, caso não existam
      if (!preferences.progress[mangaIndex].chapters.includes(newChapter)) {
        preferences.progress[mangaIndex].chapters.push(newChapter);
      }
    } else {
      // 6. Se o mangá não for encontrado, adiciona-o à lista de progresso com o capítulo fornecido
      console.log("Mangá não encontrado na lista de progresso. Adicionando...");
      const newManga = {
        ...manga,
        chapters: [newChapter]
      };
      preferences.progress.push(newManga);
    }
    // 5. Salva as alterações de volta no AsyncStorage
    await AsyncStorage.setItem(KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Erro ao adicionar capítulos ao progresso:", error);
  }
};

// Função para listar os capítulos de um mangá específico
const listChaptersToManga = async(id) => {
  try {
    // Obtém o objeto de preferences do AsyncStorage
    const preferencesData = await AsyncStorage.getItem(KEY);
    const preferences = preferencesData ? JSON.parse(preferencesData) : {};

    // Verifica se existe um array de progresso
    if (!preferences.progress) {
      console.log("Nenhum mangá em progresso encontrado.");
      return [];
    }

    // Procura o mangá pelo ID no array de progresso
    const manga = preferences.progress.find(manga => manga.id === id);

    // Se o mangá for encontrado
    if (manga) {
      return manga.chapters;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Erro ao listar capítulos do mangá:", error);
    return [];
  }
};

const listLastManga = async() => {
  try {
    const preferencesData = await AsyncStorage.getItem(KEY);
    const preferences = preferencesData ? JSON.parse(preferencesData) : {};
    if (!preferences.progress) {
      console.log("Nenhum mangá em progresso encontrado.");
      return [];
    }
    const lastManga = preferences.progress[preferences.progress.length - 1];
    return lastManga;
  } catch (error) {
    console.error("Erro ao listar último mangá:", error);
    return [];
  }
};

const fetchAndUpdateChapters = async(id) => {
  try {
    const chaptersResponse = await getChapters(id, "pt-br", "desc", 1);
    if (!chaptersResponse || chaptersResponse.length === 0) {
      console.warn(`Nenhum capítulo encontrado para o mangá ${id}`);
      return 0;
    }

    const totalChapters = chaptersResponse[0].chapter;
    const listChapters = await listChaptersToManga(id);
    const porcentage = ((listChapters.length / totalChapters) * 100).toFixed(2);
    return parseFloat(porcentage);
  } catch (error) {
    console.error(`Erro ao buscar capítulos do mangá ${id}:`, error);
    return 0;
  }
};

const listAllMangaProgress = async() => {
  try {
    const lastMangas = await listAllLastMangas();

    if (lastMangas.length === 0) {
      console.log("Nenhum mangá em progresso encontrado.");
      return [];
    }

    // Itera sobre os mangás e busca os capítulos atualizados
    const mangasWithProgress = await Promise.all(
      lastMangas.map(async(manga) => {
        const updatedChapters = await fetchAndUpdateChapters(manga.id);
        return {
          ...manga,
          porcentage: updatedChapters
        };
      })
    );

    return mangasWithProgress;
  } catch (error) {
    console.error("Erro ao listar o progresso dos mangás:", error);
    return [];
  }
};


const listAllLastMangas = async() => {
  try {
    const preferencesData = await AsyncStorage.getItem(KEY);
    const preferences = preferencesData ? JSON.parse(preferencesData) : {};
    if (!preferences.progress) {
      console.log("Nenhum mangá em progresso encontrado.");
      return [];
    }
    const lastManga = preferences.progress;
    return lastManga;
  } catch (error) {
    console.error("Erro ao listar último mangá:", error);
    return [];
  }
};

const excludeMangaProgress = async(id) => {
  try {
    const preferencesData = await AsyncStorage.getItem(KEY);
    const preferences = preferencesData ? JSON.parse(preferencesData) : {};
    if (!preferences.progress) {
      console.log("Nenhum mangá em progresso encontrado.");
      return [];
    }
    const mangaIndex = preferences.progress.findIndex(item => item.id === id);
    if (mangaIndex !== -1) {
      preferences.progress.splice(mangaIndex, 1);
    }
    await AsyncStorage.setItem(KEY, JSON.stringify(preferences));
    console.log("Mangá excluído do progresso com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao excluir mangá do progresso:", error);
  }
};

export { addChaptersToManga, listChaptersToManga, listLastManga, excludeMangaProgress, listAllMangaProgress };
