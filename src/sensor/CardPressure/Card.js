import React from 'react';
import { MdOutlineAir } from "react-icons/md";
import './Card.css';

const CardPressure = ({ airPressure }) => {
  return (
    <div className='Card_pers'>
      <div className='Card__icon_pers'>
        <MdOutlineAir />
      </div>
      <div className='Card__text'>
        <span>Air Pressure</span>
      </div>
      <div className='Card__number'>
        <span>{airPressure ? `${airPressure} Pa` : "Loading..."}</span>
      </div>
    </div>
  );
};

export default CardPressure;
