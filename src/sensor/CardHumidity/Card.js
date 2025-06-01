import React from 'react';
import './Card.css';
import { IoWaterOutline } from "react-icons/io5";


const calculateStats = (readings) => {
  if (!readings || readings.length === 0) {
    return { avg: 'N/A', max: 'N/A', min: 'N/A' };
  }
  const values = readings.map(reading => parseFloat(reading.Humidity || 0));
  const avg = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2);
  const max = Math.max(...values).toFixed(2);
  const min = Math.min(...values).toFixed(2);
  return { avg, max, min };
};

const CardHumidity = ({ humidity, dailyReadings }) => {
  const { avg, max, min } = calculateStats(dailyReadings);

  return (
    <div className='Card_hum_container'>
      <div className='Card_hum'>
        <div className='Card__icon_Hum'>
          <IoWaterOutline />
        </div>
        <div className='Card_container'>
          <div className='Card__text'>
            <span>Độ ẩm</span>
          </div>
          <div className='Card__number'>
            <span>{humidity ? `${humidity}%` : "Loading..."}</span>
          </div>
        </div>
      </div>
      <div className='Card_para_container'>
        <div className='Card_para_item_day'>
          <span>AVG day</span>
          <span>{humidity ? `${avg}%` : "Loading..."}</span>
          </div>
        <div className='Card_para_item_month'>          
          <span>Max day</span>
          <span>{humidity ? `${max}%` : "Loading..."}</span>
          </div>
        <div className='Card_para_item_year'>
        <span>Min day</span>
        <span>{humidity ? `${min}%` : "Loading..."}</span>
          </div>
      </div>
    </div>
    
    
  );
};

export default CardHumidity;
