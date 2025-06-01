import React from 'react';
import './Card.css';
import {AiOutlineThunderbolt} from "react-icons/ai"

const calculateStats = (readings) => {
  if (!readings || readings.length === 0) {
    return { avg: 'N/A', max: 'N/A', min: 'N/A' };
  }
  const values = readings.map(reading => parseFloat(reading.Energy || 0));
  const avg = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2);
  const max = Math.max(...values).toFixed(2);
  const min = Math.min(...values).toFixed(2);
  return { avg, max, min };
};

const CardEnergy = ({ energy, dailyReadings }) => {
   const { avg, max, min } = calculateStats(dailyReadings);

  return (
    <div className='Card_energy_container'>
      <div className='Card_energy'>
      <div className='Card__icon_energy'>
        <AiOutlineThunderbolt />
      </div>
      <div className='Card_container'>
        <div className='Card__text'>
          <span>Điện năng</span>
        </div>
        <div className='Card__number'>
          <span>{energy ? `${energy}kWh` : "Loading..."}</span>
        </div>
      </div>
    </div>
      <div className='Card_para_container'>
        <div className='Card_para_item_day'>
          <span>AVG day</span>
          <span>{energy ? `${avg}kWh` : "Loading..."}</span>
          </div>
        <div className='Card_para_item_month'>          
          <span>Max day</span>
          <span>{energy ? `${max}kWh` : "Loading..."}</span>
          </div>
        <div className='Card_para_item_year'>
        <span>Min day</span>
        <span>{energy ? `${min}kWh` : "Loading..."}</span>
          </div>
      </div>
    </div>
  );
};

export default CardEnergy;
