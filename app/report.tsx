import React, { createContext, useContext, useState } from 'react';

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
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      location: 'Building 12 - Restroom',
      description: 'Trash on floor, needs cleaning',
      status: 'Pending',
      date: '2024-10-27',
    },
  ]);

  const addReport = (report: Report) => {
    setReports(prev => [...prev, report]);
  };

  const updateReport = (id: string, updatedFields: Partial<Report>) => {
    setReports(prev =>
      prev.map(report =>
        report.id === id ? { ...report, ...updatedFields } : report
      )
    );
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