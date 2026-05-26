// Login.jsx
import AuthLayout from "./AuthLayout.jsx";
import compassLogo from '../../assets/logo/compass-logo.png'
import {Link} from "react-router-dom";

export default function Register() {
    return (
        <AuthLayout>
            <div className="form-container">

                <div className={`d-flex align-items-start justify-content-between`}>
                    <div>
                        <h2 className={`header`}>Welcome Back !</h2>
                        <p className="subtitle">
                            Sign in to continue.
                        </p>
                    </div>

                    <img src={compassLogo} alt={compassLogo} className="logo" />
                </div>

                {/* Username */}
                <div className="input-wrapper">
                    <label>Username</label>

                    <i className="ri-user-3-line left-icon"></i>

                    <input
                        type="text"
                        className="form-control auth-input"
                        placeholder="Enter username"
                    />
                </div>

                {/* Password */}
                <div className="input-wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <label>Password</label>

                        <a href="/" className="forgot-link">
                            Forgot password?
                        </a>
                    </div>

                    <i className="ri-lock-password-line left-icon"></i>

                    <input
                        type="password"
                        className="form-control auth-input"
                        placeholder="Enter password"
                    />

                    <i className="ri-eye-line right-icon"></i>
                </div>

                {/* Button */}
                <button className="btn app-btn secondary">
                    Sign In
                </button>

                {/* Divider */}
                <div className="divider">
                    <span>Don’t have an account ?{" "} <Link to="/" className={`auth-link`}>Signup</Link></span>
                </div>

            </div>
        </AuthLayout>
    );
}