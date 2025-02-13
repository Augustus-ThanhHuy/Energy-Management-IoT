import './sidebar.css';
import Logo from '../img/logo.jpg';
import React from 'react';
import { BsBarChart } from "react-icons/bs";
import { MdMeetingRoom } from "react-icons/md";
import { AiOutlineLineChart } from "react-icons/ai";
import { Link, useLocation  } from 'react-router-dom'; 
import { AiOutlinePieChart } from "react-icons/ai";
import { AiOutlineRadarChart } from "react-icons/ai";
import { GrMapLocation } from "react-icons/gr";

const Sidebar = () =>{
  const location = useLocation();
  return(
    <div ClassName='sidebars'>
      <div className='sidebars_child'>
        <div className='logo'>
        <img src={Logo} alt='' height={64} width={64}  />
        <span>
          <span>Visual</span>
            ization
          </span>
      </div>

      {/* Menu */}
      <div className='menu'>
        <Link to="/" className={`menuItem ${location.pathname === '/' ? 'active' : ''}`}> 
            <div>
              <BsBarChart />
            </div>
            <span>BarGrap</span>
          </Link>
        <Link to="/room1" className={`menuItem ${location.pathname === '/room1' ? 'active' : ''}`}> 
            <div>
              <MdMeetingRoom />
            </div>
            <span>Room 1</span>
          </Link>
        <Link to="/line" className={`menuItem ${location.pathname === '/line' ? 'active' : ''}`}> 
            <div>
              <AiOutlineLineChart />
            </div>
            <span>LineGrap</span>
          </Link>
        <Link to="/pie" className={`menuItem ${location.pathname === '/pie' ? 'active' : ''}`}> 
            <div>
              <AiOutlinePieChart />
            </div>
            <span>PieGrap</span>
          </Link>
        <Link to="/radar" className={`menuItem ${location.pathname === '/radar' ? 'active' : ''}`}> 
            <div>
              <AiOutlineRadarChart />
            </div>
            <span>RadarGrap</span>
          </Link>
        <Link to="/map" className={`menuItem ${location.pathname === '/map' ? 'active' : ''}`}> 
            <div>
              <GrMapLocation />
            </div>
            <span>Map</span>
          </Link>
          <div></div>
      </div>
        </div>
    </div>
  )
}

export default Sidebar;
