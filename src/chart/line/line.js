import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import './line.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [data, setData] = useState([]);
  const [numLabels, setNumLabels] = useState('all'); // Start with 'all' as string
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const handleLabelChange = (event) => {
    setNumLabels(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleDateChange = (event) => {
    const selectedDay = event.target.value;
    if (selectedDay >= 1 && selectedDay <= 31) {
      setSelectedDate(selectedDay); // Store day only
    }
  };

  useEffect(() => {
    fetch('https://huyed2.assfa.net/DoAn2.php')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const getLatestData = (data, num) => {
    if (num === 'all') {
      return data;
    }
    return data.slice(-num); // Get the last 'num' elements
  };

  const filterDataByMonth = (data, month) => {
    if (month === 'all') {
      return data;
    }
    return data.filter((entry) => {
      const entryMonth = new Date(entry.ThoiGian).getMonth() + 1; // JavaScript months are 0-indexed
      return entryMonth === parseInt(month);
    });
  };

  const filterDataByDate = (data, date) => {
    if (!date) return data;
    return data.filter((entry) => {
      const entryDate = new Date(entry.ThoiGian).getDate();
      return entryDate === parseInt(date);
    });
  };

  const latestData = getLatestData(data, numLabels);
  const filteredByMonth = filterDataByMonth(latestData, selectedMonth);
  const filteredData = filterDataByDate(filteredByMonth, selectedDate);

  return (
    <div className='Line_container'>
      <div className='Name_line'>
        <span>Line chart</span>
        <div className='label-selection'>
          <label htmlFor="numLabels">Choose data: </label>
          <select id="numLabels" value={numLabels} onChange={handleLabelChange}>
            <option value="all">All</option>
            <option value="10">10 labels</option>
            <option value="20">20 labels</option>
            <option value="30">30 labels</option>
            <option value="40">40 labels</option>
          </select>
        </div>
        <div className='month-selection'>
          <label htmlFor="month">Select Month: </label>
          <select id="month" value={selectedMonth} onChange={handleMonthChange}>
            <option value="all">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div className='date-selection'>
          <label htmlFor="date">Select Date: </label>
          <input
            type="number"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            min="1"
            max="31"
            placeholder="Enter day (1-31)"
            style={{
                            width: '50px',
                            height: '15px',
                            fontSize: '14px',
                            border: '2px solid #007BFF', // Đường viền màu xanh lam
                            borderRadius: '5px',         // Bo góc viền
                            padding: '5px'               // Khoảng cách bên trong
                        }}
          />
        </div>
      </div>
      <div className='Line_content'>
        <Line
          data={{
            labels: filteredData.map((entry) => entry.ThoiGian), // Ensure this is in the correct format
            datasets: [
              {
                label: "Temperature",
                data: filteredData.map((entry) => entry.Temperature),
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
                tension: 0.1,
              },
              {
                label: "Humidity",
                data: filteredData.map((entry) => entry.Humidity),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
                tension: 0.1,
              },
              {
                label: "Dust",
                data: filteredData.map((entry) => entry.Dust),
                backgroundColor: 'rgba(54, 11, 235, 0.7)',
                borderColor: 'rgba(54, 11, 235, 1)',
                fill: false,
                tension: 0.1,
              },
            ],
          }}
          options={{
            scales: {
              x: {
                type: 'category',
                ticks: {
                  font: {
                    size: 10,
                    weight: 'bold',
                  },
                  color: '#333',
                },
              },
            },
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              title: {
                display: true,
                text: 'Line Chart',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default LineChart;
