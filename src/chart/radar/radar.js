import { Chart as ChartJS, CategoryScale, Filler, LinearScale, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import './radar.css';
import { Radar as RadarChart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, Filler, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend);

const Radar = () => {
    const [data, setData] = useState([]);
    const [selectedType, setSelectedType] = useState('Temperature'); // Loại dữ liệu được chọn
    const [sampleCount, setSampleCount] = useState(10); // Số mẫu được chọn
    const [selectedMonth, setSelectedMonth] = useState('01'); // Tháng được chọn

    useEffect(() => {
        // Fetch data từ API
        fetch('https://huyed2.assfa.net/DoAn2.php')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Lọc dữ liệu theo tháng được chọn
    const filteredData = data.filter((entry) => {
        const entryMonth = entry.ThoiGian.split('-')[1]; // Giả sử ThoiGian có định dạng YYYY-MM-DD
        return entryMonth === selectedMonth;
    });

    // Lấy số mẫu gần nhất theo sampleCount
    const latestData = filteredData.slice(-sampleCount);

    // Lấy ThoiGian làm nhãn cho các mẫu
    const labels = latestData.map((entry) => entry.ThoiGian);

    // Cấu hình dataset cho từng loại dữ liệu
    const datasetsConfig = {
        Temperature: {
            label: 'Temperature',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: true,
        },
        Humidity: {
            label: 'Humidity',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: true,
        },
        Dust: {
            label: 'Dust',
            backgroundColor: 'rgba(128, 128, 128, 0.2)',
            borderColor: 'rgba(128, 128, 128, 1)',
            borderWidth: 1,
            fill: true,
        },
        AirPressure: {
            label: 'Air Pressure',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            fill: true,
        },
    };

    // Tạo datasets theo loại được chọn
    const datasets =
        selectedType === 'All'
            ? Object.keys(datasetsConfig).map((type) => ({
                  ...datasetsConfig[type],
                  data: latestData.map((entry) => entry[type]),
              }))
            : [
                  {
                      ...datasetsConfig[selectedType],
                      data: latestData.map((entry) => entry[selectedType]),
                  },
              ];

    return (
        <div className="Radar_container">
            <div className="Radar_controls">
                <span>Radar Chart</span>
                <div className="Radar_select">
                    <label htmlFor="data-type">Type: </label>
                    <select
                        id="data-type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Temperature">Temperature</option>
                        <option value="Humidity">Humidity</option>
                        <option value="Dust">Dust</option>
                        <option value="AirPressure">Air Pressure</option>
                    </select>

                    <label htmlFor="sample-count">Enter Number of Samples: </label>
                    <input
                        id="sample-count"
                        type="number"
                        value={sampleCount}
                        onChange={(e) => setSampleCount(Number(e.target.value))}
                        min="1"
                        style={{
                            width: '50px',
                            height: '15px',
                            fontSize: '14px',
                            border: '2px solid #007BFF', // Đường viền màu xanh lam
                            borderRadius: '5px',         // Bo góc viền
                            padding: '5px'               // Khoảng cách bên trong
                        }}
                    />


                    <label htmlFor="month-select">Select Month: </label>
                    <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, '0');
                            return (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className="Radar_content">
                <RadarChart
                    data={{
                        labels: labels, // Sử dụng nhãn từ ThoiGian
                        datasets: datasets, // Hiển thị dữ liệu theo loại được chọn
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: `Radar Chart - ${selectedType}`,
                            },
                        },
                        scales: {
                            r: {
                                ticks: {
                                    font: {
                                        size: 12, // Kích thước chữ của các giá trị trên trục
                                    },
                                },
                                pointLabels: {
                                    font: {
                                        size: 7, // Kích thước chữ của nhãn (ThoiGian)
                                    },
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default Radar;
