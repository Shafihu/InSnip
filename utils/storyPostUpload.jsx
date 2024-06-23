import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_STORAGE } from '../Firebase/config';

const storage = getStorage();

export const storyPostUpload = async (fileUri, userId, setUploadProgress, sRef) => {
  try {
    if(sRef === 'spotlight') {
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

    const response = await fetch(uri);
    const blob = await response.blob();

    const fileRef = ref(storage, `${sRef}/${Date.now()}`);
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
    } 
    else {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const type = blob.type;
      
      const fileRef = ref(storage, `${sRef}/${Date.now()}`);
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
    }

  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
