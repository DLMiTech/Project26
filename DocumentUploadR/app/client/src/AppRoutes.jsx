import React from 'react';
import {Route, Routes} from "react-router-dom";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import Dashboard from "./pages/dash/dashboard/Dashboard.jsx";
import ProtectedRoute from "./service/ProtectedRoute.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ManageCourses from "./pages/dash/courses/ManageCourses.jsx";
import LectureCourses from "./pages/dash/LectureCourses/LectureCourses.jsx";
import AccessControl from "./pages/dash/accessControl/AccessControl.jsx";
import Repository from "./pages/dash/repository/Repository.jsx";
import SemesterRepo from "./pages/dash/repository/SemesterRepo.jsx";
import CourseRepository from "./pages/dash/repository/CourseRepository.jsx";
import Uploads from "./pages/dash/uploads/Uploads.jsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Index/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/*" element={<NotFound/>} />


            <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['lecture','hod']}>
                    <Dashboard />
                </ProtectedRoute>
            } />

            <Route path="/access-control" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod']}>
                    <AccessControl />
                </ProtectedRoute>
            } />
            <Route path="/repositories" element={
                <ProtectedRoute allowedRoles={['hod']}>
                    <Repository />
                </ProtectedRoute>
            } />
            <Route path="/repositories/semester-repo" element={
                <ProtectedRoute allowedRoles={['hod']}>
                    <SemesterRepo />
                </ProtectedRoute>
            } />
            <Route path="/repositories/course-repository" element={
                <ProtectedRoute allowedRoles={['hod']}>
                    <CourseRepository />
                </ProtectedRoute>
            } />


            <Route path="/uploads" element={
                <ProtectedRoute allowedRoles={['lecture', 'hod']}>
                    <Uploads />
                </ProtectedRoute>
            } />

            <Route path="/courses" element={
                <ProtectedRoute allowedRoles={['lecture','hod']}>
                    <ManageCourses />
                </ProtectedRoute>
            } />

            <Route path="/lecture-courses" element={
                <ProtectedRoute allowedRoles={['lecture','hod']}>
                    <LectureCourses />
                </ProtectedRoute>
            } />

        </Routes>
    );
};

export default AppRoutes;