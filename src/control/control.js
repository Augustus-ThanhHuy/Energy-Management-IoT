import './control.css';
import React, { useState, useEffect } from 'react';
import { IoIosBulb } from "react-icons/io";
import { FaBolt } from "react-icons/fa";
import { BsSnow2 } from "react-icons/bs";

const Control = () => {
  const [devices, setDevices] = useState({
    room1: {
      lamp1: false,
      lamp2: false,
      lamp3: false,
      airConditioner: false,
      power: false
    },
    room2: {
      lamp1: false,
      lamp2: false,
      lamp3: false,
      airConditioner: false,
      power: false
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch dữ liệu với retry
  const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) {
          throw new Error(`Phản hồi mạng không ổn: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  // Fetch trạng thái thiết bị từ API khi component mount
  useEffect(() => {
  const fetchData = () => {
    fetchWithRetry('http://raspberrypi.local/api/get_control.php')
      .then(data => {
        console.log('API get_control response:', data);
        setDevices({
          room1: {
            lamp1: data.room1_lamp1 === 1,
            lamp2: data.room1_lamp2 === 1,
            lamp3: data.room1_lamp3 === 1,
            airConditioner: data.room1_airConditioner === 1,
            power: data.room1_power === 1
          },
          room2: {
            lamp1: data.room2_lamp1 === 1,
            lamp2: data.room2_lamp2 === 1,
            lamp3: data.room2_lamp3 === 1,
            airConditioner: data.room2_airConditioner === 1,
            power: data.room2_power === 1
          }
        });
        setError(null);
      })
      .catch(err => {
        console.error('Lỗi khi lấy trạng thái thiết bị:', err);
        setError('Không thể lấy trạng thái thiết bị');
      })
      .finally(() => setIsLoading(false));
  };

  fetchData(); // gọi ngay lần đầu tiên

  const interval = setInterval(fetchData, 1000); // gọi lại mỗi 5 giây

  return () => clearInterval(interval); // dọn dẹp khi component bị unmount
}, []);


  const handleToggle = (room, device, status) => {
    // Update local state
    setDevices(prev => ({
      ...prev,
      [room]: {
        ...prev[room],
        [device]: status
      }
    }));

    // Send to server
    fetch("http://raspberrypi.local/api/control.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        device: `${room}_${device}`, 
        status: status ? 1 : 0 
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Response from server:", data);
      })
      .catch(err => {
        console.error("Error controlling device:", err);
        setError('Lỗi khi điều khiển thiết bị');
      });
  };

  if (isLoading) {
    return <div className="loading">Đang tải trạng thái thiết bị...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  return (
    <div className="control__container">
      {/* Room Titles */}
      <div className="room__title-wrapper">
        <h2 className="room__title">Bảng Điều khiển Phòng 1</h2>
        <h2 className="room__title">Bảng Điều khiển Phòng 2</h2>
      </div>
      
      {/* Room Panels */}
      <div className='control__container__row'>
        {/* Room 1 Panel */}
        <div className='room__panel'>
          <div className='device__grid'>
            {/* Lamps Section */}
            <div className='lamp__section'>
              {/* Lamp 1 */}
              <div className='lamp__item'>
                <div className='lamp__icon'>
                  <IoIosBulb />
                </div>
                <span className='lamp__name'>Đèn 1</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={devices.room1.lamp1}
                    onChange={(e) => handleToggle("room1", "lamp1", e.target.checked)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              {/* Lamp 2 */}
              <div className='lamp__item'>
                <div className='lamp__icon'>
                  <IoIosBulb />
                </div>
                <span className='lamp__name'>Đèn 2</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={devices.room1.lamp2}
                    onChange={(e) => handleToggle("room1", "lamp2", e.target.checked)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              {/* Lamp 3 */}
              <div className='lamp__item'>
                <div className='lamp__icon'>
                  <IoIosBulb />
                </div>
                <span className='lamp__name'>Đèn 3</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={devices.room1.lamp3}
                    onChange={(e) => handleToggle("room1", "lamp3", e.target.checked)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            
            {/* Other Devices */}
            <div className='device__section'>
              {/* Air Conditioner */}
              <div className='device__card'>
                <div className='device__header'>
                  <span className='device__name'>Máy Lạnh</span>
                </div>
                <div className='device__icon-wrapper'>
                  <div className='device__icon'>
                    <BsSnow2 />
                  </div>
                </div>
                <div className="device__control">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={devices.room1.airConditioner}
                      onChange={(e) => handleToggle("room1", "airConditioner", e.target.checked)} 
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="device__status">
                    {devices.room1.airConditioner ? 'BẬT' : 'TẮT'}
                  </span>
                </div>
              </div>
              
              {/* Power */}
              <div className='device__card'>
                <div className='device__header'>
                  <span className='device__name'>Nguồn Điện</span>
                </div>
                <div className='device__icon-wrapper'>
                  <div className='device__icon'>
                    <FaBolt />
                  </div>
                </div>
                <div className="device__control">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={devices.room1.power}
                      onChange={(e) => handleToggle("room1", "power", e.target.checked)} 
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="device__status">
                    {devices.room1.power ? 'BẬT' : 'TẮT'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Room 2 Panel */}
        <div className='room__panel'>
          <div className='device__grid'>
            {/* Lamps Section */}
            <div className='lamp__section'>
              {/* Lamp 1 */}
              <div className='lamp__item'>
                <div className='lamp__icon'>
                  <IoIosBulb />
                </div>
                <span className='lamp__name'>Đèn 1</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={devices.room2.lamp1}
                    onChange={(e) => handleToggle("room2", "lamp1", e.target.checked)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              {/* Lamp 2 */}
              <div className='lamp__item'>
                <div className='lamp__icon'>
                  <IoIosBulb />
                </div>
                <span className='lamp__name'>Đèn 2</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={devices.room2.lamp2}
                    onChange={(e) => handleToggle("room2", "lamp2", e.target.checked)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              {/* Lamp 3 */}
              <div className='lamp__item'>
                <div className='lamp__icon'>
                  <IoIosBulb />
                </div>
                <span className='lamp__name'>Đèn 3</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={devices.room2.lamp3}
                    onChange={(e) => handleToggle("room2", "lamp3", e.target.checked)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            
            {/* Other Devices */}
            <div className='device__section'>
              {/* Air Conditioner */}
              <div className='device__card'>
                <div className='device__header'>
                  <span className='device__name'>Máy Lạnh</span>
                </div>
                <div className='device__icon-wrapper'>
                  <div className='device__icon'>
                    <BsSnow2 />
                  </div>
                </div>
                <div className="device__control">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={devices.room2.airConditioner}
                      onChange={(e) => handleToggle("room2", "airConditioner", e.target.checked)} 
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="device__status">
                    {devices.room2.airConditioner ? 'BẬT' : 'TẮT'}
                  </span>
                </div>
              </div>
              
              {/* Power */}
              <div className='device__card'>
                <div className='device__header'>
                  <span className='device__name'>Nguồn Điện</span>
                </div>
                <div className='device__icon-wrapper'>
                  <div className='device__icon'>
                    <FaBolt />
                  </div>
                </div>
                <div className="device__control">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={devices.room2.power}
                      onChange={(e) => handleToggle("room2", "power", e.target.checked)} 
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="device__status">
                    {devices.room2.power ? 'BẬT' : 'TẮT'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Control;
