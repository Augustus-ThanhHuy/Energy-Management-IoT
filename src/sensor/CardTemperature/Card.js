import React from 'react';
import './Card.css';
import { AiOutlineSun } from "react-icons/ai";

const CardTemperature = ({ temperature }) => {
  return (
    <div className='Card_temp'>
      <div className='Card__icon_temp'>
        <AiOutlineSun />
      </div>
      <div className='Card_container'>
        <div className='Card__text'>
          <span>Temperature</span>
        </div>
        <div className='Card__number'>
          <span>{temperature ? `${temperature}℃` : "Loading..."}</span>
        </div>
      </div>
    </div>
  );
};

export default CardTemperature;
