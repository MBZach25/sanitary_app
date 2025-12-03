import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export type UserRole = "person" | "cleaner";

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export const createUserProfile = async (
  uid: string,
  email: string,
  role: UserRole = "person"
): Promise<void> => {
  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    role,
    createdAt: new Date(),
  });
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((doc) => doc.data() as UserProfile);
};
