import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";

export async function uploadIssueImage(uri, userId, description) {
  // Convert URI to blob
  const blob = await fetch(uri).then(res => res.blob());
  
  const imageRef = ref(storage, `issues/${Date.now()}.jpg`);
  await uploadBytes(imageRef, blob);

  const downloadURL = await getDownloadURL(imageRef);

  // Save metadata to Firestore
  await addDoc(collection(db, "issues"), {
    userId,
    description,
    imageUrl: downloadURL,
    resolved: false,
    createdAt: serverTimestamp(),
  });
}