import './sidebar.css';
import Logo from '../img/uni.png';
import React from 'react';
import { MdMeetingRoom } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom'; 
import { GrMapLocation } from "react-icons/gr";
import { BiCoinStack } from "react-icons/bi";
import { BsToggles } from "react-icons/bs";

const Sidebar = () => {
  const location = useLocation();
  
  return(
    <div className='sidebars'>
      <div className='sidebars_child'>
        <div className='logo'>
          <img src={Logo} alt='Logo' height={60} width={60} />
          <span>
            <span>HCM</span>
            UTE
          </span>
        </div>

        {/* Menu */}
        <div className='menu'>
          <Link to="/" className={`menuItem ${location.pathname === '/' ? 'active' : ''}`}> 
            <div>
              <MdMeetingRoom />
            </div>
            <span>Phòng 1</span>
          </Link>
          
          <Link to="/room2" className={`menuItem ${location.pathname === '/room2' ? 'active' : ''}`}> 
            <div>
              <MdMeetingRoom />
            </div>
            <span>Phòng 2</span>
          </Link>
          
          <Link to="/control" className={`menuItem ${location.pathname === '/control' ? 'active' : ''}`}> 
            <div>
              <BsToggles />
            </div>
            <span>Điều Khiển</span>
          </Link>
          
          <Link to="/map" className={`menuItem ${location.pathname === '/map' ? 'active' : ''}`}> 
            <div>
              <GrMapLocation />
            </div>
            <span>Bản Đồ</span>
          </Link>
          
          <Link to="/manage" className={`menuItem ${location.pathname === '/manage' ? 'active' : ''}`}> 
            <div>
              <BiCoinStack />
            </div>
            <span>Quản Lý</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;