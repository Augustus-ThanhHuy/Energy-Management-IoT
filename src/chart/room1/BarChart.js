import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './room1.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const BarChart = ({ data, isLoading, error }) => {
  const [chartType, setChartType] = useState('Temperature');
  const [stats, setStats] = useState({ avgDay: 0, maxDay: 0, minDay: 0 });

  const chartTypes = [
    { label: 'Nhiệt độ (°C)', value: 'Temperature' },
    { label: 'Độ ẩm (%)', value: 'Humidity' },
    { label: 'Năng lượng (kWh)', value: 'Energy' },
    { label: 'Dòng điện (A)', value: 'Current' },
    { label: 'Điện áp (V)', value: 'Voltage' },
    { label: 'Công suất (W)', value: 'Power' },
  ];

  const formatTimeLabel = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const sampledData = data?.length > 0
    ? data.filter((_, index) => index % 10 === 0)
    : [];

  useEffect(() => {
    if (!isLoading && !error && data?.length > 0) {
      const key = chartType;

      const avgDay = data.length > 0
        ? data.reduce((sum, item) => sum + parseFloat(item[key] || 0), 0) / data.length
        : 0;
      const maxDay = data.length > 0
        ? Math.max(...data.map(item => parseFloat(item[key] || 0)))
        : 0;
      const minDay = data.length > 0
        ? Math.min(...data.map(item => parseFloat(item[key] || 0)))
        : 0;

      setStats({ avgDay: avgDay.toFixed(1), maxDay, minDay });
    }
  }, [data, isLoading, error, chartType]);

  const chartData = {
    labels: sampledData.length > 0 ? sampledData.map(entry => formatTimeLabel(entry.TimeUpdate)) : [],
    datasets: [
      {
        label: chartTypes.find(type => type.value === chartType)?.label || chartType,
        data: sampledData.length > 0 ? sampledData.map(entry => parseFloat(entry[chartType] || 0)) : [],
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          if (chartType === 'Temperature') {
            gradient.addColorStop(0, '#f87171');
            gradient.addColorStop(1, '#ef4444');
          } else if (chartType === 'Humidity') {
            gradient.addColorStop(0, '#60a5fa');
            gradient.addColorStop(1, '#3b82f6');
          } else if (chartType === 'Energy') {
            gradient.addColorStop(0, '#facc15');
            gradient.addColorStop(1, '#eab308');
          } else if (chartType === 'Current') {
            gradient.addColorStop(0, '#4ade80');
            gradient.addColorStop(1, '#22c55e');
          } else if (chartType === 'Voltage') {
            gradient.addColorStop(0, '#a855f7');
            gradient.addColorStop(1, '#9333ea');
          } else {
            gradient.addColorStop(0, '#fb923c');
            gradient.addColorStop(1, '#f97316');
          }
          return gradient;
        },
        borderColor: chartType === 'Temperature' ? '#dc2626' :
                     chartType === 'Humidity' ? '#2563eb' :
                     chartType === 'Energy' ? '#ca8a04' :
                     chartType === 'Current' ? '#16a34a' :
                     chartType === 'Voltage' ? '#7e22ce' :
                     '#ea580c',
        borderWidth: 1,
        borderRadius: 10,
        barThickness: 15,
        categoryPercentage: 0.5,
        barPercentage: 0.8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          font: { size: 13, weight: 'bold' },
          color: '#333',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 14, weight: 'bold' },
          color: '#333',
          stepSize: 10,
        },
        grid: { color: '#e5e7eb' },
        title: {
          display: true,
          text: chartTypes.find(type => type.value === chartType)?.label || chartType,
          font: { size: 14, weight: 'bold' },
          color: '#1f2937',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#222',
          padding: 20,
          boxWidth: 20,
        },
      },
      title: {
        display: true,
        text: `Biểu đồ cột ${chartTypes.find(type => type.value === chartType)?.label || chartType}`,
        font: { size: 20, weight: 'bold' },
        color: '#1f2937',
        padding: { top: 10, bottom: 20 },
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111827',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 6,
        callbacks: {
          title: (tooltipItems) => {
            const time = sampledData?.[tooltipItems[0].dataIndex]?.TimeUpdate;
            return time ? new Date(time).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }) : '';
          },
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(1)} ${
              label.includes('Nhiệt độ') ? '°C' :
              label.includes('Độ ẩm') ? '%' :
              label.includes('Năng lượng') ? 'kWh' :
              label.includes('Dòng điện') ? 'A' :
              label.includes('Điện áp') ? 'V' :
              label.includes('Công suất') ? 'W' : ''
            }`;
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="Bar_container">
      <div className="Bar_chart">
        <div className="chart-type-selector">
          <label htmlFor="chart-type-select">Chọn biến để hiển thị: </label>
          <select
            id="chart-type-select"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            {chartTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        {sampledData.length > 0 ? (
          <Bar data={chartData} options={chartOptions} width={700} height={400} />
        ) : (
          <div>Không có dữ liệu để hiển thị</div>
        )}
      </div>
      <div className="Bar_content">
        <div className="Bar_list_item">
          <div className="Bar_para_item_day">
            <span>Trung bình ngày</span>
            <span>{stats.avgDay}</span>
          </div>
          <div className="Bar_para_item_month">
            <span>Max ngày</span>
            <span>{stats.maxDay}</span>
          </div>
          <div className="Bar_para_item_year">
            <span>Min ngày</span>
            <span>{stats.minDay}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;