import './manage.css';
import React, { useEffect, useState } from 'react';
import { FaTemperatureHigh, FaTint, FaBolt, FaDownload, FaWater, FaBatteryHalf, FaLightbulb } from 'react-icons/fa';

const ManagePage = () => {
  const [data, setData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('Room1'); // Trạng thái chọn phòng
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

  // Hàm fetch dữ liệu với retry
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

  // Gọi API dựa trên phòng được chọn
  useEffect(() => {
    setIsLoading(true);
    const apiUrl = selectedRoom === 'Room1' 
      ? 'http://raspberrypi.local/api/getData.php' 
      : 'http://raspberrypi.local/api/getDataRoom2.php';

    fetchWithRetry(apiUrl)
      .then(textData => {
        console.log(`Raw API Response (${selectedRoom}):`, textData);
        const jsonStr = textData.replace(/^Kết nối thành công!/, '').trim();
        try {
          const jsonData = JSON.parse(jsonStr);
          if (Array.isArray(jsonData)) {
            setData(jsonData);
          } else {
            console.error('Định dạng JSON không hợp lệ');
            setData([]);
          }
        } catch (error) {
          console.error('Lỗi parse JSON:', error);
          setData([]);
        }
      })
      .catch(error => {
        console.error('Lỗi fetch dữ liệu:', error);
        setData([]);
      })
      .finally(() => setIsLoading(false));
  }, [selectedRoom]); // Gọi lại khi selectedRoom thay đổi

  // Hàm chuyển đổi phòng
  const handleRoomChange = (room) => {
    setSelectedRoom(room);
  };

  // Hàm chuyển dữ liệu thành CSV và tải xuống
  const downloadCSV = () => {
    const headers = ['STT', 'Nhiệt độ (°C)', 'Độ ẩm (%)', 'Năng lượng (kWh)', 'Dòng điện (A)', 'Điện áp (V)', 'Công suất (W)', 'Thời gian cập nhật'];
    const rows = data.map(item => [
      item.STT || '',
      item.Temperature || '',
      item.Humidity || '',
      item.Energy || '',
      item.Current || '',
      item.Voltage || '',
      item.Power || '',
      item.TimeUpdate || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sensor_data_${selectedRoom}.csv`); // Thêm tên phòng vào file CSV
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="data-list-container">
      <div className="header-wrapper">
        <h2>
          <FaTemperatureHigh className="header-icon" /> 
          Danh sách dữ liệu phòng trọ - {selectedRoom}
        </h2>
        <div className="room-selector">
          <button 
            onClick={() => handleRoomChange('Room1')} 
            className={selectedRoom === 'Room1' ? 'active' : ''}
          >
            Phòng 1
          </button>
          <button 
            onClick={() => handleRoomChange('Room2')} 
            className={selectedRoom === 'Room2' ? 'active' : ''}
          >
            Phòng 2
          </button>
        </div>
        <button onClick={downloadCSV} className="download-btn">
          <FaDownload className="download-icon" /> Tải xuống CSV
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : data.length === 0 ? (
        <div className="no-data">Không có dữ liệu để hiển thị</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>STT</th>
                <th><FaTemperatureHigh className="column-icon" /> Nhiệt độ (°C)</th>
                <th><FaTint className="column-icon" /> Độ ẩm (%)</th>
                <th><FaBolt className="column-icon" /> Năng lượng (kWh)</th>
                <th><FaWater className="column-icon" /> Dòng điện (A)</th>
                <th><FaBatteryHalf className="column-icon" /> Điện áp (V)</th>
                <th><FaLightbulb className="column-icon" /> Công suất (W)</th>
                <th>Thời gian cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="fade-in-row">
                  <td>{item.STT || 'N/A'}</td>
                  <td className="temperature-cell">{item.Temperature || 'N/A'}</td>
                  <td className="humidity-cell">{item.Humidity || 'N/A'}</td>
                  <td className="energy-cell">{item.Energy || 'N/A'}</td>
                  <td className="temperature-cell">{item.Current || 'N/A'}</td>
                  <td className="humidity-cell">{item.Voltage || 'N/A'}</td>
                  <td className="energy-cell">{item.Power || 'N/A'}</td>
                  <td>{item.TimeUpdate || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagePage;
