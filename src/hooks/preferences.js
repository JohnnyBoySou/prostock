import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

async function getPreferences() {
  try {
    const preferences = JSON.parse(await AsyncStorage.getItem("@settings")) || [];
    return preferences;
  } catch (error) {
    console.error("Error getting preferences:", error);
    return [];
  }
}

async function createPreferences(preferences) {
  try {
    await AsyncStorage.setItem("@settings", JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error("Error creating preference:", error);
    return false;
  }
}

async function editPreferences(updatedPreferences) {
  try {
    const preferences = { ...getPreferences(), ...updatedPreferences };
    await AsyncStorage.setItem("@settings", JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error("Error editing preferences:", error);
    return false;
  }
}

async function excludePreferences() {
  try {
    await AsyncStorage.removeItem("@settings");
    return true;
  } catch (error) {
    console.error("Error excluding preference ", error);
    return false;
  }
}

async function addLike(array) {
  try {
    const preferences = await getPreferences();
    if (!preferences.likes) {
      preferences.likes = [];
    }
    preferences.likes = preferences.likes.concat(array);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error adding likes array:", error);
    return false;
  }
}

async function verifyLiked(id) {
  try {
    const preferences = await getPreferences();
    console.log(preferences.likes && preferences.likes.some((manga) => manga.id === id));
    return preferences.likes && preferences.likes.some((manga) => manga.id === id);
  } catch (error) {
    console.error("Error verifying liked manga:", error);
    return false;
  }
}

async function removeLike(id) {
  try {
    const preferences = await getPreferences();
    if (!preferences.likes) {
      preferences.likes = [];
    }
    preferences.likes = preferences.likes.filter((manga) => manga.id !== id);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error removing like:", error);
    return false;
  }
}

async function addComplete(manga) {
  try {
    const preferences = await getPreferences();
    if (!preferences.complete) {
      preferences.complete = [];
    }
    preferences.complete.push(manga);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error adding complete manga:", error);
    return false;
  }
}

async function verifyComplete(id) {
  try {
    const preferences = await getPreferences();
    return preferences.complete && preferences.complete.some((manga) => manga.id === id);
  } catch (error) {
    console.error("Error verifying complete manga:", error);
    return false;
  }
}

async function removeComplete(id) {
  try {
    const preferences = await getPreferences();
    if (!preferences.complete) {
      preferences.complete = [];
    }
    preferences.complete = preferences.complete.filter((manga) => manga.id !== id);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error removing complete manga:", error);
    return false;
  }
}

async function addFollow(manga) {
  try {
    const preferences = await getPreferences();
    if (!preferences.follow) {
      preferences.follow = [];
    }
    preferences.follow.push(manga);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error adding follow manga:", error);
    return false;
  }
}

async function verifyFollow(id) {
  try {
    const preferences = await getPreferences();
    return preferences.follow && preferences.follow.some((manga) => manga.id === id);
  } catch (error) {
    console.error("Error verifying follow manga:", error);
    return false;
  }
}

async function removeFollow(id) {
  try {
    const preferences = await getPreferences();
    if (!preferences.follow) {
      preferences.follow = [];
    }
    preferences.follow = preferences.follow.filter((manga) => manga.id !== id);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error removing follow manga:", error);
    return false;
  }
}

async function getBgs() {
  try {
    const ga = await axios.get("https://s2mangasweb.vercel.app/api/shop/avatar");
    const gc = await axios.get("https://s2mangasweb.vercel.app/api/shop/capa");
    return { geral: ga.data[4].geral, geralbg: gc.data[3].geralbg };
  } catch (error) {
    console.log(error);
  }
}

export {
  createPreferences,
  getPreferences,
  editPreferences,
  excludePreferences,

  addLike,
  removeLike,
  verifyLiked,

  addComplete,
  removeComplete,
  verifyComplete,

  addFollow,
  removeFollow,
  verifyFollow,
  getBgs
};
