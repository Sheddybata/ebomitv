"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { TVProgram } from "@/lib/types";
import { PreRecordedContent } from "@/lib/types";
import { GALLERY_VIDEOS } from "@/lib/gallery-data";

interface ProgramContextType {
  selectedProgram: TVProgram | null;
  setSelectedProgram: (program: TVProgram | null) => void;
  playProgram: (program: TVProgram) => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [selectedProgram, setSelectedProgram] = useState<TVProgram | null>(null);

  const playProgram = (program: TVProgram) => {
    setSelectedProgram(program);
  };

  return (
    <ProgramContext.Provider
      value={{
        selectedProgram,
        setSelectedProgram,
        playProgram,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
}

export function useProgram() {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
}
