import { memo } from 'react';
import './index.css'; 

import Sidebar from '../sidebar/sidebar';
import Header from '../pages/header';

const MasterLayout = ({ children, ...props }) => {
    return (
        <div className="master-layout" {...props}>
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="content">
                <div className='content__header'>
                     <Header />
                </div>

                <div className='content__children'>
                     {children}

                </div>
            </div>
        </div>
    );
};

export default memo(MasterLayout);
