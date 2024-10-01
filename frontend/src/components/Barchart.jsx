import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMonth } from "../MonthContext";

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedMonth } = useMonth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/transactions/barChart?month=${selectedMonth}`
        );
        const barData = response.data;
        setData(barData);
        setLoading(false);
      } catch (err) {
        setError("Please select month from Home");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Prepare chart data
  const chartData = {
    labels: data.map((item) => item.priceRange),
    datasets: [
      {
        label: "Items Count",
        data: data.map((item) => item.itemCount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Item Count for ${selectedMonth}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-xl font-bold mb-6">Bar Chart - {selectedMonth}</h2>
      <div className="w-4/5">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BarChart;
