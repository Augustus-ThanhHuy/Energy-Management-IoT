import React from 'react';
import './Card.css';
import { AiOutlineSun } from "react-icons/ai";

const calculateStats = (readings) => {
  if (!readings || readings.length === 0) {
    return { avg: 'N/A', max: 'N/A', min: 'N/A' };
  }
  const values = readings.map(reading => parseFloat(reading.Temperature || 0));
  const avg = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2);
  const max = Math.max(...values).toFixed(2);
  const min = Math.min(...values).toFixed(2);
  return { avg, max, min };
};

const CardTemperature = ({ temperature, dailyReadings }) => {
    const { avg, max, min } = calculateStats(dailyReadings);

  return (
    <div className='Card_temp_container'>
      <div className='Card_temp'>
      <div className='Card__icon_temp'>
        <AiOutlineSun />
      </div>
      <div className='Card_container'>
        <div className='Card__text'>
          <span>Nhiệt độ</span>
        </div>
        <div className='Card__number'>
          <span>{temperature ? `${temperature}℃` : "Loading..."}</span>
        </div>
      </div>
    </div>
    <div className='Card_para_container'>
        <div className='Card_para_item_day'>
          <span>AVG day</span>
          <span>{temperature ? `${avg}℃` : "Loading..."}</span>
          </div>
        <div className='Card_para_item_month'>          
          <span>Max day</span>
          <span>{temperature ? `${max}℃` : "Loading..."}</span>
          </div>
        <div className='Card_para_item_year'>
        <span>Min day</span>
        <span>{temperature ? `${min}℃` : "Loading..."}</span>
          </div>
      </div>
    </div>
  );
};

export default CardTemperature;
