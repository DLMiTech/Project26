import React, { useState, useEffect } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const MemoCreate = () => {
    const userData = AuthVerify.decodeToken();
    const token = AuthVerify.getToken();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        content: '',
        recipient_id: '',
        priority: 'normal'
    });
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [attachments, setAttachments] = useState([]);

    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch all users to select recipient
                // Note: You may need to adjust this endpoint based on your auth setup
                const res = await axios.get(`${BASE_URL}/auth/users`, axiosConfig).catch(() => ({ data: { users: [] } }));
                // Filter valid recipients based on role
                const validRecipients = getValidRecipients(userData?.role, res.data.users || []);
                setUsers(validRecipients);
            } catch (err) {
                console.error('Failed to load users', err);
            }
        };
        fetchUsers();
    }, [userData?.role, token]);

    const getValidRecipients = (role, allUsers) => {
        // Workflow: lecture -> hod, hod -> dean/lecture, dean -> admin/hod, admin -> dean
        const roleMap = {
            'lecture': ['lecture', 'hod'],
            'hod': ['dean', 'hod', 'lecture'],
            'dean': ['admin', 'hod', 'dean'],
            'admin': ['dean']
        };
        const allowedRoles = roleMap[role] || [];
        return allUsers.filter(u => allowedRoles.includes(u.role) && u.id !== userData?.id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.recipient_id) {
            showAlert('warning', 'Please select a recipient');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(`${BASE_URL}/memos`, formData, axiosConfig);
            const memoId = res.data.memo?.id;

            // Upload attachments if any
            if (attachments.length > 0 && memoId) {
                for (const file of attachments) {
                    const fd = new FormData();
                    fd.append('memo_id', memoId);
                    fd.append('file', file);
                    await axios.post(`${BASE_URL}/memo-attachments`, fd, {
                        ...axiosConfig,
                        headers: { ...axiosConfig.headers, 'Content-Type': 'multipart/form-data' }
                    });
                }
            }

            showAlert('success', 'Memo created successfully');
            setTimeout(() => navigate('/memos'), 1500);
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Failed to create memo');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setAttachments([...e.target.files]);
    };

    const removeFile = (idx) => {
        setAttachments(attachments.filter((_, i) => i !== idx));
    };

    const priorityOptions = [
        { value: 'normal', label: 'Normal', color: 'bg-light text-dark' },
        { value: 'high', label: 'High', color: 'bg-warning' },
        { value: 'urgent', label: 'Urgent', color: 'bg-danger' }
    ];

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
                        <i className="bi bi-pencil-square me-2"></i>Create Memo
                    </h2>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/memos')}>
                        <i className="bi bi-arrow-left me-1"></i>Back
                    </button>
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-8 mb-3">
                                    <label className="form-label fw-semibold">Subject</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        placeholder="Enter memo subject..."
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-semibold">Priority</label>
                                    <div className="d-flex gap-2">
                                        {priorityOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                className={`btn ${formData.priority === opt.value ? 'btn-primary' : 'btn-outline-secondary'} flex-fill`}
                                                onClick={() => setFormData({ ...formData, priority: opt.value })}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Recipient</label>
                                <select
                                    className="form-select"
                                    value={formData.recipient_id}
                                    onChange={(e) => setFormData({ ...formData, recipient_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select recipient...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.role.toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                                {users.length === 0 && (
                                    <small className="text-muted">No valid recipients available for your role ({userData?.role})</small>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Content</label>
                                <textarea
                                    className="form-control"
                                    rows={8}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    placeholder="Write your memo content here..."
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Attachments</label>
                                <div className="border rounded p-3 bg-light">
                                    <input
                                        type="file"
                                        className="form-control"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                    {attachments.length > 0 && (
                                        <div className="mt-2">
                                            {attachments.map((file, idx) => (
                                                <span key={idx} className="badge bg-light text-dark border me-2 mb-2">
                                                    <i className="bi bi-paperclip me-1"></i>
                                                    {file.name}
                                                    <button type="button" className="btn-close btn-close-white ms-2" style={{fontSize: 10}} onClick={() => removeFile(idx)}></button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Creating...</>
                                    ) : (
                                        <><i className="bi bi-save me-2"></i>Save as Draft</>
                                    )}
                                </button>
                                <button type="button" className="btn btn-outline-secondary btn-lg" onClick={() => navigate('/memos')}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </DashLayout>
    );
};

export default MemoCreate;
