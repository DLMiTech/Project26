import React from 'react';
import { Link } from "react-router-dom";
import compassLogo from "../assets/logo/compssa-logo.png";

const Index = () => {
    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #dbeafe 100%)' }}>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg py-3">
                <div className="container">
                    <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/" style={{ color: '#1e293b' }}>
                        <img src={compassLogo} alt={compassLogo} className={`logo`} style={{width: 50, height: 50}}/>
                        <span>ExamsRepo</span>
                    </Link>
                    <div className="d-flex gap-2">
                        <Link to="/login" className="btn fw-semibold" style={{ color: '#2563eb' }}>
                            Sign In
                        </Link>
                        <Link to="/login" className="btn text-white fw-semibold px-4"
                              style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}>
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex-fill d-flex align-items-center">
                <div className="container py-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <span className="badge fw-semibold px-3 py-2" style={{
                                    background: 'rgba(37, 99, 235, 0.1)',
                                    color: '#2563eb',
                                    fontSize: '0.85rem'
                                }}>
                                    <i className="bi bi-stars me-1"></i>
                                    Exams Script Repository
                                </span>
                            </div>
                            <h1 className="fw-bold mb-4" style={{
                                color: '#1e293b',
                                fontSize: '3.2rem',
                                lineHeight: 1.2
                            }}>
                                Manage Examination Script <span style={{
                                background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Efficiently</span>
                            </h1>
                            <p className="mb-4" style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.7 }}>
                                A secure platform for the department to upload and access all exams papers
                                Controlled access with role-based permissions for HODs and lecturers.
                            </p>
                            <div className="d-flex gap-3 mb-5">
                                <Link to="/login" className="btn btn-lg text-white fw-semibold px-5"
                                      style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}>
                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                    Sign In
                                </Link>
                                <a href="#features" className="btn btn-lg fw-semibold px-4"
                                   style={{ border: '2px solid #2563eb', color: '#2563eb' }}>
                                    Learn More
                                </a>
                            </div>
                            <div className="d-flex gap-4">
                                {[
                                    { icon: 'bi-shield-check', label: 'Secure Access' },
                                    { icon: 'bi-folder-check', label: 'Organized Storage' },
                                    { icon: 'bi-people', label: 'Team Collaboration' }
                                ].map((item, idx) => (
                                    <div key={idx} className="d-flex align-items-center gap-2">
                                        <i className={`bi ${item.icon}`} style={{ color: '#22c55e' }}></i>
                                        <small className="fw-semibold" style={{ color: '#475569' }}>{item.label}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative">
                                {/* Main card */}
                                <div className="card border-0 shadow-lg" style={{
                                    borderRadius: 20,
                                    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                                    transform: 'rotate(-2deg)'
                                }}>
                                    <div className="card-body p-5 text-white">
                                        <div className="d-flex align-items-center gap-3 mb-4">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center"
                                                 style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.2)' }}>
                                                <i className="bi bi-folder2-open fs-3"></i>
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-0">Course Repository</h5>
                                                <small className="opacity-75">2025 / 1st Semester</small>
                                            </div>
                                        </div>
                                        {[
                                            { icon: 'bi-file-earmark-pdf', name: 'CS101_JavaI.pdf', size: '2.4 MB', color: '#fca5a5' },
                                            { icon: 'bi-file-earmark-word', name: 'CS201_Research.docx', size: '1.1 MB', color: '#93c5fd' },
                                            { icon: 'bi-file-earmark-excel', name: 'CS2002_C++.xlsx', size: '856 KB', color: '#86efac' }
                                        ].map((file, idx) => (
                                            <div key={idx} className="d-flex align-items-center gap-3 mb-3 p-3 rounded-3"
                                                 style={{ background: 'rgba(255,255,255,0.15)' }}>
                                                <i className={`bi ${file.icon} fs-4`} style={{ color: file.color }}></i>
                                                <div className="flex-fill">
                                                    <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{file.name}</div>
                                                    <small className="opacity-75">{file.size}</small>
                                                </div>
                                                <i className="bi bi-check-circle-fill opacity-75"></i>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Floating badge */}
                                <div className="position-absolute" style={{ bottom: -20, right: 30 }}>
                                    <div className="card border-0 shadow-sm px-4 py-3 d-flex align-items-center gap-3"
                                         style={{ borderRadius: 12 }}>
                                        <div className="rounded-circle d-flex align-items-center justify-content-center"
                                             style={{ width: 40, height: 40, background: 'rgba(34, 197, 94, 0.1)' }}>
                                            <i className="bi bi-check-lg fs-5" style={{ color: '#22c55e' }}></i>
                                        </div>
                                        <div>
                                            <div className="fw-bold" style={{ color: '#1e293b' }}>Access Granted</div>
                                            <small className="text-muted">HOD approved your request</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            {/*<div id="features" className="py-5" style={{ background: '#fff' }}>*/}
            {/*    <div className="container py-5">*/}
            {/*        <div className="text-center mb-5">*/}
            {/*            <h2 className="fw-bold mb-3" style={{ color: '#1e293b' }}>Everything You Need</h2>*/}
            {/*            <p className="mx-auto" style={{ color: '#64748b', maxWidth: 500 }}>*/}
            {/*                Streamlined document management designed for academic institutions*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*        <div className="row g-4">*/}
            {/*            {[*/}
            {/*                {*/}
            {/*                    icon: 'bi-shield-lock',*/}
            {/*                    color: '#2563eb',*/}
            {/*                    title: 'Role-Based Access',*/}
            {/*                    desc: 'HODs manage permissions, lecturers upload and access course materials securely.'*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    icon: 'bi-folder-tree',*/}
            {/*                    color: '#0ea5e9',*/}
            {/*                    title: 'Organized Structure',*/}
            {/*                    desc: 'Repository → Semester → Course hierarchy keeps everything neatly organized.'*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    icon: 'bi-clock-history',*/}
            {/*                    color: '#8b5cf6',*/}
            {/*                    title: 'Time-Bound Access',*/}
            {/*                    desc: 'Grant access for specific periods with automatic expiration handling.'*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    icon: 'bi-file-earmark-zip',*/}
            {/*                    color: '#22c55e',*/}
            {/*                    title: 'Bulk Downloads',*/}
            {/*                    desc: 'Download individual files or zip entire course repositories in one click.'*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    icon: 'bi-bell',*/}
            {/*                    color: '#f59e0b',*/}
            {/*                    title: 'Email Notifications',*/}
            {/*                    desc: 'Automatic email alerts when access is granted or declined.'*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    icon: 'bi-graph-up',*/}
            {/*                    color: '#ec4899',*/}
            {/*                    title: 'Dashboard Analytics',*/}
            {/*                    desc: 'Track uploads, access requests, and user activity at a glance.'*/}
            {/*                }*/}
            {/*            ].map((feature, idx) => (*/}
            {/*                <div key={idx} className="col-md-6 col-lg-4">*/}
            {/*                    <div className="card border-0 h-100 p-4" style={{*/}
            {/*                        background: `${feature.color}08`,*/}
            {/*                        borderRadius: 16,*/}
            {/*                        transition: 'transform 0.2s'*/}
            {/*                    }}*/}
            {/*                         onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}*/}
            {/*                         onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>*/}
            {/*                        <div className="rounded-circle d-flex align-items-center justify-content-center mb-3"*/}
            {/*                             style={{ width: 52, height: 52, background: `${feature.color}15` }}>*/}
            {/*                            <i className={`bi ${feature.icon} fs-4`} style={{ color: feature.color }}></i>*/}
            {/*                        </div>*/}
            {/*                        <h5 className="fw-bold mb-2" style={{ color: '#1e293b' }}>{feature.title}</h5>*/}
            {/*                        <p className="mb-0" style={{ color: '#64748b', fontSize: '0.9rem' }}>{feature.desc}</p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* CTA Section */}
            {/*<div className="py-5" style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)' }}>*/}
            {/*    <div className="container py-4 text-center">*/}
            {/*        <h2 className="fw-bold text-white mb-3">Ready to Get Started?</h2>*/}
            {/*        <p className="text-white opacity-75 mb-4 mx-auto" style={{ maxWidth: 500 }}>*/}
            {/*            Join your institution's document management system today.*/}
            {/*        </p>*/}
            {/*        <Link to="/login" className="btn btn-lg fw-semibold px-5"*/}
            {/*              style={{ background: '#fff', color: '#2563eb', border: 'none' }}>*/}
            {/*            <i className="bi bi-box-arrow-in-right me-2"></i>*/}
            {/*            Sign In Now*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Footer */}
            <footer className="py-4" style={{ background: '#1e293b' }}>
                <div className="container text-center">
                    <p className="mb-0" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        <i className="bi bi-cloud-upload me-2"></i>
                        COMPSSA &copy; {new Date().getFullYear()}. Powered by DLMiTech.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Index;