import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const Notifications = () => {
    const token = AuthVerify.getToken();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
    };

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/notifications`, axiosConfig);
            setNotifications(res.data.notifications || []);
        } catch (err) {
            showAlert('danger', 'Failed to load notifications', err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await axios.put(`${BASE_URL}/notifications/${id}/read`, {}, axiosConfig);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'sent' } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        const pending = notifications.filter(n => n.status === 'pending');
        for (const n of pending) {
            await markAsRead(n.id);
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'SMS': return 'bi-phone';
            case 'Email': return 'bi-envelope';
            case 'both': return 'bi-broadcast';
            default: return 'bi-bell';
        }
    };

    const unreadCount = notifications.filter(n => n.status === 'pending').length;

    return (
        <DashLayout>
            <section className="dashboard-body p-4">
                {alert.show && (
                    <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                        {alert.message}
                        <button type="button" className="btn-close" onClick={() => setAlert({ show: false })}></button>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-primary">
                        <i className="bi bi-bell me-2"></i>Notifications
                        {unreadCount > 0 && <span className="badge bg-danger ms-2">{unreadCount}</span>}
                    </h2>
                    {unreadCount > 0 && (
                        <button className="btn btn-outline-primary" onClick={markAllAsRead}>
                            <i className="bi bi-check-all me-1"></i>Mark all read
                        </button>
                    )}
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-bell-slash fs-1"></i>
                                <p className="mt-2">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="list-group list-group-flush">
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`list-group-item list-group-item-action d-flex align-items-start py-3 ${n.status === 'pending' ? 'bg-light' : ''}`}
                                        style={{ cursor: 'pointer', borderLeft: n.status === 'pending' ? '4px solid #0d6efd' : '4px solid transparent' }}
                                    >
                                        <div className="flex-shrink-0">
                                            <div className={`rounded-circle d-flex align-items-center justify-content-center ${n.status === 'pending' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
                                                 style={{ width: 42, height: 42 }}>
                                                <i className={`bi ${getIcon(n.type)}`}></i>
                                            </div>
                                        </div>
                                        <div className="ms-3 flex-grow-1">
                                            <div className="d-flex justify-content-between">
                                                <div className="fw-semibold">{n.message}</div>
                                                <small className="text-muted">{new Date(n.created_at).toLocaleString()}</small>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-1">
                                                <div>
                                                    <span className="badge bg-light text-dark border me-2">{n.type}</span>
                                                    <span className={`badge ${n.status === 'pending' ? 'bg-warning text-dark' : n.status === 'sent' ? 'bg-success' : 'bg-danger'}`}>
                                                        {n.status}
                                                    </span>
                                                </div>
                                                {n.status === 'pending' && (
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/memos/${n.memo_id}`)}>
                                                            View Memo
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => markAsRead(n.id)}>
                                                            Mark Read
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
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

export default Notifications;
