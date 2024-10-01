import React, { useState, useEffect } from "react";
import { Table, Input, Button, Select } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import TStatistic from "../assets/TStatistic.jpg";
import PieChart from "../assets/PieChart.jpg";
import BarGraph from "../assets/BarGraph.jpg";
import AllCombined from "../assets/AllCombined.jpg";
import { useMonth } from "../MonthContext";

const { Column } = Table;
const { Search } = Input;
const { Option } = Select;

const Home = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedMonth, setSelectedMonth } = useMonth();

  // Fetch Data from Backend
  const fetchData = (term = "", month = "") => {
    let query = `${import.meta.env.VITE_API_URL}/transactionsView?search=${term}`;
    if (month) {
      query += `&month=${month}`;
    }
    axios
      .get(query)
      .then((response) => {
        console.log(response.data);
        setData(response.data.transactions || []); // Ensure transactions array exists
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchData(value, selectedMonth); // Fetch data based on search term and selected month
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    fetchData(searchTerm, month); // Fetch data based on search term and selected month
  };

  useEffect(() => {
    fetchData(); // Fetch all data initially
  }, []);

  return (
    <>
      <div className="relative inline-block m-2">
        <Link to="/">
          <span className="text-2xl md:text-3xl font-bold hover:cursor-pointer">
            Transaction Dashboard
          </span>
        </Link>
        <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-600 rounded-full"></span>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <Search
          placeholder="Search transactions"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
        />
      </div>

      {/* Month Filter */}
      <div style={{ marginBottom: "20px" }}>
        <Select
          placeholder="Select a month"
          style={{ width: 200 }}
          value={selectedMonth || undefined} // If there's no selected month, show placeholder
          onChange={handleMonthChange}
          allowClear
          onClear={() => setSelectedMonth("")} // Clear the month from local storage
        >
          {moment.months().map((month) => (
            <Option key={month} value={month}>
              {month}
            </Option>
          ))}
        </Select>
      </div>

      <Table dataSource={data} rowKey="_id">
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Price" dataIndex="price" key="price" />
        <Column title="Category" dataIndex="category" key="category" />
        <Column
          title="Sold"
          dataIndex="sold"
          key="sold"
          render={(text) =>
            text ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )
          }
        />
        <Column
          title="Image"
          dataIndex="image"
          key="image"
          render={(text) => (
            <img
              src={text}
              alt="Product"
              style={{ width: 100, height: "auto" }}
            />
          )}
        />
        <Column
          title="Date"
          dataIndex="dateOfSale"
          key="dateOfSale"
          render={(dateOfSale) => moment(dateOfSale).format("MM/DD/YYYY")}
        />
      </Table>

      {/* Charts Section */}
      <div className="p-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
            View <span className="text-indigo-600">Charts</span> of <span className="text-indigo-600">Selected</span> {selectedMonth}
          </h3>
        </div>

        <div className="sm:grid grid-cols-2 md:grid-cols-4 col-gap-10 mx-auto">
          <div className="text-center">
            <a href="/Statistic">
              <img
                className="mb-3 rounded-xl mx-auto h-32 w-32"
                src={TStatistic}
              />
            </a>
            <a
              href="/Statistic"
              className="hover:text-indigo-500 text-gray-900 font-semibold"
            >
              Transactions Statistic
            </a>
            <p className="text-gray-500 uppercase text-sm">{selectedMonth}</p>
          </div>
          <div className="text-center">
            <a href="/Barchart">
              <img
                className="mb-3 rounded-xl mx-auto h-32 w-32"
                src={BarGraph}
              />
            </a>
            <a
              href="/Barchart"
              className="hover:text-indigo-500 text-gray-900 font-semibold"
            >
              Transactions BarChart
            </a>
            <p className="text-gray-500 uppercase text-sm">{selectedMonth}</p>
          </div>
          <div className="text-center">
            <a href="/Piechart">
              <img
                className="mb-3 rounded-xl mx-auto h-32 w-32"
                src={PieChart}
              />
            </a>
            <a
              href="/Piechart"
              className="hover:text-indigo-500 text-gray-900 font-semibold"
            >
              Transactions PieChart
            </a>
            <p className="text-gray-500 uppercase text-sm">{selectedMonth}</p>
          </div>
          <div className="text-center">
            <a href="/Combined">
              <img
                className="mb-3 rounded-xl mx-auto h-32 w-32"
                src={AllCombined}
              />
            </a>
            <a
              href="/Combined"
              className="hover:text-indigo-500 text-gray-900 font-semibold"
            >
              Combined All Charts
            </a>
            <p className="text-gray-500 uppercase text-sm">{selectedMonth}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
