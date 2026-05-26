// GlassLogin.jsx

import "./Two.scss";

export default function Two() {
    return (
        <div className="glass-login-page">

            {/* Background Shapes */}
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>

            <div className="glass-card">

                {/* LEFT */}
                <div className="glass-left">

                    <div className="top-badge">
                        <i className="ri-star-smile-line"></i>
                        Premium Access
                    </div>

                    <h1>
                        Welcome to <br />
                        DLMiTech
                    </h1>

                    <p>
                        Manage your projects, teams and digital
                        experiences from one modern dashboard.
                    </p>

                    <div className="stats-row">

                        <div className="stat-box">
                            <h3>12K+</h3>
                            <span>Users</span>
                        </div>

                        <div className="stat-box">
                            <h3>98%</h3>
                            <span>Success</span>
                        </div>

                        <div className="stat-box">
                            <h3>24/7</h3>
                            <span>Support</span>
                        </div>

                    </div>
                </div>

                {/* RIGHT */}
                <div className="glass-right">

                    <div className="login-header">
                        <h2>Sign In</h2>
                        <p>Continue your journey with us</p>
                    </div>

                    {/* Email */}
                    <div className="input-group-custom">
                        <label>Email Address</label>

                        <div className="input-box">
                            <i className="ri-mail-line left-icon"></i>

                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="input-group-custom">
                        <div className="label-row">
                            <label>Password</label>

                            <a href="/">Forgot?</a>
                        </div>

                        <div className="input-box">
                            <i className="ri-lock-password-line left-icon"></i>

                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                            />

                            <i className="ri-eye-line right-icon"></i>
                        </div>
                    </div>

                    {/* Remember */}
                    <div className="remember-row">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="rememberMe"
                            />

                            <label
                                className="form-check-label"
                                htmlFor="rememberMe"
                            >
                                Remember me
                            </label>
                        </div>
                    </div>

                    {/* Button */}
                    <button className="login-btn">
                        Login Account
                    </button>

                    {/* Divider */}
                    <div className="divider">
                        <span>or continue with</span>
                    </div>

                    {/* Social */}
                    <div className="social-row">

                        <button>
                            <i className="ri-google-fill"></i>
                        </button>

                        <button>
                            <i className="ri-github-fill"></i>
                        </button>

                        <button>
                            <i className="ri-twitter-x-fill"></i>
                        </button>

                    </div>

                    {/* Bottom */}
                    <p className="bottom-text">
                        Don’t have an account?
                        <a href="/"> Register</a>
                    </p>

                </div>
            </div>
        </div>
    );
}