import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const storyPostUpload = async (fileUri, userId) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const type = blob.data.type;
    
    const fileRef = ref(storage, `stories/${Date.now()}`);
    const metadata = {
      customMetadata: {
        userId: userId,
        type: type,
      },
    };

    await uploadBytes(fileRef, blob, metadata);

    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
