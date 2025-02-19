import imageCompression from "browser-image-compression";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase";

const storage = getStorage(app);

export async function upload(file) {
  try {
    let optimizedFile = file;

    // Handle Blob URLs (from removeBg)
    if (typeof file === "string" && file.startsWith("blob:")) {
      console.log("Handling Blob URL...");
      const response = await fetch(file);
      const blob = await response.blob();
      optimizedFile = new File([blob], "image.png", { type: "image/png" });
    }

    // Compress only if it's a normal file
    if (optimizedFile instanceof File) {
      console.log("Compressing file...");
      optimizedFile = await compress(optimizedFile);
    }

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary...");
    const cloudinaryUrl = await uploadToCloudinary(optimizedFile);
    console.log("Uploaded to Cloudinary:", cloudinaryUrl);

    // Upload to Firebase Storage
    console.log("Uploading to Firebase...");
    const firebaseUrl = await uploadToFirebase(optimizedFile);
    console.log("Uploaded to Firebase:", firebaseUrl);

    return {
      cloudinaryUrl,
      firebaseUrl,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

async function uploadToCloudinary(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "drezzup-store");
  data.append("cloud_name", "dp563neb6");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dp563neb6/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );
  const result = await res.json();
  return result.secure_url;
}

async function uploadToFirebase(file) {
  const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

async function compress(file) {
  const options = {
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
}
