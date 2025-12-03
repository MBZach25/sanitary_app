import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";

const auth = getAuth();

export type Report = {
  id: string;
  location: string;
  description: string;
  status: string;
  date: string;
};

type ReportsContextType = {
  reports: Report[];
  addReport: (report: Report) => void;
  updateReport: (id: string, updatedFields: Partial<Report>) => void;
};

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const q = query(collection(db, "reports"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData: Report[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
      setReports(reportsData);
    });

    return () => unsubscribe();
  }, []);

  const addReport = async (report: Omit<Report, "id">) => {
    await addDoc(collection(db, "reports"), report);
  };

  const updateReport = async (id: string, updatedFields: Partial<Report>) => {
    if (!auth.currentUser) throw new Error("User not authenticated");

    // Refresh token to ensure custom claims (userRole) are applied
    await auth.currentUser.getIdToken(true);

    const ref = doc(db, "reports", id);
    await updateDoc(ref, updatedFields);
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport, updateReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used inside ReportsProvider");
  }
  return context;
}
