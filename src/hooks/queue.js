import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_KEY = "queue_items";

const addItemQueue = async(item) => {
  try {
    const queue = await listQueue();
    queue.push(item);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error("Error adding item to queue:", error);
  }
};

const removeItemQueue = async(id) => {
  try {
    let queue = await listQueue();
    queue = queue.filter(item => item.id !== id);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error("Error removing item from queue:", error);
  }
};

const saveOrderQueue = async(orderedQueue) => {
  try {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(orderedQueue));
  } catch (error) {
    console.error("Error saving order of queue:", error);
  }
};

const listQueue = async() => {
  try {
    const queue = await AsyncStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error("Error listing queue:", error);
    return [];
  }
};
const toggleQueue = async(item) => {
  try {
    let queue = await listQueue();
    const itemIndex = queue.findIndex(queueItem => queueItem.id === item.id);
    let status;
    if (itemIndex !== -1) {
      queue.splice(itemIndex, 1);
      status = false; // Item removed
    } else {
      queue.push(item);
      status = true; // Item added
    }
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return { success: true, status, message: "Queue toggled successfully" };
  } catch (error) {
    console.error("Error toggling item in queue:", error);
    return { success: false, message: "Error toggling item in queue" };
  }
};
export { addItemQueue, removeItemQueue, saveOrderQueue, listQueue, toggleQueue };
