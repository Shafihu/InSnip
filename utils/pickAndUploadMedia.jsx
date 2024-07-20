import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE } from "../Firebase/config";

export const pickAndUploadMedia = async (
  setUploadProgress,
  setLocalMediaUri
) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const uri = result.assets[0].uri;
    const type = result.assets[0].type;

    setLocalMediaUri(uri);

    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(FIREBASE_STORAGE, `chatMedia/${Date.now()}`);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadProgress(100);
            resolve({ url: downloadURL, type });
          } catch (error) {
            console.error("Failed to get download URL:", error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};
