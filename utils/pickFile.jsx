import * as DocumentPicker from "expo-document-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE } from "../Firebase/config";

export const pickAndUploadFile = async (
  setUploadProgress,
  setLocalFileUri,
  userId,
  setFileName
) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    });

    if (result.canceled) {
      console.log("Document picking was canceled");
      return;
    }

    const fileUri = result.assets[0].uri;
    const fileName = result.assets[0].name;
    setFileName(fileName);

    setLocalFileUri(fileUri);

    const response = await fetch(fileUri);
    const blob = await response.blob();

    const type = blob.type;

    const storageRef = ref(FIREBASE_STORAGE, `chatMedia/${fileName}`);
    const metadata = {
      customMetadata: {
        userId: userId,
        fileName: fileName,
        type: type,
      },
    };

    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (setUploadProgress) {
            setUploadProgress(progress);
          }
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            if (setUploadProgress) {
              setUploadProgress(100);
            }
            console.log("File available at", downloadURL);
            resolve({ url: downloadURL, type });
          } catch (error) {
            console.error("Failed to get download URL:", error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};
