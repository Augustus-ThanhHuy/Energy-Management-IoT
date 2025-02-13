import BarGrap from "./chart/bar/bargrap";
import Pie from "./chart/pie/pie";
import Line from "./chart/line/line";
import Radar from "./chart/radar/radar";
import MapPage from "./chart/map/map";
import Room1 from "./chart/room1/room1";
import Masterlayout from "./masterlayout";
import { Route, Routes } from "react-router-dom";

const renderUserRouter = () =>{
    
    return (
       <Masterlayout>
            <Routes >
                <Route path="/" element={<BarGrap/>}></Route>
                <Route path="/line" element={<Line/>}></Route>
                <Route path="/pie" element={<Pie/>}></Route>
                <Route path="/radar" element={<Radar/>}></Route>
                <Route path="/map" element={<MapPage/>}></Route>
                <Route path="/room1" element={<Room1/>}></Route>
            </Routes>
       </Masterlayout>
    )
}

const RouterCustom = () =>{
    return renderUserRouter();
};

export default RouterCustom;