import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./service/ProtectedRoute.jsx";
import {Bounce, ToastContainer} from "react-toastify";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Verification from "./pages/auth/Verification.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ChangePassword from "./pages/auth/ChangePassword.jsx";


const App = () => {


    return (
        <>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="/verification" element={<Verification/>} />
                <Route path="/reset-password" element={<ResetPassword/>} />
                <Route path="/*" element={<NotFound />} />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["user", "admin"]}>
                            <Dashboard />
                        </ProtectedRoute>

                    }
                />
                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute allowedRoles={["user", "admin"]}>
                            <ChangePassword />
                        </ProtectedRoute>

                    }
                />

            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </>
    );
};

const AppWrapper = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default AppWrapper;