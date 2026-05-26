import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";


const Verification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleVerification = () => {
        const state = location.state;

        if (!state) {
            navigate("/login");
            return;
        }

        if (state === "loginVerification") {
            navigate("/dashboard");
        }

        if (state === "forgotPasswordVerification") {
            navigate("/reset-password");
        }
    };
    return (
        <div>
            <h1>Verification Page</h1>

            <button onClick={handleVerification}>
                Verify
            </button>
        </div>
    );
};

export default Verification;