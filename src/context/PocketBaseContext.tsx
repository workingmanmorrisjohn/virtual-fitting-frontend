// src/context/PocketBaseContext.tsx
import React, { createContext, useContext } from 'react';
import PocketBase from 'pocketbase';
import { BASE_URL } from '../constants/BaseUrl';

// Initialize the singleton instance
const pb = new PocketBase(BASE_URL);
pb.autoCancellation(false);

// Create a Context for PocketBase
const PocketBaseContext = createContext<PocketBase | null>(null);

// Context Provider Component
export const PocketBaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PocketBaseContext.Provider value={pb}>{children}</PocketBaseContext.Provider>;
};

// Hook to use PocketBase instance
export const usePocketBase = () => {
  const context = useContext(PocketBaseContext);
  if (!context) {
    throw new Error('usePocketBase must be used within a PocketBaseProvider');
  }
  return context;
};
