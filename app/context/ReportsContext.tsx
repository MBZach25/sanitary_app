import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";

const auth = getAuth();

export type Report = {
  id: string;
  studentId: string; // new field
  location: string;
  description: string;
  status: string;
  date: string;
};

type ReportsContextType = {
  reports: Report[];
  addReport: (report: Omit<Report, "id" | "studentId">) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
};

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "reports"),
      where("studentId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReports(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Report, "id">),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const addReport = async (report: Omit<Report, "id" | "studentId">) => {
    if (!auth.currentUser) return;

    await addDoc(collection(db, "reports"), {
      ...report,
      studentId: auth.currentUser.uid, 
    });
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    const ref = doc(db, "reports", id);
    await updateDoc(ref, updates);
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
