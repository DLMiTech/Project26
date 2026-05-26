import React from 'react';
import {Link, useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/verification", {state: 'loginVerification'});
    }
    return (
        <div>
            <h1>Login Page</h1>

            <Link to={`/forgot-password`}>Forgot password?</Link>
            <p>Dont have an account? <Link to={`/register`}>Register</Link></p>

            <button onClick={handleLogin}>LOGIN</button>
        </div>
    );
};

export default Login;