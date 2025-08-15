import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../screens/LandingPage";
import Login from "../screens/Login";
import Signup from "../screens/Register";
import Dashboard from "../screens/Home";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/register" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default AppRoutes;