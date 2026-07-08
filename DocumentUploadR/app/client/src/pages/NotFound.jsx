import React from 'react';
import { Link } from 'react-router-dom';
import AuthVerify from "../service/AuthVerify.jsx";

const NotFound = () => {
    const userData = AuthVerify.decodeToken();
    const isLoggedIn = !!userData?.id;

    // Determine where to send user back
    const backLink = isLoggedIn
        ? userData?.role === 'hod' ? '/dashboard' : '/dashboard'
        : '/';

    const backLabel = isLoggedIn ? 'Back to Dashboard' : 'Back to Home';

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center"
             style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #dbeafe 100%)' }}>

            <div className="text-center px-4">
                {/* 404 Illustration */}
                <div className="mb-4">
                    <div className="position-relative d-inline-block">
                        <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                             style={{
                                 width: 160,
                                 height: 160,
                                 background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                                 opacity: 0.1
                             }}>
                        </div>
                        <div className="position-absolute top-50 start-50 translate-middle">
                            <i className="bi bi-compass fs-1" style={{ color: '#2563eb' }}></i>
                        </div>
                    </div>
                </div>

                {/* Error Code */}
                <h1 className="fw-bold mb-2" style={{
                    fontSize: '6rem',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    404
                </h1>

                {/* Message */}
                <h3 className="fw-bold mb-3" style={{ color: '#1e293b' }}>
                    Page Not Found
                </h3>
                <p className="mb-4 mx-auto" style={{ color: '#64748b', maxWidth: 400, fontSize: '1.05rem' }}>
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Action Buttons */}
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <button
                        onClick={() => window.history.back()}
                        className="btn fw-semibold px-4"
                        style={{
                            border: '2px solid #2563eb',
                            color: '#2563eb',
                            background: 'transparent'
                        }}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Go Back
                    </button>
                    <Link
                        to={backLink}
                        className="btn text-white fw-semibold px-4"
                        style={{
                            background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                            border: 'none'
                        }}
                    >
                        <i className="bi bi-house me-2"></i>
                        {backLabel}
                    </Link>
                </div>

                {/* Logged in user info */}
                {isLoggedIn && (
                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                        <small className="text-muted">
                            Signed in as <span className="fw-semibold" style={{ color: '#2563eb' }}>{userData.name}</span>
                            {' '}({userData.email})
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotFound;