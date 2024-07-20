import { ref, listAll, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE } from "../Firebase/config";

export const listFiles = async (directory) => {
  const listRef = ref(FIREBASE_STORAGE, directory);
  try {
    const res = await listAll(listRef);
    const urls = await Promise.all(
      res.items.map((itemRef) => getDownloadURL(itemRef))
    );
    return urls;
  } catch (error) {
    console.error("Failed to list files:", error);
    throw error;
  }
};
