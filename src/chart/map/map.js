import './map.css';
import React, { useEffect, useState } from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa'; // Icon bản đồ

const MapPage = () => {
  const [locationName, setLocationName] = useState('Đang tải địa chỉ...');

  // Tọa độ cố định
  const latitude = 10.851275146708264;
  const longitude = 106.771612689192;

  // Lấy tên địa điểm từ tọa độ (dùng Google Maps Geocoding API hoặc mock)
  useEffect(() => {
    // Mock dữ liệu địa chỉ (thay bằng API thực nếu cần)
    setTimeout(() => {
      setLocationName('Đại học Sư Phạm Kỹ Thuật TP.HCM, Thủ Đức, TP. Hồ Chí Minh');
    }, 1000);

    // Nếu muốn dùng API thực tế, bạn có thể gọi Google Maps Geocoding API:
    /*
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          setLocationName(data.results[0].formatted_address);
        } else {
          setLocationName('Không tìm thấy địa chỉ');
        }
      })
      .catch(() => setLocationName('Lỗi khi lấy địa chỉ'));
    */
  }, [latitude, longitude]);

  return (
    <div className="Map_container">
      <h2>
        <FaMapMarkedAlt className="map-header-icon" /> Vị trí khu trọ
      </h2>

      <div className="Map_info">
        <p>
          <strong>Vĩ độ:</strong> {latitude}
        </p>
        <p>
          <strong>Kinh độ:</strong> {longitude}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {locationName}
        </p>
      </div>

      <div className="Map_content fade-in-map">
        <iframe
          width="100%"
          height="400"
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`}
          title="Google Maps showing the nearest location"
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
};

export default MapPage;