import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './room1.css';

const DoughnutChart = ({ data, isLoading, error }) => {
  const [chartType, setChartType] = useState('temperature');
  const [tempCategories, setTempCategories] = useState([]);
  const [humidityCategories, setHumidityCategories] = useState([]);
  const [energyCategories, setEnergyCategories] = useState([]); // Thêm trạng thái cho Energy
  const [currentCategories, setCurrentCategories] = useState([]);
  const [voltageCategories, setVoltageCategories] = useState([]);
  const [powerCategories, setPowerCategories] = useState([]);
  const [stats, setStats] = useState({ avgValue: 0, maxRatio: { name: '', percentage: 0 }, minRatio: { name: '', percentage: 0 } });

  // Màu cho biểu đồ (chỉ cần 3 màu vì mỗi biến có 3 danh mục: Thấp, Trung bình, Cao)
  const COLORS = ['#FF6384', '#36A2EB', '#FFBB28'];

  useEffect(() => {
    if (!isLoading && !error && data.length > 0) {
      // Phân loại nhiệt độ
      const lowTemp = data.filter(item => parseFloat(item.Temperature || 0) < 22).length;
      const medTemp = data.filter(item => parseFloat(item.Temperature || 0) >= 22 && parseFloat(item.Temperature || 0) < 25).length;
      const highTemp = data.filter(item => parseFloat(item.Temperature || 0) >= 25).length;

      setTempCategories([
        { name: 'Thấp (< 22°C)', value: lowTemp },
        { name: 'Trung bình (22-24°C)', value: medTemp },
        { name: 'Cao (≥ 25°C)', value: highTemp }
      ]);

      // Phân loại độ ẩm
      const lowHumidity = data.filter(item => parseFloat(item.Humidity || 0) < 55).length;
      const medHumidity = data.filter(item => parseFloat(item.Humidity || 0) >= 55 && parseFloat(item.Humidity || 0) < 65).length;
      const highHumidity = data.filter(item => parseFloat(item.Humidity || 0) >= 65).length;

      setHumidityCategories([
        { name: 'Thấp (< 55%)', value: lowHumidity },
        { name: 'Trung bình (55-64%)', value: medHumidity },
        { name: 'Cao (≥ 65%)', value: highHumidity }
      ]);

      // Phân loại năng lượng
      const lowEnergy = data.filter(item => parseFloat(item.Energy || 0) < 0.5).length;
      const medEnergy = data.filter(item => parseFloat(item.Energy || 0) >= 0.5 && parseFloat(item.Energy || 0) < 1.0).length;
      const highEnergy = data.filter(item => parseFloat(item.Energy || 0) >= 1.0).length;

      setEnergyCategories([
        { name: 'Thấp (< 0.5)', value: lowEnergy },
        { name: 'Trung bình (0.5-1.0)', value: medEnergy },
        { name: 'Cao (≥ 1.0)', value: highEnergy }
      ]);

      // Phân loại dòng điện
      const lowCurrent = data.filter(item => parseFloat(item.Current || 0) < 0.5).length;
      const medCurrent = data.filter(item => parseFloat(item.Current || 0) >= 0.5 && parseFloat(item.Current || 0) < 1).length;
      const highCurrent = data.filter(item => parseFloat(item.Current || 0) >= 1).length;

      setCurrentCategories([
        { name: 'Thấp (< 0.5A)', value: lowCurrent },
        { name: 'Trung bình (0.5-1A)', value: medCurrent },
        { name: 'Cao (≥ 1A)', value: highCurrent }
      ]);

      // Phân loại điện áp
      const lowVoltage = data.filter(item => parseFloat(item.Voltage || 0) < 200).length;
      const medVoltage = data.filter(item => parseFloat(item.Voltage || 0) >= 200 && parseFloat(item.Voltage || 0) < 230).length;
      const highVoltage = data.filter(item => parseFloat(item.Voltage || 0) >= 230).length;

      setVoltageCategories([
        { name: 'Thấp (< 200V)', value: lowVoltage },
        { name: 'Trung bình (200-230V)', value: medVoltage },
        { name: 'Cao (≥ 230V)', value: highVoltage }
      ]);

      // Phân loại công suất
      const lowPower = data.filter(item => parseFloat(item.Power || 0) < 100).length;
      const medPower = data.filter(item => parseFloat(item.Power || 0) >= 100 && parseFloat(item.Power || 0) < 200).length;
      const highPower = data.filter(item => parseFloat(item.Power || 0) >= 200).length;

      setPowerCategories([
        { name: 'Thấp (< 100W)', value: lowPower },
        { name: 'Trung bình (100-200W)', value: medPower },
        { name: 'Cao (≥ 200W)', value: highPower }
      ]);
    }
  }, [data, isLoading, error]);

  // Tính toán thống kê cho donut_content
  useEffect(() => {
    if (!isLoading && !error && data.length > 0) {
      let selectedData;
      let variableKey;

      if (chartType === 'temperature') {
        selectedData = tempCategories;
        variableKey = 'Temperature';
      } else if (chartType === 'humidity') {
        selectedData = humidityCategories;
        variableKey = 'Humidity';
      } else if (chartType === 'energy') {
        selectedData = energyCategories;
        variableKey = 'Energy';
      } else if (chartType === 'current') {
        selectedData = currentCategories;
        variableKey = 'Current';
      } else if (chartType === 'voltage') {
        selectedData = voltageCategories;
        variableKey = 'Voltage';
      } else {
        selectedData = powerCategories;
        variableKey = 'Power';
      }

      // Tính giá trị trung bình thực tế của biến
      const avgValue = data.length > 0
        ? data.reduce((sum, item) => sum + parseFloat(item[variableKey] || 0), 0) / data.length
        : 0;

      // Tính tỷ lệ phần trăm cho từng danh mục
      const total = selectedData.reduce((sum, item) => sum + item.value, 0);
      const ratios = selectedData.map(item => ({
        name: item.name,
        percentage: total > 0 ? (item.value / total * 100).toFixed(1) : 0
      }));

      // Tìm danh mục có tỷ lệ cao nhất và thấp nhất
      const maxRatio = ratios.reduce((max, item) => item.percentage > max.percentage ? item : max, { name: '', percentage: 0 });
      const minRatio = ratios.reduce((min, item) => item.percentage < min.percentage ? item : min, { name: '', percentage: 100 });

      setStats({ avgValue: avgValue.toFixed(1), maxRatio, minRatio });
    }
  }, [data, isLoading, error, chartType, tempCategories, humidityCategories, energyCategories, currentCategories, voltageCategories, powerCategories]);

  // Dữ liệu cho Doughnut dựa trên chartType
  const doughnutData = {
    labels: (
      chartType === 'temperature' ? tempCategories :
      chartType === 'humidity' ? humidityCategories :
      chartType === 'energy' ? energyCategories :
      chartType === 'current' ? currentCategories :
      chartType === 'voltage' ? voltageCategories :
      powerCategories
    ).map(entry => entry.name),
    datasets: [{
      label: 'Phân tích dữ liệu',
      data: (
        chartType === 'temperature' ? tempCategories :
        chartType === 'humidity' ? humidityCategories :
        chartType === 'energy' ? energyCategories :
        chartType === 'current' ? currentCategories :
        chartType === 'voltage' ? voltageCategories :
        powerCategories
      ).map(entry => entry.value),
      backgroundColor: COLORS,
      borderColor: COLORS.map(color => color.replace('0.7', '1')),
      borderWidth: 1,
    }]
  };

  if (isLoading) return <div>Đang tải biểu đồ...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  const chartTypes = [
    { label: 'Nhiệt độ', value: 'temperature' },
    { label: 'Độ ẩm', value: 'humidity' },
    { label: 'Năng lượng', value: 'energy' }, // Thêm tùy chọn cho Energy
    { label: 'Dòng điện', value: 'current' },
    { label: 'Điện áp', value: 'voltage' },
    { label: 'Công suất', value: 'power' },
  ];

  return (
    <div className="donut_container">
      <div className="donut_chart">
        <div className="chart-type-selector">
          <label htmlFor="chart-type-select">Chọn loại biểu đồ: </label>
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
        <Doughnut
          data={doughnutData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { font: { size: 14, weight: 'bold' }, color: '#222' },
              },
              title: {
                display: true,
                text: chartType === 'temperature' ? 'Phân loại nhiệt độ' :
                      chartType === 'humidity' ? 'Phân loại độ ẩm' :
                      chartType === 'energy' ? 'Phân loại năng lượng' : // Thêm tiêu đề cho Energy
                      chartType === 'current' ? 'Phân loại dòng điện' :
                      chartType === 'voltage' ? 'Phân loại điện áp' :
                      'Phân loại công suất',
                font: { size: 18, weight: 'bold' }
              },
              datalabels: {
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((acc, val) => acc + parseFloat(val), 0);
                  const percentage = (value / total * 100).toFixed(1);
                  return value > 0 ? `${percentage}%` : '';
                },
                color: '#fff',
                font: { weight: 'bold', size: 12 },
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${value} bản ghi (${percentage}%)`;
                  }
                }
              }
            },
          }}
          plugins={[ChartDataLabels]}
          width={700}
          height={500}
        />
      </div>
      <div className="donut_content">
        <div className="donut_list_item">
          <div className="donut_para_item_day">
            <span>Trung bình</span>
            <span>{stats.avgValue} {chartType === 'temperature' ? '°C' : chartType === 'humidity' ? '%' : chartType === 'current' ? 'A' : chartType === 'voltage' ? 'V' : chartType === 'energy' ? 'kWh' : 'W'}</span> 
          </div>
          <div className="donut_para_item_month">
            <span>Tỷ lệ cao nhất</span>
            <span>{stats.maxRatio.name}: {stats.maxRatio.percentage}%</span>
          </div>
          <div className="donut_para_item_year">
            <span>Tỷ lệ thấp nhất</span>
            <span>{stats.minRatio.name}: {stats.minRatio.percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;