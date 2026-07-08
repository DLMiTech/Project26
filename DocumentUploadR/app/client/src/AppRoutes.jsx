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
import AccessControl from "./pages/dash/access/AccessControl.jsx";
import Course from "./pages/dash/course/Course.jsx";
import AddCourse from "./pages/dash/course/AddCourse.jsx";
import DeleteCourse from "./pages/dash/course/DeleteCourse.jsx";
import RequestAccess from "./pages/dash/access/RequestAccess.jsx";
import GrantAccess from "./pages/dash/access/GrantAccess.jsx";
import AllAccess from "./pages/dash/access/AllAccess.jsx";
import DeleteAccess from "./pages/dash/access/DeleteAccess.jsx";
import Repository from "./pages/dash/repository/Repository.jsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Index/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/*" element={<NotFound/>} />


            <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['lecturer','hod']}>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="/scripts" element={
                <ProtectedRoute allowedRoles={['lecturer','hod']}>
                    <Scripts />
                </ProtectedRoute>
            } />
            <Route path="/course" element={
                <ProtectedRoute allowedRoles={['lecturer','hod']}>
                    <Course />
                </ProtectedRoute>
            } />
            <Route path="/course/add-course" element={
                <ProtectedRoute allowedRoles={['lecturer','hod']}>
                    <AddCourse />
                </ProtectedRoute>
            } />
            <Route path="/course/delete-course/:id" element={
                <ProtectedRoute allowedRoles={['lecturer','hod']}>
                    <DeleteCourse />
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['lecturer','hod']}>
                    <Settings />
                </ProtectedRoute>
            } />

            <Route path="/access-control" element={
                <ProtectedRoute allowedRoles={['lecturer','hod']}>
                    <AccessControl />
                </ProtectedRoute>
            } />
            <Route path="/access-control/get-all" element={
                <ProtectedRoute allowedRoles={['hod']}>
                    <AllAccess />
                </ProtectedRoute>
            } />
            <Route path="/access-control/request-access" element={
                <ProtectedRoute allowedRoles={['lecturer','hod']}>
                    <RequestAccess />
                </ProtectedRoute>
            } />
            <Route path="/access-control/grant/:id" element={
                <ProtectedRoute allowedRoles={['hod']}>
                    <GrantAccess />
                </ProtectedRoute>
            } />
            <Route path="/access-control/delete/:id" element={
                <ProtectedRoute allowedRoles={['hod']}>
                    <DeleteAccess />
                </ProtectedRoute>
            } />


            <Route path="/repository" element={
                <ProtectedRoute allowedRoles={['hod']}>
                    <Repository />
                </ProtectedRoute>
            } />

            <Route path="/help" element={
                <ProtectedRoute allowedRoles={['lecturer','hod']}>
                    <Help />
                </ProtectedRoute>
            } />

        </Routes>
    );
};

export default AppRoutes;