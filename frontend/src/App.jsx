import React from "react";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import StatisticT from "./components/StatisticT";
import Barchart from "./components/Barchart";
import Combined from "./components/Combined";
import Piechart from "./components/Piechart";
import { MonthProvider } from "./MonthContext";
const App = () => {
  return (
    <>
      <MonthProvider>
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Statistic" element={<StatisticT />} />
            <Route path="/Barchart" element={<Barchart />} />
            <Route path="/Piechart" element={<Piechart />} />
            <Route path="/Combined" element={<Combined />} />
          </Routes>
        </BrowserRouter>
      </MonthProvider>
    </>
  );
};

export default App;
