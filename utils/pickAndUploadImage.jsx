import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE } from '../Firebase/config';

// Function to pick an image and get the download URL
export const pickAndUploadImage = async () => {
  try {
    // Pick image from library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      // throw new Error('Image picking was canceled');
    }

    // Get the URI of the picked image
    const uri = result.assets[0].uri;

    // Fetch the image as a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a reference to Firebase Storage
    const storageRef = ref(FIREBASE_STORAGE, `profilePics/${Date.now()}`);

    // Upload the image
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Return a promise that resolves with the download URL
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          } catch (error) {
            console.error("Failed to get download URL:", error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    // console.error("Error picking or uploading image:", error);
    throw error;
  }
};
