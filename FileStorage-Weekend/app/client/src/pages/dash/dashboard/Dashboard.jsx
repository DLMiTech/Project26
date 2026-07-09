import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const Dashboard = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;

    const [overview, setOverview] = useState(null);
    const [myInfo, setMyInfo] = useState(null);
    const [lectureDash, setLectureDash] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOverview = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/dashboard/overview`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setOverview(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch overview', err.message);
        }
    }, []);

    const fetchMyInfo = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/dashboard/me`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setMyInfo(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch my info', err.message);
        }
    }, []);

    const fetchLectureDash = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/dashboard/lecture`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setLectureDash(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch lecture dashboard', err.message);
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            if (role === 'hod') {
                await fetchOverview();
            } else {
                await Promise.all([fetchMyInfo(), fetchLectureDash()]);
            }
            setLoading(false);
        };
        load();
    }, [role, fetchOverview, fetchMyInfo, fetchLectureDash]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const StatCard = ({ icon, iconBg, iconColor, label, value, subValue, trend }) => (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                         style={{ width: 48, height: 48, background: iconBg }}>
                        <i className={`bi ${icon} fs-4`} style={{ color: iconColor }}></i>
                    </div>
                    <div className="flex-fill">
                        <h6 className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{label}</h6>
                    </div>
                    {trend && (
                        <span className="badge fw-semibold" style={{
                            background: trend > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: trend > 0 ? '#22c55e' : '#ef4444',
                            fontSize: '0.75rem'
                        }}>
                            <i className={`bi bi-arrow-${trend > 0 ? 'up' : 'down'} me-1`}></i>
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                <h3 className="fw-bold mb-1" style={{ color: '#1e293b' }}>{value}</h3>
                {subValue && <small className="text-muted">{subValue}</small>}
            </div>
        </div>
    );

    const SectionHeader = ({ title, icon, action }) => (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                <i className={`bi ${icon} me-2`} style={{ color: '#2563eb' }}></i>
                {title}
            </h5>
            {action}
        </div>
    );

    const StatusBadge = ({ status }) => {
        const styles = {
            approve: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' },
            decline: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
            pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }
        };
        const s = styles[status] || styles.pending;
        return (
            <span className="badge fw-semibold" style={{ background: s.bg, color: s.color, fontSize: '0.75rem' }}>
                {status?.toUpperCase()}
            </span>
        );
    };

    // ==================== HOD DASHBOARD ====================
    if (role === 'hod') {
        if (loading) {
            return (
                <DashLayout>
                    <section className="dashboard-body d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                        <div className="text-center">
                            <div className="spinner-border mb-3" style={{ color: '#2563eb', width: 48, height: 48 }} role="status"></div>
                            <p className="text-muted">Loading dashboard...</p>
                        </div>
                    </section>
                </DashLayout>
            );
        }

        const users = overview?.users || {};
        const access = overview?.access_control || {};
        const courses = overview?.courses || {};
        const repos = overview?.repositories || {};
        const uploads = overview?.uploads || {};
        const activity = overview?.recent_activity || [];

        return (
            <DashLayout>
                <section className="dashboard-body">
                    {/* Welcome Header */}
                    <div className="card border-0 shadow-sm mb-4" style={{
                        background: 'linear-gradient(135deg, #0ab39c, #405189)',
                        color: '#fff'
                    }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="fw-bold mb-1">{getGreeting()}, {myInfo?.user?.name || 'Admin'}!</h3>
                                    <p className="mb-0 opacity-75">Here's what's happening in your system today.</p>
                                </div>
                                <div className="d-none d-md-block">
                                    <i className="bi bi-speedometer2" style={{ fontSize: 64, opacity: 0.2 }}></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Stats Row */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <StatCard
                                icon="bi-people"
                                iconBg="rgba(37, 99, 235, 0.1)"
                                iconColor="#2563eb"
                                label="Total Users"
                                value={users.total || 0}
                                subValue={`${users.new_this_month || 0} new this month`}
                            />
                        </div>
                        <div className="col-md-3">
                            <StatCard
                                icon="bi-book"
                                iconBg="rgba(14, 165, 233, 0.1)"
                                iconColor="#0ea5e9"
                                label="Total Courses"
                                value={courses.total || 0}
                                subValue={`${courses.total_assignments || 0} lecture assignments`}
                            />
                        </div>
                        <div className="col-md-3">
                            <StatCard
                                icon="bi-files"
                                iconBg="rgba(139, 92, 246, 0.1)"
                                iconColor="#8b5cf6"
                                label="Total Uploads"
                                value={uploads.total || 0}
                                subValue={`${uploads.this_month || 0} this month`}
                            />
                        </div>
                        <div className="col-md-3">
                            <StatCard
                                icon="bi-archive"
                                iconBg="rgba(34, 197, 94, 0.1)"
                                iconColor="#22c55e"
                                label="Repositories"
                                value={repos.total || 0}
                                subValue={repos.latest ? `Latest: ${repos.latest.year}` : '-'}
                            />
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        {/* Users Breakdown */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-white border-bottom py-3">
                                    <SectionHeader title="Users by Role" icon="bi-person-badge" />
                                </div>
                                <div className="card-body">
                                    {(users.by_role || []).map((r) => (
                                        <div key={r.role} className="d-flex align-items-center mb-3">
                                            <div className="flex-fill">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="fw-semibold text-capitalize" style={{ color: '#1e293b' }}>{r.role}</span>
                                                    <span className="fw-bold" style={{ color: '#2563eb' }}>{r.count}</span>
                                                </div>
                                                <div className="progress" style={{ height: 8, background: '#f1f5f9' }}>
                                                    <div className="progress-bar" style={{
                                                        width: `${(parseInt(r.count) / (users.total || 1)) * 100}%`,
                                                        background: 'linear-gradient(135deg, #0ab39c, #405189)'
                                                    }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Access Control Status */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-white border-bottom py-3">
                                    <SectionHeader title="Access Requests" icon="bi-shield-check" />
                                </div>
                                <div className="card-body">
                                    <div className="row g-3 text-center mb-3">
                                        {(access.by_status || []).map((s) => {
                                            const colors = {
                                                approve: { bg: '#22c55e', light: 'rgba(34, 197, 94, 0.1)' },
                                                decline: { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
                                                pending: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' }
                                            };
                                            const c = colors[s.status] || colors.pending;
                                            return (
                                                <div key={s.status} className="col-4">
                                                    <div className="p-2 rounded-3" style={{ background: c.light }}>
                                                        <h4 className="fw-bold mb-0" style={{ color: c.bg }}>{s.count}</h4>
                                                        <small className="text-muted text-capitalize">{s.status}</small>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                        {(access.by_level || []).map((l) => (
                                            <span key={l.access_level} className="badge fw-semibold" style={{
                                                background: 'rgba(37, 99, 235, 0.1)',
                                                color: '#2563eb',
                                                fontSize: '0.8rem'
                                            }}>
                                                {l.access_level}: {l.count}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Requests */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-white border-bottom py-3">
                                    <SectionHeader
                                        title="Pending Requests"
                                        icon="bi-clock-history"
                                        action={
                                            (access.pending_requests || []).length > 0 && (
                                                <a href="/access-control" className="btn btn-sm fw-semibold" style={{
                                                    background: 'rgba(245, 158, 11, 0.1)',
                                                    color: '#f59e0b',
                                                    border: 'none'
                                                }}>
                                                    View All
                                                </a>
                                            )
                                        }
                                    />
                                </div>
                                <div className="card-body p-0">
                                    {(access.pending_requests || []).length === 0 ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-check-circle fs-2 mb-2 d-block" style={{ color: '#22c55e' }}></i>
                                            <small>No pending requests</small>
                                        </div>
                                    ) : (
                                        <div className="list-group list-group-flush">
                                            {(access.pending_requests || []).slice(0, 5).map((req) => (
                                                <div key={req.id} className="list-group-item d-flex align-items-center py-3">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                         style={{
                                                             width: 36,
                                                             height: 36,
                                                             background: 'linear-gradient(135deg, #0ab39c, #405189)'
                                                         }}>
                                                        <span className="text-white fw-bold" style={{ fontSize: 12 }}>
                                                            {req.name?.charAt(0)?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill min-width-0">
                                                        <div className="fw-semibold text-truncate" style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                                                            {req.name}
                                                        </div>
                                                        <small className="text-muted text-truncate d-block">
                                                            {req.course_title} • {req.access_level}
                                                        </small>
                                                    </div>
                                                    <StatusBadge status="pending" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Uploads by Course & Recent Activity */}
                    <div className="row g-4 mb-4">
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-white border-bottom py-3">
                                    <SectionHeader title="Uploads by Course" icon="bi-bar-chart" />
                                </div>
                                <div className="card-body">
                                    {(uploads.by_course || []).length === 0 ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-graph-up fs-2 mb-2 d-block" style={{ color: '#cbd5e1' }}></i>
                                            <small>No upload data available</small>
                                        </div>
                                    ) : (
                                        (uploads.by_course || []).map((c, idx) => (
                                            <div key={idx} className="d-flex align-items-center mb-3">
                                                <div className="flex-fill">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="fw-semibold" style={{
                                                            color: '#1e293b',
                                                            fontSize: '0.9rem',
                                                            maxWidth: '70%',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>{c.course_title}</span>
                                                        <span className="fw-bold" style={{ color: '#2563eb' }}>{c.upload_count}</span>
                                                    </div>
                                                    <div className="progress" style={{ height: 6, background: '#f1f5f9' }}>
                                                        <div className="progress-bar" style={{
                                                            width: `${Math.min((parseInt(c.upload_count) / (uploads.total || 1)) * 100 * 5, 100)}%`,
                                                            background: 'linear-gradient(135deg, #0ab39c, #405189)'
                                                        }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-white border-bottom py-3">
                                    <SectionHeader title="Recent Activity" icon="bi-activity" />
                                </div>
                                <div className="card-body p-0">
                                    {activity.length === 0 ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-inbox fs-2 mb-2 d-block" style={{ color: '#cbd5e1' }}></i>
                                            <small>No recent activity</small>
                                        </div>
                                    ) : (
                                        <div className="list-group list-group-flush">
                                            {activity.map((act, idx) => (
                                                <div key={idx} className="list-group-item d-flex align-items-center py-3">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                         style={{
                                                             width: 36,
                                                             height: 36,
                                                             background: act.type === 'upload'
                                                                 ? 'rgba(37, 99, 235, 0.1)'
                                                                 : 'rgba(139, 92, 246, 0.1)'
                                                         }}>
                                                        <i className={`bi ${act.type === 'upload' ? 'bi-cloud-upload' : 'bi-key'} fs-5`}
                                                           style={{ color: act.type === 'upload' ? '#2563eb' : '#8b5cf6' }}></i>
                                                    </div>
                                                    <div className="flex-fill min-width-0">
                                                        <div className="fw-semibold" style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                                                            {act.type === 'upload' ? 'File Uploaded' : 'Access Requested'}
                                                        </div>
                                                        <small className="text-muted">
                                                            {act.user_name} • {act.course_title}
                                                        </small>
                                                    </div>
                                                    <small className="text-muted flex-shrink-0">
                                                        {new Date(act.created_at).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3" style={{ color: '#1e293b' }}>
                                <i className="bi bi-lightning me-2" style={{ color: '#f59e0b' }}></i>
                                Quick Actions
                            </h5>
                            <div className="row g-3">
                                {[
                                    { icon: 'bi-plus-circle', label: 'Add Course', color: '#2563eb', href: '/courses' },
                                    { icon: 'bi-person-plus', label: 'Assign Lecture', color: '#0ea5e9', href: '/lecture-courses' },
                                    { icon: 'bi-folder-plus', label: 'Create Repository', color: '#8b5cf6', href: '/repository' },
                                    { icon: 'bi-shield-check', label: 'Access Control', color: '#22c55e', href: '/access-control' },
                                    { icon: 'bi-cloud-upload', label: 'View Uploads', color: '#f59e0b', href: '/uploads' },
                                    // { icon: 'bi-people', label: 'Manage Users', color: '#ec4899', href: '/users' }
                                ].map((action, idx) => (
                                    <div key={idx} className="col-6 col-md-4 col-lg-2">
                                        <a href={action.href} className="card border-0 text-center text-decoration-none p-3 h-100"
                                           style={{
                                               background: `${action.color}08`,
                                               transition: 'all 0.2s'
                                           }}
                                           onMouseEnter={(e) => {
                                               e.currentTarget.style.background = `${action.color}15`;
                                               e.currentTarget.style.transform = 'translateY(-2px)';
                                           }}
                                           onMouseLeave={(e) => {
                                               e.currentTarget.style.background = `${action.color}08`;
                                               e.currentTarget.style.transform = 'translateY(0)';
                                           }}>
                                            <i className={`bi ${action.icon} fs-2 mb-2 d-block`} style={{ color: action.color }}></i>
                                            <span className="fw-semibold" style={{ color: '#1e293b', fontSize: '0.85rem' }}>{action.label}</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </DashLayout>
        );
    }

    // ==================== LECTURE DASHBOARD ====================
    if (loading) {
        return (
            <DashLayout>
                <section className="dashboard-body d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center">
                        <div className="spinner-border mb-3" style={{ color: '#2563eb', width: 48, height: 48 }} role="status"></div>
                        <p className="text-muted">Loading your dashboard...</p>
                    </div>
                </section>
            </DashLayout>
        );
    }

    const user = myInfo?.user || {};
    const stats = myInfo?.stats || {};
    const myAccess = lectureDash?.my_access || {};
    const recentActivity = lectureDash?.recent_activity || [];

    return (
        <DashLayout>
            <section className="dashboard-body">
                {/* Welcome Header */}
                <div className="card border-0 shadow-sm mb-4" style={{
                    background: 'linear-gradient(135deg, #0ab39c, #405189)',
                    color: '#fff'
                }}>
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="fw-bold mb-1">{getGreeting()}, {user.name || 'Lecturer'}!</h3>
                                <p className="mb-0 opacity-75">Welcome back to your course management portal.</p>
                            </div>
                            <div className="d-none d-md-block text-end">
                                <div className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                     style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.2)' }}>
                                    <span className="fw-bold" style={{ fontSize: 24 }}>{user.name?.charAt(0)?.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Stats Row */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <StatCard
                            icon="bi-key"
                            iconBg="rgba(37, 99, 235, 0.1)"
                            iconColor="#2563eb"
                            label="Access Requests"
                            value={stats?.access_requests?.total || 0}
                            subValue={`${stats?.access_requests?.approved || 0} approved`}
                        />
                    </div>
                    <div className="col-md-3">
                        <StatCard
                            icon="bi-check-circle"
                            iconBg="rgba(34, 197, 94, 0.1)"
                            iconColor="#22c55e"
                            label="Approved Access"
                            value={stats?.access_requests?.approved || 0}
                        />
                    </div>
                    <div className="col-md-3">
                        <StatCard
                            icon="bi-clock"
                            iconBg="rgba(245, 158, 11, 0.1)"
                            iconColor="#f59e0b"
                            label="Pending"
                            value={stats?.access_requests?.pending || 0}
                        />
                    </div>
                    <div className="col-md-3">
                        <StatCard
                            icon="bi-cloud-upload"
                            iconBg="rgba(139, 92, 246, 0.1)"
                            iconColor="#8b5cf6"
                            label="My Uploads"
                            value={stats?.total_uploads || 0}
                        />
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    {/* My Access Status */}
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-bottom py-3">
                                <SectionHeader
                                    title="My Access Status"
                                    icon="bi-shield-check"
                                    action={
                                        <a href="/access-control" className="btn btn-sm fw-semibold" style={{
                                            background: 'rgba(37, 99, 235, 0.1)',
                                            color: '#2563eb',
                                            border: 'none'
                                        }}>
                                            Manage
                                        </a>
                                    }
                                />
                            </div>
                            <div className="card-body">
                                <div className="row g-3 text-center">
                                    {[
                                        { label: 'Approved', value: stats?.access_requests?.approved || 0, color: '#22c55e', icon: 'bi-check-circle' },
                                        { label: 'Pending', value: stats?.access_requests?.pending || 0, color: '#f59e0b', icon: 'bi-clock' },
                                        { label: 'Declined', value: stats?.access_requests?.declined || 0, color: '#ef4444', icon: 'bi-x-circle' }
                                    ].map((item) => (
                                        <div key={item.label} className="col-4">
                                            <div className="p-3 rounded-3" style={{ background: `${item.color}10` }}>
                                                <i className={`bi ${item.icon} fs-3 mb-2 d-block`} style={{ color: item.color }}></i>
                                                <h4 className="fw-bold mb-0" style={{ color: item.color }}>{item.value}</h4>
                                                <small className="text-muted">{item.label}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-bottom py-3">
                                <SectionHeader title="Quick Actions" icon="bi-lightning" />
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {[
                                        { icon: 'bi-key', label: 'Request Access', desc: 'Get course permissions', color: '#2563eb', href: '/access-control' },
                                        { icon: 'bi-book', label: 'My Courses', desc: 'View assigned courses', color: '#0ea5e9', href: '/lecture-courses' },
                                        { icon: 'bi-cloud-upload', label: 'Upload Files', desc: 'Share course materials', color: '#8b5cf6', href: '/uploads' },
                                        // { icon: 'bi-folder', label: 'Browse Repositories', desc: 'Access course content', color: '#22c55e', href: '/repositories' }
                                    ].map((action, idx) => (
                                        <div key={idx} className="col-6">
                                            <a href={action.href} className="card border-0 text-decoration-none p-3 h-100"
                                               style={{
                                                   background: `${action.color}08`,
                                                   transition: 'all 0.2s'
                                               }}
                                               onMouseEnter={(e) => {
                                                   e.currentTarget.style.background = `${action.color}15`;
                                                   e.currentTarget.style.transform = 'translateY(-2px)';
                                               }}
                                               onMouseLeave={(e) => {
                                                   e.currentTarget.style.background = `${action.color}08`;
                                                   e.currentTarget.style.transform = 'translateY(0)';
                                               }}>
                                                <i className={`bi ${action.icon} fs-3 mb-2 d-block`} style={{ color: action.color }}></i>
                                                <div className="fw-semibold" style={{ color: '#1e293b', fontSize: '0.9rem' }}>{action.label}</div>
                                                <small className="text-muted">{action.desc}</small>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom py-3">
                        <SectionHeader title="Recent Activity" icon="bi-activity" />
                    </div>
                    <div className="card-body p-0">
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-inbox fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                                <p className="mb-0">No recent activity to show</p>
                            </div>
                        ) : (
                            <div className="list-group list-group-flush">
                                {recentActivity.map((act, idx) => (
                                    <div key={idx} className="list-group-item d-flex align-items-center py-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                             style={{
                                                 width: 40,
                                                 height: 40,
                                                 background: act.type === 'upload'
                                                     ? 'rgba(37, 99, 235, 0.1)'
                                                     : 'rgba(139, 92, 246, 0.1)'
                                             }}>
                                            <i className={`bi ${act.type === 'upload' ? 'bi-cloud-upload' : 'bi-key'} fs-5`}
                                               style={{ color: act.type === 'upload' ? '#2563eb' : '#8b5cf6' }}></i>
                                        </div>
                                        <div className="flex-fill min-width-0">
                                            <div className="fw-semibold" style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                                                {act.type === 'upload' ? 'File Uploaded' : 'Access Requested'}
                                            </div>
                                            <small className="text-muted d-block text-truncate">
                                                {act.course_title}
                                            </small>
                                        </div>
                                        <small className="text-muted flex-shrink-0">
                                            {new Date(act.created_at).toLocaleDateString()}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </DashLayout>
    );
};

export default Dashboard;