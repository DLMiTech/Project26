
import "./One.scss";

export default function One() {
    return (
        <div className="modern-login-page">

            {/* LEFT CONTENT */}
            <div className="login-content">

                <div className="brand">
                    <div className="brand-icon">
                        <i className="ri-code-s-slash-line"></i>
                    </div>

                    <div>
                        <h2>DLMiTech</h2>
                        <p>Software Development Platform</p>
                    </div>
                </div>

                <div className="hero-text">
          <span className="badge-text">
            Welcome Back 👋
          </span>

                    <h1>
                        Build smarter <br />
                        digital products
                    </h1>

                    <p>
                        Access your dashboard, manage your projects,
                        and continue building amazing experiences.
                    </p>
                </div>

                <div className="features row">
                    <div className="col-6">
                        <div className="feature-card">
                            <i className="ri-flashlight-line"></i>
                            <h5>Fast Performance</h5>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="feature-card">
                            <i className="ri-shield-check-line"></i>
                            <h5>Secure Access</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT LOGIN CARD */}
            <div className="login-card">

                <div className="card-top">
                    <h2>Sign In</h2>

                    <p>
                        Enter your credentials to continue
                    </p>
                </div>

                {/* Email */}
                <div className="auth-input-wrapper">
                    <label>Email Address</label>

                    <i className="ri-mail-line left-icon"></i>

                    <input
                        type="email"
                        className="form-control auth-input"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Password */}
                <div className="auth-input-wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <label>Password</label>

                        <a href="/" className="forgot-link">
                            Forgot?
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

                {/* Remember */}
                <div className="remember-row">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="remember"
                        />

                        <label
                            className="form-check-label"
                            htmlFor="remember"
                        >
                            Remember me
                        </label>
                    </div>
                </div>

                {/* Button */}
                <button className="login-btn">
                    Sign In
                </button>

                {/* Divider */}
                <div className="divider">
                    <span>Or continue with</span>
                </div>

                {/* Social */}
                <div className="social-login">
                    <button>
                        <i className="ri-google-fill"></i>
                    </button>

                    <button>
                        <i className="ri-github-fill"></i>
                    </button>

                    <button>
                        <i className="ri-facebook-fill"></i>
                    </button>
                </div>

                {/* Bottom */}
                <p className="bottom-text">
                    Don’t have an account?
                    <a href="/"> Create account</a>
                </p>
            </div>
        </div>
    );
}