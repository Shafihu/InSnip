import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const storyPostUpload = async (fileUri, userId, setUploadProgress) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const type = blob.type; // Fixed to use `blob.type` instead of `blob.data.type`
    
    const fileRef = ref(storage, `stories/${Date.now()}`);
    const metadata = {
      customMetadata: {
        userId: userId,
        type: type,
      },
    };

    // Create the upload task
    const uploadTask = uploadBytesResumable(fileRef, blob, metadata);

    // Return a promise that resolves with the download URL once the upload completes
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error during upload:", error);
          reject(null);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(null);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
