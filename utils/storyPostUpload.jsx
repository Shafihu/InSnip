import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE } from "../Firebase/config";

export const storyPostUpload = async (uri) => {
  try {
    // Convert the URI to a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a reference to the storage location
    const storageRef = ref(FIREBASE_STORAGE, `storyPosts/${Date.now()}`);
    
    // Create an upload task
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Return a promise that resolves with the download URL on successful upload
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate and log the upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Handle upload failure
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            // Get the download URL on successful upload
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ url: downloadURL });
          } catch (error) {
            // Handle failure to get the download URL
            console.error("Failed to get download URL:", error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in storyPostUpload:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};
