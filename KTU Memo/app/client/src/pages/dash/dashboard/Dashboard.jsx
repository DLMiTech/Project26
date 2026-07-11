import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const Dashboard = () => {
    const userData = AuthVerify.decodeToken();
    const token = AuthVerify.getToken();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        total: 0, sent: 0, received: 0, pending: 0, approved: 0, rejected: 0
    });
    const [recentMemos, setRecentMemos] = useState([]);
    const [recentNotifications, setRecentNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [memosRes, notifRes] = await Promise.all([
                axios.get(`${BASE_URL}/memos`, axiosConfig),
                axios.get(`${BASE_URL}/notifications`, axiosConfig)
            ]);

            const memos = memosRes.data.memos || [];
            const notifications = notifRes.data.notifications || [];

            setStats({
                total: memos.length,
                sent: memos.filter(m => m.sender_id === userData?.id).length,
                received: memos.filter(m => m.recipient_id === userData?.id).length,
                pending: memos.filter(m => m.status === 'pending').length,
                approved: memos.filter(m => m.status === 'Approved').length,
                rejected: memos.filter(m => m.status === 'Rejected').length
            });

            setRecentMemos(memos.slice(0, 5));
            setRecentNotifications(notifications.slice(0, 5));
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    }, [token, userData?.id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const statCard = (title, value, icon, color, onClick) => (
        <div className="col-md-4 col-lg-2 mb-3" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div className={`card border-0 shadow-sm h-100 ${color} bg-opacity-10`} style={{ backgroundColor: `${color}15` }}>
                <div className="card-body text-center">
                    <i className={`bi ${icon} fs-2`} style={{ color }}></i>
                    <h3 className="fw-bold mt-2 mb-1">{value}</h3>
                    <small className="text-muted text-uppercase fw-semibold">{title}</small>
                </div>
            </div>
        </div>
    );

    const statusBadge = (status) => {
        const styles = { 'Draft': 'bg-secondary', 'pending': 'bg-warning text-dark', 'Approved': 'bg-success', 'Rejected': 'bg-danger' };
        return <span className={`badge ${styles[status] || 'bg-secondary'}`}>{status}</span>;
    };

    return (
        <DashLayout>
            <section className="dashboard-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold text-primary mb-1">Dashboard</h2>
                        <p className="text-muted mb-0">Welcome back, {userData?.name}!</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/memos/create')}>
                        <i className="bi bi-plus-lg me-2"></i>New Memo
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="row mb-4">
                            {statCard('Total Memos', stats.total, 'bi-envelope', '#0d6efd', () => navigate('/memos'))}
                            {statCard('Sent', stats.sent, 'bi-send', '#198754', () => navigate('/memos'))}
                            {statCard('Received', stats.received, 'bi-inbox', '#6c757d', () => navigate('/memos'))}
                            {statCard('Pending', stats.pending, 'bi-hourglass-split', '#fd7e14', () => navigate('/memos'))}
                            {statCard('Approved', stats.approved, 'bi-check-circle', '#198754')}
                            {statCard('Rejected', stats.rejected, 'bi-x-circle', '#dc3545')}
                        </div>

                        <div className="row">
                            <div className="col-lg-8 mb-4">
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 fw-bold"><i className="bi bi-clock-history me-2"></i>Recent Memos</h5>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/memos')}>View All</button>
                                    </div>
                                    <div className="card-body p-0">
                                        {recentMemos.length === 0 ? (
                                            <div className="text-center py-4 text-muted">
                                                <p className="mb-0">No memos yet</p>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle mb-0">
                                                    <thead className="table-light">
                                                    <tr>
                                                        <th className="ps-4">Subject</th>
                                                        <th>Status</th>
                                                        <th>Date</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {recentMemos.map(m => (
                                                        <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/memos/${m.id}`)}>
                                                            <td className="ps-4">
                                                                <div className="fw-semibold">{m.subject}</div>
                                                                <small className="text-muted">{m.sender_id === userData?.id ? 'To: ' + m.recipient_name : 'From: ' + m.sender_name}</small>
                                                            </td>
                                                            <td>{statusBadge(m.status)}</td>
                                                            <td className="text-muted">{new Date(m.created_at).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 mb-4">
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 fw-bold"><i className="bi bi-bell me-2"></i>Notifications</h5>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/notifications')}>View All</button>
                                    </div>
                                    <div className="card-body p-0">
                                        {recentNotifications.length === 0 ? (
                                            <div className="text-center py-4 text-muted">
                                                <p className="mb-0">No notifications</p>
                                            </div>
                                        ) : (
                                            <div className="list-group list-group-flush">
                                                {recentNotifications.map(n => (
                                                    <div key={n.id} className="list-group-item d-flex align-items-start py-3">
                                                        <div className={`rounded-circle d-flex align-items-center justify-content-center me-2 ${n.status === 'pending' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
                                                             style={{ width: 32, height: 32, fontSize: 14 }}>
                                                            <i className="bi bi-bell"></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="small fw-semibold">{n.message}</div>
                                                            <small className="text-muted">{new Date(n.created_at).toLocaleDateString()}</small>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </DashLayout>
    );
};

export default Dashboard;
