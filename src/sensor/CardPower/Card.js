import React from 'react';
import './Card.css';
import { BsPower } from "react-icons/bs";

const calculateStats = (readings) => {
  if (!readings || readings.length === 0) {
    return { avg: 'N/A', max: 'N/A', min: 'N/A' };
  }
  const values = readings.map(reading => parseFloat(reading.Power || 0));
  const avg = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2);
  const max = Math.max(...values).toFixed(2);
  const min = Math.min(...values).toFixed(2);
  return { avg, max, min };
};

const CardPower = ({ power, dailyReadings  }) => {
      const { avg, max, min } = calculateStats(dailyReadings);

  return (
    <div className='Card_power_container'>
      <div className='Card_power'>
        <div className='Card__icon_power'>
        <BsPower />
        </div>
        <div className='Card_container'>
          <div className='Card__text'>
            <span>Công suất</span>
          </div>
          <div className='Card__number'>
          <span>{power ? `${power}W` : "Loading..."}</span>
          </div>
        </div>
      </div>
      <div className='Card_para_container'>
        <div className='Card_para_item_day'>
          <span>AVG day</span>
          <span>{power ? `${avg}W` : "Loading..."}</span>
          </div>
        <div className='Card_para_item_month'>          
          <span>Max day</span>
          <span>{power ? `${max}W` : "Loading..."}</span>
          </div>
        <div className='Card_para_item_year'>
        <span>Min day</span>
          <span>{power ? `${min}W` : "Loading..."}</span>
          </div>
      </div>
    </div>
    
    
  );
};

export default CardPower;
