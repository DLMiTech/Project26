import React from 'react';
import {Route, Routes} from "react-router-dom";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import Dashboard from "./pages/dash/Dashboard.jsx";
import ProtectedRoute from "./pages/service/ProtectedRoute.jsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Index/>} />
            <Route path="/*" element={<NotFound/>} />


            <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Parent', 'Admin', 'Super-Admin']}>
                    <Dashboard />
                </ProtectedRoute>
            } />

        </Routes>
    );
};

export default AppRoutes;