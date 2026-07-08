import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const AccessControl = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;

    const [accessList, setAccessList] = useState([]);
    const [myAccess, setMyAccess] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showGrantModal, setShowGrantModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [grantForm, setGrantForm] = useState({
        start_datetime: '',
        end_datetime: '',
        status: 'approve'
    });
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestForm, setRequestForm] = useState({
        course_id: '',
        access_level: 'view',
        note: ''
    });
    const [courses, setCourses] = useState([]);

    // Fetch all access controls (HOD)
    const fetchAllAccess = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/access-control`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setAccessList(response.data.data || []);
                setPendingRequests(response.data.data.filter(a => a.status === 'pending'));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch access controls');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch my access requests (Lecture)
    const fetchMyAccess = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/access-control/lecture/${userData.id}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setMyAccess(response.data.data || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch my access');
        } finally {
            setLoading(false);
        }
    }, [userData.id]);

    // Fetch courses for request form
    const fetchCourses = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/courses`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setCourses(response.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch courses', err.message);
        }
    }, []);

    useEffect(() => {
        if (role === 'hod') {
            fetchAllAccess();
        } else {
            fetchMyAccess();
            fetchCourses();
        }
    }, [role, fetchAllAccess, fetchMyAccess, fetchCourses]);

    // Handle grant/decline single
    const handleGrant = async (e) => {
        e.preventDefault();
        if (!selectedRequest) return;

        setLoading(true);
        try {
            const response = await axios.put(
                `${BASE_URL}/access-control/grant/${selectedRequest.id}`,
                grantForm,
                { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }
            );

            if (response.data?.success) {
                toast.success(`Access ${grantForm.status}d successfully`);
                setShowGrantModal(false);
                setSelectedRequest(null);
                fetchAllAccess();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update access');
        } finally {
            setLoading(false);
        }
    };

    // Handle grant all for course
    const handleGrantAll = async (courseId, status) => {
        if (!window.confirm(`Are you sure you want to ${status} all pending requests for this course?`)) return;

        setLoading(true);
        try {
            const now = new Date().toISOString();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 6);

            const response = await axios.put(
                `${BASE_URL}/access-control/grant-all/${courseId}`,
                {
                    start_datetime: now,
                    end_datetime: endDate.toISOString(),
                    status
                },
                { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }
            );

            if (response.data?.success) {
                toast.success(response.data.message);
                fetchAllAccess();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update all access');
        } finally {
            setLoading(false);
        }
    };


    const handleDecline = async (id) => {
        if (!id) return;

        console.log("Hello")
        setLoading(true);
        try {
            const response = await axios.put(
                `${BASE_URL}/access-control/grant/${id}`,
                { status: "decline" },
                {
                    headers: {
                        Authorization: `Bearer ${AuthVerify.getToken()}`
                    }
                }
            );

            if (response.data?.success) {
                toast.success("Access declined successfully");
                fetchAllAccess();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update access");
        } finally {
            setLoading(false);
        }
    };

    // Handle new access request
    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/access-control`,
                requestForm,
                { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }
            );

            if (response.data?.success) {
                toast.success('Access request submitted successfully');
                setShowRequestModal(false);
                setRequestForm({ course_id: '', access_level: 'view', note: '' });
                fetchMyAccess();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    // Delete access request
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this request?')) return;

        setLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/access-control/${id}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });

            if (response.data?.success) {
                toast.success('Deleted successfully');
                role === 'hod' ? fetchAllAccess() : fetchMyAccess();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            approve: { background: '#22c55e', color: '#fff' },
            decline: { background: '#ef4444', color: '#fff' },
            pending: { background: '#f59e0b', color: '#fff' }
        };
        return (
            <span className="badge" style={styles[status] || styles.pending}>
                {status?.toUpperCase()}
            </span>
        );
    };

    const getAccessLevelBadge = (level) => {
        const styles = {
            view: { background: '#3b82f6', color: '#fff' },
            download: { background: '#8b5cf6', color: '#fff' },
            modify: { background: '#ec4899', color: '#fff' }
        };
        return (
            <span className="badge" style={styles[level] || styles.view}>
                {level?.toUpperCase()}
            </span>
        );
    };

    return (
        <DashLayout>
            <section className="dashboard-body">
                <div className="page-header d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1e293b' }}>Access Control</h2>
                        <p className="text-muted mb-0">Manage course access permissions</p>
                    </div>
                    {role === 'lecture' && (
                        <button
                            className="btn text-white fw-semibold"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                            onClick={() => setShowRequestModal(true)}
                        >
                            <i className="bi bi-plus-lg me-2"></i>Request Access
                        </button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style={{ width: 48, height: 48, background: 'rgba(37, 99, 235, 0.1)' }}>
                                        <i className="bi bi-shield-check fs-4" style={{ color: '#2563eb' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Total Requests</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                            {role === 'hod' ? accessList.length : myAccess.length}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style={{ width: 48, height: 48, background: 'rgba(34, 197, 94, 0.1)' }}>
                                        <i className="bi bi-check-circle fs-4" style={{ color: '#22c55e' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Approved</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#22c55e' }}>
                                            {(role === 'hod' ? accessList : myAccess).filter(a => a.status === 'approve').length}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style={{ width: 48, height: 48, background: 'rgba(245, 158, 11, 0.1)' }}>
                                        <i className="bi bi-clock-history fs-4" style={{ color: '#f59e0b' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Pending</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#f59e0b' }}>
                                            {(role === 'hod' ? accessList : myAccess).filter(a => a.status === 'pending').length}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style={{ width: 48, height: 48, background: 'rgba(239, 68, 68, 0.1)' }}>
                                        <i className="bi bi-x-circle fs-4" style={{ color: '#ef4444' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Declined</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#ef4444' }}>
                                            {(role === 'hod' ? accessList : myAccess).filter(a => a.status === 'decline').length}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HOD View - All Access Controls */}
                {role === 'hod' && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                    <i className="bi bi-list-check me-2" style={{ color: '#2563eb' }}></i>
                                    All Access Requests
                                </h5>
                                <span className="badge rounded-pill" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                                    {accessList.length} records
                                </span>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: '#2563eb' }} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : accessList.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-inbox fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                                    <p>No access requests found</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="fw-semibold text-muted ps-4">Lecture</th>
                                            <th className="fw-semibold text-muted">Course</th>
                                            <th className="fw-semibold text-muted">Level</th>
                                            <th className="fw-semibold text-muted">Status</th>
                                            <th className="fw-semibold text-muted">Period</th>
                                            <th className="fw-semibold text-muted">Note</th>
                                            <th className="fw-semibold text-muted text-end pe-4">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {accessList.map((item) => (
                                            <tr key={item.id}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                                             style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563eb, #0ea5e9)' }}>
                                                                <span className="text-white fw-bold" style={{ fontSize: 14 }}>
                                                                    {item.lecture_name?.charAt(0)?.toUpperCase()}
                                                                </span>
                                                        </div>
                                                        <div>
                                                            <div className="fw-semibold" style={{ color: '#1e293b' }}>{item.lecture_name}</div>
                                                            <small className="text-muted">{item.lecture_email}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold" style={{ color: '#1e293b' }}>{item.course_title}</div>
                                                    <small className="text-muted">{item.course_code}</small>
                                                </td>
                                                <td>{getAccessLevelBadge(item.access_level)}</td>
                                                <td>{getStatusBadge(item.status)}</td>
                                                <td>
                                                    {item.start_datetime ? (
                                                        <small className="text-muted">
                                                            {new Date(item.start_datetime).toLocaleDateString()} - {new Date(item.end_datetime).toLocaleDateString()}
                                                        </small>
                                                    ) : (
                                                        <small className="text-muted">Not set</small>
                                                    )}
                                                </td>
                                                <td>
                                                    <small className="text-muted">{item.note || '-'}</small>
                                                </td>
                                                <td className="text-end pe-4">
                                                    {item.status === 'pending' && (
                                                        <>
                                                            <button
                                                                className="btn btn-sm me-2 text-white"
                                                                style={{ background: '#22c55e', border: 'none' }}
                                                                onClick={() => {
                                                                    setSelectedRequest(item);
                                                                    const now = new Date().toISOString().slice(0, 16);
                                                                    const end = new Date();
                                                                    end.setMonth(end.getMonth() + 1);
                                                                    setGrantForm({
                                                                        start_datetime: now,
                                                                        end_datetime: end.toISOString().slice(0, 16),
                                                                        status: 'approve'
                                                                    });
                                                                    setShowGrantModal(true);
                                                                }}
                                                            >
                                                                <i className="bi bi-check-lg me-1"></i>Grant
                                                            </button>
                                                            <button
                                                                className="btn btn-sm me-2 text-white"
                                                                style={{ background: '#ef4444', border: 'none' }}
                                                                onClick={()=>handleDecline(item.id)}
                                                            >
                                                                <i className="bi bi-x-lg me-1"></i>Decline
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Lecture View - My Access */}
                {role === 'lecture' && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                    <i className="bi bi-key me-2" style={{ color: '#2563eb' }}></i>
                                    My Access Requests
                                </h5>
                                <span className="badge rounded-pill" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                                    {myAccess.length} records
                                </span>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: '#2563eb' }} role="status"></div>
                                </div>
                            ) : myAccess.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-inbox fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                                    <p>No access requests found</p>
                                    <button
                                        className="btn text-white mt-2"
                                        style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                                        onClick={() => setShowRequestModal(true)}
                                    >
                                        Request Your First Access
                                    </button>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="fw-semibold text-muted ps-4">Course</th>
                                            <th className="fw-semibold text-muted">Level</th>
                                            <th className="fw-semibold text-muted">Status</th>
                                            <th className="fw-semibold text-muted">Valid Period</th>
                                            <th className="fw-semibold text-muted">Note</th>
                                            <th className="fw-semibold text-muted text-end pe-4">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {myAccess.map((item) => (
                                            <tr key={item.id}>
                                                <td className="ps-4">
                                                    <div className="fw-semibold" style={{ color: '#1e293b' }}>{item.course_title}</div>
                                                    <small className="text-muted">{item.course_code}</small>
                                                </td>
                                                <td>{getAccessLevelBadge(item.access_level)}</td>
                                                <td>{getStatusBadge(item.status)}</td>
                                                <td>
                                                    {item.start_datetime ? (
                                                        <small className="text-muted">
                                                            {new Date(item.start_datetime).toLocaleDateString()} - {new Date(item.end_datetime).toLocaleDateString()}
                                                        </small>
                                                    ) : (
                                                        <small className="text-muted">Pending approval</small>
                                                    )}
                                                </td>
                                                <td><small className="text-muted">{item.note || '-'}</small></td>
                                                <td className="text-end pe-4">
                                                    {item.status === 'pending' && (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <i className="bi bi-trash me-1"></i>Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Grant Modal */}
                {showGrantModal && selectedRequest && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>
                                        Grant Access to {selectedRequest.lecture_name}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowGrantModal(false)}></button>
                                </div>
                                <form onSubmit={handleGrant}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Course</label>
                                            <input type="text" className="form-control bg-light" value={selectedRequest.course_title} disabled />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Access Level</label>
                                            <input type="text" className="form-control bg-light" value={selectedRequest.access_level} disabled />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold text-muted">Start Date</label>
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    value={grantForm.start_datetime}
                                                    onChange={(e) => setGrantForm({ ...grantForm, start_datetime: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold text-muted">End Date</label>
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    value={grantForm.end_datetime}
                                                    onChange={(e) => setGrantForm({ ...grantForm, end_datetime: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Status</label>
                                            <select
                                                className="form-select"
                                                value={grantForm.status}
                                                onChange={(e) => setGrantForm({ ...grantForm, status: e.target.value })}
                                            >
                                                <option value="approve">Approve</option>
                                                <option value="decline">Decline</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top">
                                        <button type="button" className="btn btn-light" onClick={() => setShowGrantModal(false)}>Cancel</button>
                                        <button
                                            type="submit"
                                            className="btn text-white fw-semibold"
                                            style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : 'Confirm'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Request Access Modal */}
                {showRequestModal && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>Request Course Access</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowRequestModal(false)}></button>
                                </div>
                                <form onSubmit={handleRequest}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Select Course</label>
                                            <select
                                                className="form-select"
                                                value={requestForm.course_id}
                                                onChange={(e) => setRequestForm({ ...requestForm, course_id: e.target.value })}
                                                required
                                            >
                                                <option value="">Choose a course...</option>
                                                {courses.map((course) => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.code} - {course.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Access Level</label>
                                            <select
                                                className="form-select"
                                                value={requestForm.access_level}
                                                onChange={(e) => setRequestForm({ ...requestForm, access_level: e.target.value })}
                                            >
                                                <option value="view">View Only</option>
                                                <option value="download">Download</option>
                                                <option value="modify">Modify</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Note (Optional)</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Reason for access request..."
                                                value={requestForm.note}
                                                onChange={(e) => setRequestForm({ ...requestForm, note: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top">
                                        <button type="button" className="btn btn-light" onClick={() => setShowRequestModal(false)}>Cancel</button>
                                        <button
                                            type="submit"
                                            className="btn text-white fw-semibold"
                                            style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Submitting...' : 'Submit Request'}
                                        </button>
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

export default AccessControl;