import React from 'react';
import './Auth.scss'

const AuthLayout = ({children}) => {
    const currentYear = new Date().getFullYear();
    return (
        <div className="auth-page">
            <div className={`container`}>
                <div className="auth-wrapper row g-0">
                    {/* LEFT SIDE */}
                    <div className="col-lg-6 auth-left">
                        <div className="overlay"></div>

                        <div className="content">
                            <h1 className="logo">COMPASS</h1>
                            <p>Examination script upload and management</p>

                            <div className="quote-box">
                                <i className="ri-double-quotes-l quote-icon"></i>

                                <p>
                                    "I think it is in collaboration that the nature of art is revealed."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-lg-6 auth-right">
                        {children}
                    </div>
                </div>

                <div className="footer">
                    © {currentYear} KTU COMPASS. Powered by DLMiTech
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;