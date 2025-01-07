import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@read";

export const addReadChapter = async(mangaId, chapterId) => {
  try {
    // Obtém o objeto de reads do AsyncStorage
    const readData = await AsyncStorage.getItem(KEY);
    const reads = readData ? JSON.parse(readData) : [];
  
    // Procura o mangá pelo ID no array de reads
    const mangaIndex = reads.findIndex(manga => manga.id === mangaId);
  
    if (mangaIndex !== -1) {
      // Adiciona o capítulo ao mangá existente, se não estiver presente
      if (!reads[mangaIndex].chapters.includes(chapterId)) {
        reads[mangaIndex].chapters.push(chapterId);
      }
    } else {
      // Adiciona um novo mangá com o capítulo lido
      reads.push({ id: mangaId, chapters: [chapterId] });
    }
  
    // Salva os dados atualizados no AsyncStorage
    await AsyncStorage.setItem(KEY, JSON.stringify(reads));
  } catch (error) {
    console.error("Erro ao adicionar capítulo ao progresso:", error);
  }
};

export const verifyRead = async(mangaId, chapterId) => {
  try {
    // Obtém o objeto de preferences do AsyncStorage
    const readData = await AsyncStorage.getItem(KEY);
    const reads = readData ? JSON.parse(readData) : [];

    // Verifica se 'reads' é um array
    if (!Array.isArray(reads)) {
      console.error("Formato inválido para 'reads'");
      return false; // Não há reads salvos ou o formato está incorreto
    }

    // Procura o mangá pelo ID no array de reads
    const manga = reads.find(manga => manga.id === mangaId);

    if (manga) {
      // Verifica se o capítulo está presente na lista de capítulos do mangá
      return manga.chapters.includes(chapterId); // Retorna true ou false
    }

    return false; // Mangá não encontrado ou capítulo não lido
  } catch (error) {
    console.error("Erro ao verificar se o capítulo foi lido:", error);
    return false; // Retorna false em caso de erro
  }
};

export const listReadChapters = async(mangaId) => {
  try {
    // Obtém os dados de reads do AsyncStorage
    const readData = await AsyncStorage.getItem(KEY);
    const reads = readData ? JSON.parse(readData) : [];
  
    // Procura o mangá pelo ID no array de reads
    const manga = reads.find(manga => manga.id === mangaId);
  
    if (manga) {
      return manga.chapters; // Retorna a lista de capítulos lidos
    }
  
    return []; // Mangá não encontrado
  } catch (error) {
    console.error("Erro ao listar capítulos lidos:", error);
    return [];
  }
};

export const listAllReadMangas = async() => {
  try {
    // Obtém os dados de reads do AsyncStorage
    const readData = await AsyncStorage.getItem(KEY);
    const reads = readData ? JSON.parse(readData) : [];
  
    return reads; // Retorna todos os mangás lidos
  } catch (error) {
    console.error("Erro ao listar todos os mangás lidos:", error);
    return [];
  }
};

export const removeReadManga = async(mangaId) => {
  try {
    // Obtém os dados de reads do AsyncStorage
    const readData = await AsyncStorage.getItem(KEY);
    const reads = readData ? JSON.parse(readData) : [];
  
    // Filtra os mangás, removendo o especificado
    const updatedReads = reads.filter(manga => manga.id !== mangaId);
  
    // Salva os dados atualizados no AsyncStorage
    await AsyncStorage.setItem(KEY, JSON.stringify(updatedReads));
    console.log(`Mangá ${mangaId} removido do progresso de leitura.`);
  } catch (error) {
    console.error("Erro ao remover progresso do mangá:", error);
  }
};
