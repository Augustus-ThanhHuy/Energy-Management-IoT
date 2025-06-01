import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import React, { useEffect, useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import './room1.css';
import CardEnergy from '../../sensor/CardEnergy/Card';
import CardHumidity from '../../sensor/CardHumidity/Card';
import CardTemperature from '../../sensor/CardTemperature/Card';
import CardCurrent from '../../sensor/CardCurrent/Card';
import CardVoltage from '../../sensor/CardVoltage/Card';
import DateDifferenceCalculator from '../component/DateDifferenceCalculator';
import DoughnutChart from './DoughnutChart';
import BarChart from './BarChart';
import CardPower from '../../sensor/CardPower/Card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Room1 = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariable, setSelectedVariable] = useState('Temperature');

  const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) {
          throw new Error(`Phản hồi mạng không ổn: ${response.status}`);
        }
        return await response.text();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  useEffect(() => {
  const fetchData = () => {
    fetchWithRetry('http://raspberrypi.local/api/getData.php')
      .then(textData => {
        console.log('Phản hồi API thô:', textData);
        const jsonStr = textData.replace(/^Kết nối thành công!/, '').trim();
        try {
          const jsonData = JSON.parse(jsonStr);
          if (Array.isArray(jsonData)) {
            setData(jsonData);
          } else {
            throw new Error('Định dạng JSON không hợp lệ');
          }
        } catch (error) {
          throw new Error('Lỗi phân tích JSON: ' + error.message);
        }
      })
      .catch(error => setError(error.message))
      .finally(() => setIsLoading(false));
  };

  fetchData(); // gọi ngay lần đầu tiên

  const interval = setInterval(fetchData, 2000); // gọi lại mỗi 5 giây

  return () => clearInterval(interval); // xóa timer khi component bị unmount
}, []);


  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => {
      const itemDate = new Date(item.TimeUpdate);
      return (!startDate || itemDate >= new Date(startDate)) &&
             (!endDate || itemDate <= new Date(endDate));
    });
  }, [data, startDate, endDate]);

  // / Lọc dữ liệu theo ngày hiện tại (tùy chọn, nếu bạn muốn tính min/max/avg trong ngày)
  const getDailyReadings = (data) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    return data.filter(item => {
      const itemDate = new Date(item.TimeUpdate);
      return itemDate >= startOfDay && itemDate <= endOfDay;
    });
  };

  // Chuẩn bị dailyReadings từ filteredData
  const dailyReadings = getDailyReadings(filteredData);
  const allDatasets = [
    {
      label: 'Nhiệt độ (°C)',
      data: filteredData.map(entry => parseFloat(entry.Temperature || 0)),
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: 'rgba(239, 68, 68, 1)',
      fill: false,
      tension: 0.3,
      cubicInterpolationMode: 'catmullRom',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      variable: 'Temperature',
      yAxisTitle: 'Nhiệt độ (°C)',
    },
    {
      label: 'Độ ẩm (%)',
      data: filteredData.map(entry => parseFloat(entry.Humidity || 0)),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      fill: false,
      tension: 0.3,
      cubicInterpolationMode: 'catmullRom',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      variable: 'Humidity',
      yAxisTitle: 'Độ ẩm (%)',
    },
    {
      label: 'Năng lượng (kWh)',
      data: filteredData.map(entry => parseFloat(entry.Energy || 0)),
      backgroundColor: 'rgba(234, 179, 8, 0.2)',
      borderColor: 'rgba(234, 179, 8, 1)',
      fill: false,
      tension: 0.3,
      cubicInterpolationMode: 'catmullRom',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      variable: 'Energy',
      yAxisTitle: 'Năng lượng (kWh)',
    },
    {
      label: 'Dòng điện (A)',
      data: filteredData.map(entry => parseFloat(entry.Current || 0)),
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgba(34, 197, 94, 1)',
      fill: false,
      tension: 0.3,
      cubicInterpolationMode: 'catmullRom',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      variable: 'Current',
      yAxisTitle: 'Dòng điện (A)',
    },
    {
      label: 'Điện áp (V)',
      data: filteredData.map(entry => parseFloat(entry.Voltage || 0)),
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgba(147, 51, 234, 1)',
      fill: false,
      tension: 0.3,
      cubicInterpolationMode: 'catmullRom',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      variable: 'Voltage',
      yAxisTitle: 'Điện áp (V)',
    },
    {
      label: 'Công suất (W)',
      data: filteredData.map(entry => parseFloat(entry.Power || 0)),
      backgroundColor: 'rgba(249, 115, 22, 0.2)',
      borderColor: 'rgba(249, 115, 22, 1)',
      fill: false,
      tension: 0.3,
      cubicInterpolationMode: 'catmullRom',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      variable: 'Power',
      yAxisTitle: 'Công suất (W)',
    },
  ];

  const selectedDataset = allDatasets.find(dataset => dataset.variable === selectedVariable);

  if (isLoading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  return (
    <div className="Room_container">
      <div className="sensor__content fade-in-section">
        <ul>
          <DateDifferenceCalculator
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </ul>
        <div className="variable-selector">
          <label htmlFor="variable-select">Chọn thông số hiển thị: </label>
          <select
            id="variable-select"
            value={selectedVariable}
            onChange={(e) => setSelectedVariable(e.target.value)}
          >
            {allDatasets.map(dataset => (
              <option key={dataset.variable} value={dataset.variable}>
                {dataset.label}
              </option>
            ))}
          </select>
        </div>

        <div className="Line_container">
          <div className="Line_content">
            {filteredData.length > 0 ? (
              <Line
                data={{
                  labels: filteredData.map(entry => entry.TimeUpdate),
                  datasets: [selectedDataset],
                }}
                options={{
                  scales: {
                    x: {
                      ticks: {
                        font: { size: 12, weight: '500' },
                        color: '#4b5563',
                        maxRotation: 45,
                        minRotation: 45,
                      },
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      ticks: {
                        font: { size: 12, weight: '500' },
                        color: '#4b5563',
                        padding: 8,
                      },
                      grid: {
                        color: '#e5e7eb',
                        borderDash: [5, 5],
                      },
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: selectedDataset.yAxisTitle,
                        font: { size: 14, weight: 'bold' },
                        color: '#1f2937',
                      },
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        font: { size: 14, weight: '600' },
                        color: '#1f2937',
                        padding: 15,
                        boxWidth: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                      },
                    },
                    title: {
                      display: true,
                      text: `Biểu đồ đường - ${selectedDataset.label}`,
                      font: { size: 16, weight: 'bold' },
                      color: '#1f2937',
                      padding: { top: 10, bottom: 20 },
                    },
                    tooltip: {
                      enabled: true,
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleFont: { size: 14, weight: 'bold' },
                      bodyFont: { size: 12 },
                      padding: 10,
                      cornerRadius: 6,
                      displayColors: true,
                      callbacks: {
                        label: (context) => {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          label += context.parsed.y;
                          return label;
                        },
                      },
                    },
                    datalabels: { display: false },
                  },
                  interaction: {
                    mode: 'nearest',
                    intersect: false,
                    axis: 'x',
                  },
                  hover: {
                    mode: 'nearest',
                    intersect: false,
                  },
                }}
              />
            ) : (
              <div>Không có dữ liệu để hiển thị</div>
            )}
          </div>
          <div className="sensor__card">
            {filteredData.length > 0 && (
              <>
                <CardHumidity humidity={filteredData[filteredData.length - 1].Humidity} dailyReadings={dailyReadings}/>
                <CardTemperature temperature={filteredData[filteredData.length - 1].Temperature} dailyReadings={dailyReadings}/>
                <CardEnergy energy={filteredData[filteredData.length - 1].Energy} dailyReadings={dailyReadings}/>
              </>
            )}
          </div>
          <div className="sensor__card">
            {filteredData.length > 0 && (
              <>
                <CardCurrent current={filteredData[filteredData.length - 1].Current} dailyReadings={dailyReadings}/>
                <CardVoltage voltage={filteredData[filteredData.length - 1].Voltage} dailyReadings={dailyReadings}/>
                <CardPower power={filteredData[filteredData.length - 1].Power} dailyReadings={dailyReadings}/>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="Chart_content fade-in-section">
        <BarChart data={filteredData} isLoading={isLoading} error={error} />
        <DoughnutChart data={data} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default Room1;