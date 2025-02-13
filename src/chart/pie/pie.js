import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import './pie.css';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const [data, setData] = useState([]);
    const [selectedType, setSelectedType] = useState('Temperature'); // Loại dữ liệu được chọn
    const [selectedMonth, setSelectedMonth] = useState('all'); // Tháng được chọn

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    useEffect(() => {
        // Fetch data từ PHP API
        fetch('https://huyed2.assfa.net/DoAn2.php')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const filterDataByMonth = (data, month) => {
        if (month === 'all') {
            return data;
        }
        return data.filter((entry) => {
            const entryMonth = new Date(entry.ThoiGian).getMonth() + 1; // JavaScript months are 0-indexed
            return entryMonth === parseInt(month);
        });
    };

    const filteredData = filterDataByMonth(data, selectedMonth);

    // Lấy giá trị của loại dữ liệu được chọn
    const selectedData = filteredData.map((entry) => entry[selectedType]);

    // Lấy ThoiGian làm nhãn cho các mẫu
    const labels = filteredData.map((entry) => entry.ThoiGian);

    return (
        <div className='Donut_container'>
            <div className='Donut_controls'>
                <span>Pie Chart</span>
                <div className='Donut_select'>
                    <label htmlFor='data-type'>Select Data Type: </label>
                    <select
                        id='data-type'
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value='Temperature'>Temperature</option>
                        <option value='Humidity'>Humidity</option>
                        <option value='Dust'>Dust</option>
                        <option value='AirPressure'>Air Pressure</option>
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
            </div>
            <div className='Donut_content'>
                <Pie
                    data={{
                        labels: labels, // Sử dụng ThoiGian làm nhãn
                        datasets: [
                            {
                                label: `${selectedType} Data`,
                                data: selectedData, // Giá trị của loại dữ liệu được chọn
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(199, 199, 199, 0.2)',
                                    'rgba(83, 102, 255, 0.2)',
                                    'rgba(255, 102, 102, 0.2)',
                                    'rgba(102, 255, 153, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(199, 199, 199, 1)',
                                    'rgba(83, 102, 255, 1)',
                                    'rgba(255, 102, 102, 1)',
                                    'rgba(102, 255, 153, 1)',
                                ],
                                borderWidth: 1,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: `Pie Chart`,
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default PieChart;
