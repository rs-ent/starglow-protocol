"use client"; 
import React, { createContext } from "react";

export const DataContext = createContext(null);

export function DataProvider({ children, value }) {
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}