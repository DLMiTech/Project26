import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const statusBadge = (status) => {
    const styles = {
        'Draft': 'bg-secondary',
        'pending': 'bg-warning text-dark',
        'Approved': 'bg-success',
        'Rejected': 'bg-danger'
    };
    return <span className={`badge ${styles[status] || 'bg-secondary'}`}>{status}</span>;
};

const priorityBadge = (priority) => {
    const styles = {
        'normal': 'bg-light text-dark border',
        'high': 'bg-warning text-dark',
        'urgent': 'bg-danger'
    };
    return <span className={`badge ${styles[priority] || 'bg-light text-dark border'}`}>{priority}</span>;
};

const MemoList = () => {
    const userData = AuthVerify.decodeToken();
    const token = AuthVerify.getToken();
    const navigate = useNavigate();

    const [memos, setMemos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, sent, received, pending
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
    };

    const fetchMemos = useCallback(async () => {
        try {
            setLoading(true);
            let endpoint = `${BASE_URL}/memos`;
            if (filter === 'sent') endpoint = `${BASE_URL}/memos/sent`;
            else if (filter === 'received') endpoint = `${BASE_URL}/memos/received`;
            else if (filter === 'pending') endpoint = `${BASE_URL}/memos/pending`;

            const res = await axios.get(endpoint, axiosConfig);
            setMemos(res.data.memos || []);
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Failed to load memos');
        } finally {
            setLoading(false);
        }
    }, [filter, token]);

    useEffect(() => { fetchMemos(); }, [fetchMemos]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this memo?')) return;
        try {
            await axios.delete(`${BASE_URL}/memos/${id}`, axiosConfig);
            showAlert('success', 'Memo deleted');
            fetchMemos();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Delete failed');
        }
    };

    const handleSubmit = async (id) => {
        try {
            await axios.post(`${BASE_URL}/memos/${id}/submit`, {}, axiosConfig);
            showAlert('success', 'Memo submitted');
            fetchMemos();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Submit failed');
        }
    };

    const filteredMemos = memos.filter(m => {
        if (filter === 'all') return true;
        if (filter === 'sent') return m.sender_id === userData?.id;
        if (filter === 'received') return m.recipient_id === userData?.id;
        if (filter === 'pending') return m.status === 'pending';
        return true;
    });

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
                        <i className="bi bi-envelope-paper me-2"></i>Memos
                    </h2>
                    <button className="btn btn-primary" onClick={() => navigate('/memos/create')}>
                        <i className="bi bi-plus-lg me-1"></i>New Memo
                    </button>
                </div>

                <div className="btn-group mb-3" role="group">
                    {['all', 'sent', 'received', 'pending'].map(f => (
                        <button
                            key={f}
                            type="button"
                            className={`btn ${filter === f ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilter(f)}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {f}
                            {f === 'pending' && memos.filter(m => m.status === 'pending').length > 0 && (
                                <span className="badge bg-danger ms-1">{memos.filter(m => m.status === 'pending').length}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary"></div>
                                <p className="mt-2 text-muted">Loading memos...</p>
                            </div>
                        ) : filteredMemos.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-inbox fs-1"></i>
                                <p className="mt-2">No memos found</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Subject</th>
                                        <th>From / To</th>
                                        <th>Status</th>
                                        <th>Priority</th>
                                        <th>Date</th>
                                        <th className="text-end pe-4">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredMemos.map(m => {
                                        const isSender = m.sender_id === userData?.id;
                                        const otherPerson = isSender ? m.recipient_name : m.sender_name;
                                        const otherRole = isSender ? m.recipient_role : m.sender_role;
                                        return (
                                            <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/memos/${m.id}`)}>
                                                <td className="ps-4">
                                                    <span className="fw-semibold">{m.subject}</span>
                                                    {m.status === 'pending' && !isSender && (
                                                        <span className="badge bg-danger ms-2">Action Required</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: 30, height: 30, fontSize: 12}}>
                                                            {otherPerson?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="fw-medium">{otherPerson}</div>
                                                            <small className="text-muted text-capitalize">{otherRole}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{statusBadge(m.status)}</td>
                                                <td>{priorityBadge(m.priority)}</td>
                                                <td className="text-muted">{new Date(m.created_at).toLocaleDateString()}</td>
                                                <td className="text-end pe-4" onClick={(e) => e.stopPropagation()}>
                                                    {m.status === 'Draft' && isSender && (
                                                        <>
                                                            <button className="btn btn-sm btn-success me-1" onClick={() => handleSubmit(m.id)} title="Submit">
                                                                <i className="bi bi-send"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => navigate(`/memos/${m.id}/edit`)} title="Edit">
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id)} title="Delete">
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                    {m.status === 'pending' && !isSender && (
                                                        <button className="btn btn-sm btn-primary" onClick={() => navigate(`/memos/${m.id}`)}>
                                                            Action <i className="bi bi-arrow-right"></i>
                                                        </button>
                                                    )}
                                                    {m.status !== 'Draft' && (
                                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/memos/${m.id}`)}>
                                                            View
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </DashLayout>
    );
};

export default MemoList;
