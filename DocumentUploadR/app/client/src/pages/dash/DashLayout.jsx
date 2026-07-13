// DashLayout.jsx
import React, { useState } from "react";
import "remixicon/fonts/remixicon.css";
import "./DashLayout.scss";
import logo from '../../assets/logo/compssa-logo.png'
import AuthVerify from "../../service/AuthVerify.jsx";
import {NavLink, useNavigate} from "react-router-dom";
import AuthRequest from "../../request/auth.jsx";
import {toast} from "react-toastify";

const menuItems = [
    {
        icon: "ri-dashboard-fill",
        label: "Dashboard",
        to: "/dashboard",
        roles: ['lecture','hod'],
    },
    {
        icon: "ri-git-repository-private-fill",
        label: "Access Control",
        to: "/access-control",
        roles: ['lecture', 'hod'],
    },
    {
        icon: "ri-folder-2-fill",
        label: "Repositories",
        to: "/repositories",
        roles: ['hod'],
    },
    {
        icon: "ri-cloud-fill",
        label: "Uploads",
        to: "/uploads",
        roles: ['lecture', 'hod'],
    },

];

const generalItems = [
    {
        icon: "ri-anticlockwise-fill",
        label: "Courses",
        to: "/courses",
        roles: ['lecture','hod'],
    },
    {
        icon: "ri-folder-user-fill",
        label: "Lecture Courses",
        to: "/lecture-courses",
        roles: ['lecture','hod'],
    },

];

export default function DashLayout({children}) {
    const [showSidebar, setShowSidebar] = useState(false);
    const currentYear = new Date().getFullYear();
    const userData = AuthVerify.decodeToken();
    const navigate = useNavigate();
    const role = userData?.role;
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const payload = {}
            const res = await AuthRequest.logout(payload);

            if (res?.status === 200) {
                toast.success(res?.message);
                AuthVerify.logout()
                navigate('/login')
            }else {
                toast.error(res?.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${showSidebar ? "show" : ""}`}>
                <div className="logo">
                    <div className="logo-icon">
                        <img src={logo} alt={logo}/>
                    </div>

                    <h4 className={`app-name`}>COMPSSA</h4>
                </div>

                <div className="menu-section">
                    <p className="menu-title">MENU</p>

                    {menuItems
                        .filter((item) => item.roles.includes(role))
                        .map((item, index) => (
                            <NavLink
                                to={item.to}
                                key={index}
                                className={({ isActive }) =>
                                    `menu-item ${isActive ? "active" : ""}`
                                }
                                onClick={() => setShowSidebar(false)}
                            >
                                <i className={item.icon}></i>

                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                </div>

                <div className="menu-section">
                    <p className="menu-title">GENERAL</p>

                    {generalItems
                        .filter((item) => item.roles.includes(role))
                        .map((item, index) => (
                            <NavLink
                                to={item.to}
                                key={index}
                                className={({ isActive }) =>
                                    `menu-item ${isActive ? "active" : ""}`
                                }
                                onClick={() => setShowSidebar(false)}
                            >
                                <i className={item.icon}></i>

                                <span>{item.label}</span>
                            </NavLink>
                        ))}

                    <div className={`logout`} onClick={() => handleLogout()}>
                        <i className="ri-logout-box-r-line"></i>
                        <span>
                            {loading ? "Logging out ..." : "Logout"}
                        </span>
                    </div>
                </div>

                <div className="download-card">
                    <small>Version 1.0.1</small>
                    <small>© {currentYear} KTU COMPSSA. Powered by DLMiTech</small>
                </div>
            </aside>

            {/* Overlay */}
            {showSidebar && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setShowSidebar(false)}
                ></div>
            )}

            {/* Main */}
            <main className="main-content">
                {/* Navbar */}
                <nav className="top-navbar">
                    <div className="left">
                        <button
                            className="menu-toggle"
                            onClick={() => setShowSidebar(!showSidebar)}
                        >
                            <i className="ri-menu-line"></i>
                        </button>

                        <div className="search-box">
                            <i className="ri-search-line"></i>

                            <input type="text" placeholder="Search task..." />
                        </div>
                    </div>

                    <div className="right">

                        <div className="profile">
                            <div>
                                <h6>{userData?.name}</h6>
                                <p>{userData?.email}</p>
                            </div>
                            <img
                                src="https://i.pravatar.cc/100"
                                alt="profile"
                            />
                        </div>
                    </div>
                </nav>

                {/* Body */}
                {children}
            </main>
        </div>
    );
}