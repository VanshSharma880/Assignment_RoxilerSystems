import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useMonth } from "../MonthContext";

// Register the required Chart.js components 
ChartJS.register(ArcElement, Tooltip, Legend, Title);
const Piechart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedMonth } = useMonth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/transactions/pieChart?month=${selectedMonth}`
        );
        const pieData = response.data;
        setData(pieData);
        setLoading(false);
      } catch (err) {
        setError("Please select month from Home");
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  if (data.length === 0) {
    return <div className="text-center py-10">No data available for {selectedMonth}</div>;
  }

  // Prepare pie chart data
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        label: "Category Distribution",
        data: data.map((item) => item.itemCount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
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
        text: `Category Distribution for ${selectedMonth}`,
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded-lg p-6 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">Pie Chart - {selectedMonth}</h2>
        <div className="w-65 h-65">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Piechart;
