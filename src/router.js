import MapPage from "./chart/map/map";
import Room1 from "./chart/room1/room1";
import Room2 from "./chart/room2/room2";
import Control from "./control/control";
import Manage from "./chart/manage/manage";
import Masterlayout from "./masterlayout";
import { Route, Routes } from "react-router-dom";

const renderUserRouter = () =>{
    
    return (
       <Masterlayout>
            <Routes >
                <Route path="/" element={<Room1/>}></Route>
                <Route path="/map" element={<MapPage/>}></Route>
                <Route path="/room2" element={<Room2/>}></Route>
                <Route path="/manage" element={<Manage/>}></Route>
                <Route path="/control" element={<Control/>}></Route>
            </Routes>
       </Masterlayout>
    )
}

const RouterCustom = () =>{
    return renderUserRouter();
};

export default RouterCustom;