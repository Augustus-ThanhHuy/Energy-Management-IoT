import React, { useEffect, useState } from 'react';
import './map.css';

const MapPage = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null, nodeid: null });

    useEffect(() => {
        // Fetch dữ liệu từ API PHP
        fetch('https://huyed2.assfa.net/DoAn2.php') // Thay bằng URL API PHP của bạn
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    // Lấy bản ghi mới nhất (nếu dữ liệu đã được sắp xếp theo thời gian)
                    const nearest = data[data.length - 1]; // Lấy bản ghi cuối cùng (mới nhất)

                    // Đảm bảo lấy giá trị nodeid, longitude và latitude chính xác
                    setLocation({
                        nodeid: nearest.nodeid,
                        latitude: nearest.latitude,
                        longitude: nearest.longitude,
                    });
                } else {
                    console.error('No data found or invalid format:', data);
                }
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className='Map_container'>
            <p>Map</p>
            <div className='Map_info'>
                <p><strong>Node ID:</strong> {location.nodeid || 'N/A'}</p>
                <p><strong>Longitude:</strong> {location.longitude || 'N/A'}</p>
                <p><strong>Latitude:</strong> {location.latitude || 'N/A'}</p>
            </div>
            <div className='Map_content'>
                {location.latitude && location.longitude ? (
                    <iframe
                        width="100%"
                        height="320"
                        src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&output=embed`}
                        title="Google Maps showing the nearest location"
                    />
                ) : (
                    <p>Loading map...</p>
                )}
            </div>
        </div>
    );
};

export default MapPage;
