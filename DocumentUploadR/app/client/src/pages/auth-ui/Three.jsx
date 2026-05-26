// SplitCardLogin.jsx

import "./Three.scss";

export default function Three() {
    return (
        <div className="split-login-page">

            {/* Floating Glow */}
            <div className="glow glow-1"></div>
            <div className="glow glow-2"></div>

            <div className="split-login-card row g-0">

                {/* LEFT PANEL */}
                <div className="col-lg-5 left-panel">

                    <div className="left-content">

                        <div className="brand">
                            <div className="brand-circle">
                                <i className="ri-code-box-line"></i>
                            </div>

                            <h2>DLMiTech</h2>
                        </div>

                        <span className="mini-tag">
              Digital Experience Platform
            </span>

                        <h1>
                            Secure access <br />
                            to your workspace
                        </h1>

                        <p>
                            Collaborate, manage projects and scale your
                            digital products with a modern experience.
                        </p>

                        <div className="analytics-box">

                            <div className="analytics-item">
                                <h3>150+</h3>
                                <span>Projects</span>
                            </div>

                            <div className="analytics-item">
                                <h3>99.9%</h3>
                                <span>Uptime</span>
                            </div>

                            <div className="analytics-item">
                                <h3>24/7</h3>
                                <span>Support</span>
                            </div>

                        </div>

                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="col-lg-7 right-panel">

                    <div className="login-form-wrapper">

                        <div className="top-row">
                            <div>
                                <h2>Login Account</h2>
                                <p>Welcome back, continue your session</p>
                            </div>

                            <button className="theme-btn">
                                <i className="ri-moon-line"></i>
                            </button>
                        </div>

                        {/* Email */}
                        <div className="custom-input">
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
                        <div className="custom-input">
                            <div className="label-flex">
                                <label>Password</label>

                                <a href="/">Forgot Password?</a>
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
                        <div className="remember-flex">

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="rememberCheck"
                                />

                                <label
                                    className="form-check-label"
                                    htmlFor="rememberCheck"
                                >
                                    Remember me
                                </label>
                            </div>

                        </div>

                        {/* Login Button */}
                        <button className="login-button">
                            Sign In
                        </button>

                        {/* Divider */}
                        <div className="divider">
                            <span>Continue with</span>
                        </div>

                        {/* Social */}
                        <div className="social-grid">

                            <button className="social-btn">
                                <i className="ri-google-fill"></i>
                            </button>

                            <button className="social-btn">
                                <i className="ri-github-fill"></i>
                            </button>

                            <button className="social-btn">
                                <i className="ri-facebook-fill"></i>
                            </button>

                            <button className="social-btn">
                                <i className="ri-twitter-x-fill"></i>
                            </button>

                        </div>

                        {/* Bottom */}
                        <p className="bottom-link">
                            Don’t have an account?
                            <a href="/"> Create one</a>
                        </p>

                    </div>

                </div>

            </div>
        </div>
    );
}