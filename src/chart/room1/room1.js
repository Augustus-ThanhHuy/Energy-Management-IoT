import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import './room1.css';
import CardEnergy from '../../sensor/CardEnergy/Card';
import CardHumidity from '../../sensor/CardHumidity/Card';
import CardTemperature from '../../sensor/CardTemperature/Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Room1 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://huyed2.assfa.net/DoAn2.php') 
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  const filterByDate = (data, limit = 6) => {
  return data.slice(-limit); // Lấy `limit` phần tử cuối cùng
};

  const filteredData = filterByDate(data, 6);

  
  return (
    <div className='Room_container'>
      <div className='sensor__content'>
        Sensor
      </div>
      <div className='sensor__card'>
          <CardHumidity humidity={22} />
          <CardTemperature temperature={12} />
          <CardEnergy energy={22} />
      </div>
      <div className='Chart_content'>
      <div className='Bar_content'>
        <Bar
          data={{
            labels: filteredData.map((entry) => entry.ThoiGian),
            datasets: [
              {
                label: 'Temperature',
                data: data.map((entry) => entry.Temperature),
                backgroundColor: 'rgba(255, 99, 132, 0.7)', 
                borderColor: 'rgba(255, 99, 132, 1)',       
                borderWidth: 1,                             
                borderRadius: 5,
              },
              {
                label: 'Humidity',
                data: data.map((entry) => entry.Humidity),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 5,
              },
              {
                label: 'Dust',
                data: data.map((entry) => entry.Dust),
                backgroundColor: 'rgba(54, 11, 235, 0.7)',
                borderColor: 'rgba(54, 11, 235, 1)',
                borderWidth: 1,
                borderRadius: 5,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'category',
                ticks: {
                  font: {
                    size: 7,
                    weight: 'bold',     
                  },
                  color: '#333',      
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  font: {
                    size: 14,
                    weight: 'bold',     
                  },
                  color: '#333',       
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 16,
                    weight: 'bold',     
                  },
                  color: '#222',        
                },
              },
            },
          }}
          with={700}
          height ={500}
        />
      </div>
      <div className='Line_content'>
              <Line
                data={{
                  labels: filteredData.map((entry) => entry.ThoiGian), // Ensure this is in the correct format
                  datasets: [
                    {
                      label: "Temperature",
                      data: data.map((entry) => entry.Temperature),
                      backgroundColor: 'rgba(255, 99, 132, 0.7)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      fill: false,
                      tension: 0.1,
                    },
                    {
                      label: "Humidity",
                      data: data.map((entry) => entry.Humidity),
                      backgroundColor: 'rgba(54, 162, 235, 0.7)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      fill: false,
                      tension: 0.1,
                    },
                    {
                      label: "Dust",
                      data: data.map((entry) => entry.Dust),
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
    </div>
  );
};

export default Room1;
