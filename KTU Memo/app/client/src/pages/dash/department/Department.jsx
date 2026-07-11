import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const Department = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;
    const token = AuthVerify.getToken();

    const [departments, setDepartments] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', faculty_id: '' });
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [deptRes, facRes] = await Promise.all([
                axios.get(`${BASE_URL}/departments`, axiosConfig),
                axios.get(`${BASE_URL}/faculties`, axiosConfig)
            ]);
            setDepartments(deptRes.data.departments || []);
            setFaculties(facRes.data.faculties || []);
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`${BASE_URL}/departments/${editing.id}`, formData, axiosConfig);
                showAlert('success', 'Department updated');
            } else {
                await axios.post(`${BASE_URL}/departments`, formData, axiosConfig);
                showAlert('success', 'Department created');
            }
            setShowModal(false);
            setFormData({ name: '', faculty_id: '' });
            setEditing(null);
            fetchData();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (dept) => {
        setEditing(dept);
        setFormData({ name: dept.name, faculty_id: dept.faculty_id });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this department?')) return;
        try {
            await axios.delete(`${BASE_URL}/departments/${id}`, axiosConfig);
            showAlert('success', 'Department deleted');
            fetchData();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Delete failed');
        }
    };

    const getFacultyName = (facultyId) => {
        const f = faculties.find(f => f.id === facultyId);
        return f ? f.name : 'Unknown';
    };

    const canManage = role === 'admin' || role === 'dean';

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
                        <i className="bi bi-diagram-3 me-2"></i>Departments
                    </h2>
                    {canManage && (
                        <button className="btn btn-primary" onClick={() => { setEditing(null); setFormData({ name: '', faculty_id: '' }); setShowModal(true); }}>
                            <i className="bi bi-plus-lg me-1"></i>Add Department
                        </button>
                    )}
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2 text-muted">Loading...</p>
                            </div>
                        ) : departments.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-diagram-3 fs-1"></i>
                                <p className="mt-2">No departments found</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">#</th>
                                        <th>Name</th>
                                        <th>Faculty</th>
                                        <th>Created</th>
                                        <th className="text-end pe-4">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {departments.map((d, idx) => (
                                        <tr key={d.id}>
                                            <td className="ps-4">{idx + 1}</td>
                                            <td className="fw-semibold">{d.name}</td>
                                            <td>
                                                <span className="badge bg-info text-dark">{d.faculty_name || getFacultyName(d.faculty_id)}</span>
                                            </td>
                                            <td className="text-muted">{new Date(d.created_at).toLocaleDateString()}</td>
                                            <td className="text-end pe-4">
                                                {canManage && (
                                                    <>
                                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(d)}>
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        {role === 'admin' && (
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(d.id)}>
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        )}
                                                    </>
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

                {showModal && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{editing ? 'Edit Department' : 'Add Department'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Faculty</label>
                                            <select
                                                className="form-select"
                                                value={formData.faculty_id}
                                                onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Faculty</option>
                                                {faculties.map(f => (
                                                    <option key={f.id} value={f.id}>{f.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Department Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                placeholder="e.g. Computer Science"
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
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

export default Department;
