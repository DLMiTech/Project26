import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const statusBadge = (status) => {
    const styles = { 'Draft': 'bg-secondary', 'pending': 'bg-warning text-dark', 'Approved': 'bg-success', 'Rejected': 'bg-danger' };
    return <span className={`badge ${styles[status] || 'bg-secondary'}`}>{status}</span>;
};

const MemoDetail = () => {
    const { id } = useParams();
    const userData = AuthVerify.decodeToken();
    const token = AuthVerify.getToken();
    const navigate = useNavigate();

    const [memo, setMemo] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [forwardData, setForwardData] = useState({ forward_to_id: '', remarks: '' });
    const [users, setUsers] = useState([]);
    const [actionRemarks, setActionRemarks] = useState('');

    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
    };

    const fetchMemo = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/memos/${id}`, axiosConfig);
            setMemo(res.data.memo);
            setAttachments(res.data.attachments || []);
            setHistory(res.data.history || []);
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Failed to load memo');
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    console.log(attachments)

    useEffect(() => { fetchMemo(); }, [fetchMemo]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/auth/users`, axiosConfig).catch(() => ({ data: { users: [] } }));
                setUsers(res.data.users || []);
            } catch (err) { console.error(err); }
        };
        fetchUsers();
    }, [token]);

    const getValidForwardRecipients = () => {
        if (!memo) return [];
        const roleMap = {
            'lecture': ['hod'],
            'hod': ['dean', 'lecture'],
            'dean': ['admin', 'hod'],
            'admin': ['dean']
        };
        const allowed = roleMap[userData?.role] || [];
        return users.filter(u => allowed.includes(u.role) && u.id !== userData?.id && u.id !== memo.sender_id);
    };

    const handleApprove = async () => {
        try {
            await axios.post(`${BASE_URL}/memos/${id}/approve`, { remarks: actionRemarks }, axiosConfig);
            showAlert('success', 'Memo approved');
            setActionRemarks('');
            fetchMemo();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Approve failed');
        }
    };

    const handleReject = async () => {
        try {
            await axios.post(`${BASE_URL}/memos/${id}/reject`, { remarks: actionRemarks }, axiosConfig);
            showAlert('success', 'Memo rejected');
            setActionRemarks('');
            fetchMemo();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Reject failed');
        }
    };

    const handleForward = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/memos/${id}/forward`, forwardData, axiosConfig);
            showAlert('success', 'Memo forwarded');
            setShowForwardModal(false);
            setForwardData({ forward_to_id: '', remarks: '' });
            fetchMemo();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Forward failed');
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`${BASE_URL}/memos/${id}/submit`, {}, axiosConfig);
            showAlert('success', 'Memo submitted');
            fetchMemo();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Submit failed');
        }
    };

    if (loading) {
        return (
            <DashLayout>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border text-primary"></div>
                </div>
            </DashLayout>
        );
    }

    if (!memo) {
        return (
            <DashLayout>
                <div className="text-center py-5">
                    <i className="bi bi-exclamation-circle fs-1 text-muted"></i>
                    <p className="mt-2">Memo not found</p>
                    <button className="btn btn-primary" onClick={() => navigate('/memos')}>Back to Memos</button>
                </div>
            </DashLayout>
        );
    }

    const isSender = memo.sender_id === userData?.id;
    const isRecipient = memo.recipient_id === userData?.id;
    const canAct = isRecipient && memo.status === 'pending';

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
                        <i className="bi bi-envelope-open me-2"></i>Memo Details
                    </h2>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/memos')}>
                        <i className="bi bi-arrow-left me-1"></i>Back
                    </button>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                                <div>
                                    <h5 className="mb-1 fw-bold">{memo.subject}</h5>
                                    <small className="text-muted">Memo #{memo.id} • {new Date(memo.created_at).toLocaleString()}</small>
                                </div>
                                <div className="d-flex gap-2">
                                    {statusBadge(memo.status)}
                                    <span className={`badge ${memo.priority === 'urgent' ? 'bg-danger' : memo.priority === 'high' ? 'bg-warning text-dark' : 'bg-light text-dark border'}`}>
                                        {memo.priority}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="text-muted small fw-semibold">FROM</label>
                                        <div className="d-flex align-items-center mt-1">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: 40, height: 40}}>
                                                {memo.sender_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="fw-semibold">{memo.sender_name}</div>
                                                <small className="text-muted text-capitalize">{memo.sender_role}</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small fw-semibold">TO</label>
                                        <div className="d-flex align-items-center mt-1">
                                            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: 40, height: 40}}>
                                                {memo.recipient_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="fw-semibold">{memo.recipient_name}</div>
                                                <small className="text-muted text-capitalize">{memo.recipient_role}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div className="memo-content" style={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                                    {/*{memo.content.split(' ').map((line, i) => (*/}
                                    {/*    <p key={i} className="mb-2">{line}</p>*/}
                                    {/*    ))}*/}
                                    <p className="mb-2">{memo.content}</p>
                                </div>

                                {attachments.length > 0 && (
                                    <div className="mt-4">
                                        <label className="text-muted small fw-semibold text-uppercase">Attachments ({attachments.length})</label>
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {attachments.map(att => {
                                                // Get file extension for icon
                                                const ext = att.filename?.split('.').pop().toLowerCase() || '';
                                                const iconMap = {
                                                    'pdf': 'bi-file-earmark-pdf',
                                                    'doc': 'bi-file-earmark-word',
                                                    'docx': 'bi-file-earmark-word',
                                                    'xls': 'bi-file-earmark-excel',
                                                    'xlsx': 'bi-file-earmark-excel',
                                                    'jpg': 'bi-file-earmark-image',
                                                    'jpeg': 'bi-file-earmark-image',
                                                    'png': 'bi-file-earmark-image',
                                                    'txt': 'bi-file-earmark-text'
                                                };
                                                const icon = iconMap[ext] || 'bi-file-earmark';

                                                return (
                                                    <div key={att.id} className="card border-0 shadow-sm" style={{ width: '280px' }}>
                                                        <div className="card-body p-3">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center"
                                                                     style={{ width: 48, height: 48, minWidth: 48 }}>
                                                                    <i className={`bi ${icon} fs-4 text-primary`}></i>
                                                                </div>
                                                                <div className="flex-grow-1 overflow-hidden">
                                                                    <div className="fw-semibold text-truncate small" title={att.originalname || att.filename}>
                                                                        {att.originalname || att.filename}
                                                                    </div>
                                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                                        {att.size ? (att.size / 1024).toFixed(1) + ' KB' : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex gap-2 mt-3">
                                                                <a
                                                                    href={att.url || att.path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-sm btn-primary flex-fill"
                                                                    download={att.originalname || att.filename}
                                                                >
                                                                    <i className="bi bi-download me-1"></i> Download
                                                                </a>
                                                                <a
                                                                    href={att.url || att.path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-sm btn-outline-secondary"
                                                                >
                                                                    <i className="bi bi-eye"></i>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Action Buttons */}
                        {memo.status === 'Draft' && isSender && (
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-body d-flex gap-2">
                                    <button className="btn btn-success" onClick={handleSubmit}>
                                        <i className="bi bi-send me-2"></i>Submit Memo
                                    </button>
                                    {/*<button className="btn btn-outline-primary" onClick={() => navigate(`/memos/${id}/edit`)}>*/}
                                    {/*    <i className="bi bi-pencil me-2"></i>Edit*/}
                                    {/*</button>*/}
                                </div>
                            </div>
                        )}

                        {canAct && (
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-header bg-white">
                                    <h6 className="mb-0 fw-bold">Take Action</h6>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label">Remarks (optional)</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={actionRemarks}
                                            onChange={(e) => setActionRemarks(e.target.value)}
                                            placeholder="Add your remarks here..."
                                        ></textarea>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-success" onClick={handleApprove}>
                                            <i className="bi bi-check-circle me-2"></i>Approve
                                        </button>
                                        <button className="btn btn-danger" onClick={handleReject}>
                                            <i className="bi bi-x-circle me-2"></i>Reject
                                        </button>
                                        <button className="btn btn-warning" onClick={() => setShowForwardModal(true)}>
                                            <i className="bi bi-forward me-2"></i>Forward
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - History */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-light">
                                <h6 className="mb-0 fw-bold">
                                    <i className="bi bi-clock-history me-2"></i>Activity History
                                </h6>
                            </div>
                            <div className="card-body p-0">
                                {history.length === 0 ? (
                                    <div className="text-center py-4 text-muted">
                                        <small>No activity yet</small>
                                    </div>
                                ) : (
                                    <div className="timeline p-3">
                                        {history.map((h, idx) => (
                                            <div key={idx} className="d-flex mb-3 pb-3" style={{ borderBottom: idx < history.length - 1 ? '1px solid #eee' : 'none' }}>
                                                <div className="flex-shrink-0">
                                                    <div className={`rounded-circle d-flex align-items-center justify-content-center text-white`}
                                                         style={{
                                                             width: 36, height: 36,
                                                             backgroundColor: h.action === 'Approved' ? '#198754' : h.action === 'Rejected' ? '#dc3545' : h.action === 'Forward' ? '#fd7e14' : '#0d6efd'
                                                         }}>
                                                        <i className={`bi bi-${h.action === 'Approved' ? 'check' : h.action === 'Rejected' ? 'x' : h.action === 'Forward' ? 'forward' : 'send'}`}></i>
                                                    </div>
                                                </div>
                                                <div className="ms-3">
                                                    <div className="fw-semibold small">{h.action}</div>
                                                    <div className="text-muted small">{h.action_by_name}</div>
                                                    {h.remarks && <div className="small mt-1 text-secondary fst-italic">"{h.remarks}"</div>}
                                                    <div className="text-muted" style={{ fontSize: 11 }}>{new Date(h.created_at).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Forward Modal */}
                {showForwardModal && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Forward Memo</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowForwardModal(false)}></button>
                                </div>
                                <form onSubmit={handleForward}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Forward To</label>
                                            <select
                                                className="form-select"
                                                value={forwardData.forward_to_id}
                                                onChange={(e) => setForwardData({ ...forwardData, forward_to_id: e.target.value })}
                                                required
                                            >
                                                <option value="">Select recipient...</option>
                                                {getValidForwardRecipients().map(u => (
                                                    <option key={u.id} value={u.id}>{u.name} ({u.role.toUpperCase()})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Remarks</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                value={forwardData.remarks}
                                                onChange={(e) => setForwardData({ ...forwardData, remarks: e.target.value })}
                                                placeholder="Add forwarding remarks..."
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowForwardModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-warning">Forward Memo</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </DashLayout>
    );
};

export default MemoDetail;
