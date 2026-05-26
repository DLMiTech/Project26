import React from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./AppRoutes.jsx";
import {Bounce, ToastContainer} from "react-toastify";

const App = () => {
    return (
        <BrowserRouter>
            <AppRoutes />

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
        </BrowserRouter>
    );
};

export default App;