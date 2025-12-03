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
import { db } from "../../firebase/firebaseConfig";

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
  addReport: (report: Omit<Report, "id">) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
};

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  // ✅ Load all reports from Firestore (no user filter)
  useEffect(() => {
    const q = query(collection(db, "reports"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReports(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Report[]
      );
    });

    return () => unsubscribe();
  }, []);

  // ✅ Add report (no userId)
  const addReport = async (report: Omit<Report, "id">) => {
    await addDoc(collection(db, "reports"), report);
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    const ref = doc(db, "reports", id);
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true);
    }

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
