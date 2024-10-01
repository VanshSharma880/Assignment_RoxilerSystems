import React, { createContext, useContext, useState, useEffect } from "react";

// Create the MonthContext
const MonthContext = createContext();

// Custom hook to use the MonthContext
export const useMonth = () => useContext(MonthContext);

export const MonthProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(
    () => localStorage.getItem("selectedMonth") || ""
  );

  // Update localStorage whenever selectedMonth changes
  useEffect(() => {
    if (selectedMonth) {
      localStorage.setItem("selectedMonth", selectedMonth);
    } else {
      localStorage.removeItem("selectedMonth");
    }
  }, [selectedMonth]);

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  );
};
