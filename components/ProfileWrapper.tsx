"use client";

import { StudentOverviewTemplate } from "@/app/student/types";
import React, { createContext, useContext } from "react";

type ProfileContextType = StudentOverviewTemplate; // you can replace `any` with a proper type

const ProfileContext = createContext<ProfileContextType | null>(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

export const ProfileProvider = ({
  value,
  children,
}: {
  value: ProfileContextType;
  children: React.ReactNode;
}) => {
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
