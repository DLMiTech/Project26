import React from 'react';
import './Auth.scss'
import compassLogo from '../../assets/logo/compssa-logo.png'

const AuthLayout = ({children}) => {
    const currentYear = new Date().getFullYear();
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
                                <img src={compassLogo} alt={compassLogo} className={`logo`}/>
                            </div>

                            <h2 className={`header`}>COMPSSA</h2>
                        </div>

                        <span className="mini-tag">
                          Computer Science Student Association KTU
                        </span>

                        <h1 className={`main-header`}>
                            Exams <br />
                            Script Repository
                        </h1>

                        <div className="analytics-box">

                            <div className="analytics-item">
                                <h3>150+</h3>
                                <span>Projects</span>
                            </div>

                            <div className="analytics-item">
                                <h3>24/7</h3>
                                <span>Support</span>
                            </div>

                        </div>

                        <div className="footer">
                            © {currentYear} KTU COMPSSA. Powered by DLMiTech
                        </div>

                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="col-lg-7 right-panel">

                    {children}

                </div>

            </div>

        </div>
    );
};

export default AuthLayout;