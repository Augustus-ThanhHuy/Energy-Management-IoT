import React from 'react';
import './Card.css';
import {AiOutlineThunderbolt} from "react-icons/ai"
const CardEnergy = ({ energy }) => {
  return (
    <div className='Card_energy'>
      <div className='Card__icon_energy'>
        <AiOutlineThunderbolt />
      </div>
      <div className='Card_container'>
        <div className='Card__text'>
          <span>Energy</span>
        </div>
        <div className='Card__number'>
          <span>{energy ? `${energy}VAC` : "Loading..."}</span>
        </div>
      </div>
    </div>
  );
};

export default CardEnergy;
