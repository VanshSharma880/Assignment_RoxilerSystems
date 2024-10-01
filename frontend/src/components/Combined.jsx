import React from 'react';
import Piechart from './Piechart';
import Barchart from "./Barchart";
import StatisticT from "./StatisticT";
const Combined = () => {
  
  return (
    <div>
      <StatisticT/>
      <Barchart/>
      <Piechart/>
    </div>
  );
};

export default Combined;
