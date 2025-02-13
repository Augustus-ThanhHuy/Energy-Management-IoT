import React from 'react';
import './Card.css';
import { IoWaterOutline } from "react-icons/io5";

const CardHumidity = ({ humidity }) => {
  return (
    <div className='Card_hum'>
      <div className='Card__icon_Hum'>
        <IoWaterOutline />
      </div>
      <div className='Card_container'>
        <div className='Card__text'>
          <span>Humidity</span>
        </div>
        <div className='Card__number'>
          <span>{humidity ? `${humidity}%` : "Loading..."}</span>
        </div>
      </div>
    </div>
  );
};

export default CardHumidity;
