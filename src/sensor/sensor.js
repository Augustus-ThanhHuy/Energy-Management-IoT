// import React, { useEffect, useState } from "react";
// import CardDust from './CardDust/Card';
// import CardHumidity from './CardHumidity/Card';
// import CardPressure from './CardPressure/Card';
// import CardTemperature from './CardTemperature/Card';
// import './index.css';

// const Sensor = () => {
//   const [temperature, setTemperature] = useState(null);
//   const [humidity, setHumidity] = useState(null);
//   const [dust, setDust] = useState(null);
//   const [airPressure, setAirPressure] = useState(null);

//   useEffect(() => {
//     // Gọi API từ PHP
//     fetch('https://huyed2.assfa.net/DoAn2.php') // Remove the duplicate part
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok " + response.statusText);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         if (data.length > 0) {
//           const latestData = data[data.length - 1]; // Lấy dòng cuối (dữ liệu mới nhất)
//           setTemperature(latestData.Temperature);
//           setHumidity(latestData.Humidity);
//           setDust(latestData.Dust);
//           setAirPressure(latestData.AirPressure);
//         }
//       })
//       .catch((error) => console.error("Error:", error));
//   }, []);

//   return (
//     <div>
//       <div className='sensor__content'>
//         DoAnTotNghiep
//       </div>
//       <div className='sensor__card'>
//         <div className='sensor__card__colum'>
//           <CardTemperature temperature={temperature} />
//           <CardHumidity humidity={humidity} />
//         </div>
//         <CardDust dust={dust} />
//         <CardPressure airPressure={airPressure} />
//       </div>
//     </div>
//   );
// };

// export default Sensor;
