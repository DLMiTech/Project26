import React from 'react';
import {Link, useNavigate} from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const handleForgotPassword = () => {
        navigate("/verification", {state: 'forgotPasswordVerification'});
    }
    return (
        <div>
            <h1>ForgotPassword</h1>

            <button  onClick={handleForgotPassword}>Verification</button>
        </div>
    );
};

export default ForgotPassword;