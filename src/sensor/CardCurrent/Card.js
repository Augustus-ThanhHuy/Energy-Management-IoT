import React from 'react';
import './Card.css';
import { BiPulse } from "react-icons/bi";

const calculateStats = (readings) => {
  if (!readings || readings.length === 0) {
    return { avg: 'N/A', max: 'N/A', min: 'N/A' };
  }
  const values = readings.map(reading => parseFloat(reading.Current || 0));
  const avg = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2);
  const max = Math.max(...values).toFixed(2);
  const min = Math.min(...values).toFixed(2);
  return { avg, max, min };
};

const CardCurrent = ({ current, dailyReadings }) => {
  const { avg, max, min } = calculateStats(dailyReadings);

  return (
    <div className='Card_current_container'>
      <div className='Card_current'>
        <div className='Card__icon_current'>
          <BiPulse />
        </div>
        <div className='Card_container'>
          <div className='Card__text'>
            <span>Dòng điện</span>
          </div>
          <div className='Card__number'>
            <span>{current ? `${current}A` : "N/A"}</span>
          </div>
        </div>
      </div>
      <div className='Card_para_container'>
        <div className='Card_para_item_day'>
          <span>AVG day</span>
          <span>{avg !== 'N/A' ? `${avg}A` : "N/A"}</span>
        </div>
        <div className='Card_para_item_month'>
          <span>Max day</span>
          <span>{max !== 'N/A' ? `${max}A` : "N/A"}</span>
        </div>
        <div className='Card_para_item_year'>
          <span>Min day</span>
          <span>{min !== 'N/A' ? `${min}A` : "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default CardCurrent;