import React from 'react';
import {Route, Routes} from "react-router-dom";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import Dashboard from "./pages/dash/dashboard/Dashboard.jsx";
import ProtectedRoute from "./service/ProtectedRoute.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Faculty from "./pages/dash/faculty/Faculty.jsx";
import Department from "./pages/dash/department/Department.jsx";
import MemoCreate from "./pages/dash/memo/MemoCreate.jsx";
import MemoList from "./pages/dash/memo/MemoList.jsx";
import MemoDetail from "./pages/dash/memo/MemoDetail.jsx";
import Notifications from "./pages/dash/notifications/Notifications.jsx";
import UserDepartment from "./pages/dash/userDepartment/UserDepartment.jsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Index/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/*" element={<NotFound/>} />


            <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod', 'dean', 'admin']}>
                    <Dashboard />
                </ProtectedRoute>
            } />


            <Route path="/faculty" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod', 'dean', 'admin']}>
                    <Faculty />
                </ProtectedRoute>
            } />

            <Route path="/department" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod', 'dean', 'admin']}>
                    <Department />
                </ProtectedRoute>
            } />

            <Route path="/memos" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod', 'dean', 'admin']}>
                    <MemoList />
                </ProtectedRoute>
            } />
            <Route path="/memos/create" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod', 'dean', 'admin']}>
                    <MemoCreate />
                </ProtectedRoute>
            } />
            <Route path="/memos/:id" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod', 'dean', 'admin']}>
                    <MemoDetail />
                </ProtectedRoute>
            } />
            <Route path="/memos/:id/edit" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod', 'dean', 'admin']}>
                    <MemoCreate />
                </ProtectedRoute>
            } />


            <Route path="/notifications" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod', 'dean', 'admin']}>
                    <Notifications />
                </ProtectedRoute>
            } />

            <Route path="/user-departments" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod', 'dean', 'admin']}>
                    <UserDepartment />
                </ProtectedRoute>
            } />

        </Routes>
    );
};

export default AppRoutes;