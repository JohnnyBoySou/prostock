import AsyncStorage from "@react-native-async-storage/async-storage";

// Obter dados de marcas
const getMarksData = async() => {
  try {
    const marksData = await AsyncStorage.getItem("marks");
    return marksData ? JSON.parse(marksData) : []; // Certifique-se de que sempre retorna um array
  } catch (error) {
    console.error("Erro ao obter os dados de marcas:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};


// Salvar dados de marcas
const saveMarksData = async(marks) => {
  try {
    await AsyncStorage.setItem("marks", JSON.stringify(marks));
  } catch (error) {
    console.error("Erro ao salvar os dados de marcas:", error);
  }
};

// Adicionar capítulo ao mangá
const addMarkToManga = async(mangaId, chapter) => {
  try {
    const marks = await getMarksData();
    const mangaIndex = marks.findIndex((manga) => manga.id === mangaId);

    if (mangaIndex !== -1) {
      const manga = marks[mangaIndex];
      if (!manga.chapters.find((c) => c.id === chapter.id)) {
        manga.chapters.push(chapter); // Adiciona capítulo se ainda não estiver no array
      }
    } else {
      marks.push({ id: mangaId, chapters: [chapter] }); // Adiciona novo mangá com o capítulo
    }

    await saveMarksData(marks);
    console.log("salvo");
  } catch (error) {
    console.error("Erro ao adicionar capítulo ao mangá:", error);
  }
};

// Remover capítulo do mangá
const removeMarkToManga = async(mangaId, chapterId) => {
  try {
    const marks = await getMarksData();
    const mangaIndex = marks.findIndex((manga) => manga.id === mangaId);

    if (mangaIndex !== -1) {
      const manga = marks[mangaIndex];
      manga.chapters = manga.chapters.filter((chapter) => chapter.id !== chapterId);

      if (manga.chapters.length === 0) {
        marks.splice(mangaIndex, 1); // Remove o mangá se não houver capítulos
      }

      await saveMarksData(marks);
    }
  } catch (error) {
    console.error("Erro ao remover capítulo do mangá:", error);
  }
};

// Alternar marca de capítulo
const toggleMarkToManga = async(mangaId, chapter) => {
  try {
    const marks = await getMarksData();
    const mangaIndex = marks.findIndex((manga) => manga.id === mangaId);

    if (mangaIndex !== -1) {
      const manga = marks[mangaIndex];
      const chapterIndex = manga.chapters.findIndex((c) => c.id === chapter.id);

      if (chapterIndex !== -1) {
        // Remove o capítulo se já estiver no array
        manga.chapters.splice(chapterIndex, 1);
        console.log("Capítulo removido.");

        // Remove o mangá se não tiver mais capítulos
        if (manga.chapters.length === 0) {
          marks.splice(mangaIndex, 1);
        }
      } else {
        // Adiciona o capítulo se não existir
        manga.chapters.push(chapter);
        console.log("Capítulo adicionado.");
      }
    } else {
      // Adiciona um novo mangá com o capítulo
      marks.push({
        id: mangaId,
        chapters: [chapter]
      });
      console.log("Mangá e capítulo adicionados.");
    }

    // Salvar os dados atualizados
    await saveMarksData(marks);
    return true;
  } catch (error) {
    console.error("Erro ao alternar marca do capítulo:", error);
    return false;
  }
};

// Verificar se o capítulo está marcado
const verifyMark = async(mangaId, chapterId) => {
  try {
    const marks = await getMarksData();
    const manga = marks.find((manga) => manga.id === mangaId);
    if (manga) {
      return manga.chapters.some((chapter) => chapter.id === chapterId); // Retorna true ou false
    }
    return false; 
  } catch (error) {
    console.error("Erro ao verificar marca do capítulo:", error);
    return false;
  }
};


// Listar capítulos marcados de um mangá
const listMarksToManga = async(mangaId) => {
  try {
    const marks = await getMarksData();
    const manga = marks.find((manga) => manga.id === mangaId);

    return manga?.chapters || [];
  } catch (error) {
    console.error("Erro ao listar capítulos do mangá:", error);
    return [];
  }
};

const cleanAllMarks = async() => {
  try {
    await AsyncStorage.removeItem("marks");
    console.log("Todas as marcas foram limpas.");
  } catch (error) {
    console.error("Erro ao limpar todas as marcas:", error);
  }
};
export {
  addMarkToManga,
  removeMarkToManga,
  toggleMarkToManga,
  verifyMark,
  listMarksToManga
};
