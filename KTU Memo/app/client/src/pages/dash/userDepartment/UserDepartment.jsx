import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const UserDepartment = () => {
    const token = AuthVerify.getToken();
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [userDepts, setUserDepts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ user_id: '', department_id: '' });
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [activeTab, setActiveTab] = useState('assign');

    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [usersRes, deptsRes] = await Promise.all([
                axios.get(`${BASE_URL}/auth/users`, axiosConfig).catch(() => ({ data: { users: [] } })),
                axios.get(`${BASE_URL}/departments`, axiosConfig)
            ]);
            setUsers(usersRes.data.users || []);
            setDepartments(deptsRes.data.departments || []);
        } catch (err) {
            showAlert('danger', 'Failed to load data', err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchUserDepts = useCallback(async () => {
        try {
            const res = await axios.get(`${BASE_URL}/departments`, axiosConfig);
            const allUserDepts = [];
            for (const dept of res.data.departments || []) {
                // FIX: Use /user-departments/department/:id instead of /departments/:id/users
                const udRes = await axios.get(`${BASE_URL}/user-departments/department/${dept.id}`, axiosConfig);
                (udRes.data.users || []).forEach(u => {
                    allUserDepts.push({ ...u, department_name: dept.name, department_id: dept.id });
                });
            }
            setUserDepts(allUserDepts);
        } catch (err) {
            console.error(err);
        }
    }, [token]);

    useEffect(() => { fetchData(); fetchUserDepts(); }, [fetchData, fetchUserDepts]);

    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/user-departments/join`, formData, axiosConfig);
            showAlert('success', 'User assigned to department');
            setShowModal(false);
            setFormData({ user_id: '', department_id: '' });
            fetchUserDepts();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Assignment failed');
        }
    };

    const handleLeave = async (userId, deptId) => {
        if (!window.confirm('Remove user from this department?')) return;
        try {
            await axios.post(`${BASE_URL}/user-departments/leave`, { user_id: userId, department_id: deptId }, axiosConfig);
            showAlert('success', 'User removed from department');
            fetchUserDepts();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Remove failed');
        }
    };

    const getUserName = (id) => {
        const u = users.find(u => u.id === parseInt(id));
        return u ? u.name : 'Unknown';
    };

    const getDeptName = (id) => {
        const d = departments.find(d => d.id === parseInt(id));
        return d ? d.name : 'Unknown';
    };

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
                        <i className="bi bi-people me-2"></i>User Departments
                    </h2>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <i className="bi bi-link-45deg me-1"></i>Assign User
                    </button>
                </div>

                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'assign' ? 'active' : ''}`} onClick={() => setActiveTab('assign')}>
                            Assignments
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'by-dept' ? 'active' : ''}`} onClick={() => setActiveTab('by-dept')}>
                            By Department
                        </button>
                    </li>
                </ul>

                {activeTab === 'assign' && (
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary"></div>
                                </div>
                            ) : userDepts.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-people fs-1"></i>
                                    <p>No assignments yet</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                        <tr>
                                            <th className="ps-4">User</th>
                                            <th>Role</th>
                                            <th>Department</th>
                                            <th className="text-end pe-4">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {userDepts.map((ud, idx) => (
                                            <tr key={idx}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: 35, height: 35}}>
                                                            {ud.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="fw-semibold">{ud.name}</span>
                                                    </div>
                                                </td>
                                                <td><span className="badge bg-secondary text-capitalize">{ud.role}</span></td>
                                                <td><span className="badge bg-info text-dark">{ud.department_name}</span></td>
                                                <td className="text-end pe-4">
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleLeave(ud.user_id || ud.id, ud.department_id)}>
                                                        <i className="bi bi-x-lg"></i> Remove
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

                {activeTab === 'by-dept' && (
                    <div className="row">
                        {departments.map(dept => {
                            const deptUsers = userDepts.filter(ud => ud.department_id === dept.id);
                            return (
                                <div className="col-md-6 col-lg-4 mb-3" key={dept.id}>
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">{dept.name}</span>
                                            <span className="badge bg-primary">{deptUsers.length}</span>
                                        </div>
                                        <div className="card-body">
                                            {deptUsers.length === 0 ? (
                                                <p className="text-muted text-center mb-0">No users assigned</p>
                                            ) : (
                                                <ul className="list-group list-group-flush">
                                                    {deptUsers.map((u, i) => (
                                                        <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                            <span>{u.name}</span>
                                                            <span className="badge bg-secondary text-capitalize">{u.role}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {showModal && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Assign User to Department</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleJoin}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">User</label>
                                            <select className="form-select" value={formData.user_id} onChange={(e) => setFormData({...formData, user_id: e.target.value})} required>
                                                <option value="">Select User</option>
                                                {users.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Department</label>
                                            <select className="form-select" value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})} required>
                                                <option value="">Select Department</option>
                                                {departments.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Assign</button>
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

export default UserDepartment;
