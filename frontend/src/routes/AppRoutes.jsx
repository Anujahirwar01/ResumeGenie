import React from "react";
import { Routes, Route,BrowserRouter } from "react-router-dom";
import LandingPage from "../screens/LandingPage";
import Login from "../screens/Login";
import Signup from "../screens/Register";

const AppRoutes = () => {
    return (

            <Routes>
                
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/register" element={<Signup/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
       
    )
}

export default AppRoutes;