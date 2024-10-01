import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMonth } from "../MonthContext";

const StatisticT = () => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  const { selectedMonth } = useMonth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistic = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/transactions/statistics?month=${selectedMonth}`
          );
          const data = response.data;
          setStatistics({
            totalSaleAmount: data.totalSaleAmount,
            totalSoldItems: data.totalSoldItems,
            totalNotSoldItems: data.totalNotSoldItems,
          });
          setLoading(false);
        } catch (err) {
          setError("Please select month from Home");
          setLoading(false);
        }
      }

    fetchStatistic();
  }, [selectedMonth]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-2xl font-bold text-gray-800 mb-4">
        Statistics - {selectedMonth}
      </div>
      <div className="bg-yellow-300 p-6 rounded-lg shadow-lg w-full max-w-xs">
        <div className="text-lg font-semibold text-gray-700 mb-2 flex justify-between">
          <span>Total sale</span>
          <span>{statistics.totalSaleAmount}</span>
        </div>
        <div className="text-lg font-semibold text-gray-700 mb-2 flex justify-between">
          <span>Total sold items</span>
          <span>{statistics.totalSoldItems}</span>
        </div>
        <div className="text-lg font-semibold text-gray-700 flex justify-between">
          <span>Total not sold items</span>
          <span>{statistics.totalNotSoldItems}</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticT;
