import React from 'react';
import {Route, Routes} from "react-router-dom";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import Dashboard from "./pages/dash/Dashboard.jsx";
import ProtectedRoute from "./pages/service/ProtectedRoute.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Scripts from "./pages/dash/Scripts.jsx";
import Settings from "./pages/dash/Settings.jsx";
import Help from "./pages/dash/Help.jsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Index/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/*" element={<NotFound/>} />


            <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['Teacher','Admin']}>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="/scripts" element={
                <ProtectedRoute allowedRoles={['Teacher','Admin']}>
                    <Scripts />
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['Teacher','Admin']}>
                    <Settings />
                </ProtectedRoute>
            } />
            <Route path="/help" element={
                <ProtectedRoute allowedRoles={['Teacher','Admin']}>
                    <Help />
                </ProtectedRoute>
            } />

        </Routes>
    );
};

export default AppRoutes;