import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const Faculty = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;
    const token = AuthVerify.getToken();

    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '' });
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
    };

    const fetchFaculties = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/faculties`, axiosConfig);
            setFaculties(res.data.faculties || []);
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Failed to load faculties');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchFaculties();
    }, [fetchFaculties]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`${BASE_URL}/faculties/${editing.id}`, formData, axiosConfig);
                showAlert('success', 'Faculty updated successfully');
            } else {
                await axios.post(`${BASE_URL}/faculties`, formData, axiosConfig);
                showAlert('success', 'Faculty created successfully');
            }
            setShowModal(false);
            setFormData({ name: '', code: '' });
            setEditing(null);
            fetchFaculties();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (faculty) => {
        setEditing(faculty);
        setFormData({ name: faculty.name, code: faculty.code });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this faculty?')) return;
        try {
            await axios.delete(`${BASE_URL}/faculties/${id}`, axiosConfig);
            showAlert('success', 'Faculty deleted successfully');
            fetchFaculties();
        } catch (err) {
            showAlert('danger', err.response?.data?.message || 'Delete failed');
        }
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({ name: '', code: '' });
        setShowModal(true);
    };

    return (
        <DashLayout>
            <section className="dashboard-body p-4">
                {/* Alert */}
                {alert.show && (
                    <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                        {alert.message}
                        <button type="button" className="btn-close" onClick={() => setAlert({ show: false })}></button>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-primary">
                        <i className="bi bi-building me-2"></i>Faculties
                    </h2>
                    {role === 'admin' && (
                        <button className="btn btn-primary" onClick={openCreate}>
                            <i className="bi bi-plus-lg me-1"></i>Add Faculty
                        </button>
                    )}
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 text-muted">Loading faculties...</p>
                            </div>
                        ) : faculties.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-building fs-1"></i>
                                <p className="mt-2">No faculties found</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">#</th>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Created</th>
                                        <th className="text-end pe-4">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {faculties.map((f, idx) => (
                                        <tr key={f.id}>
                                            <td className="ps-4">{idx + 1}</td>
                                            <td>
                                                <span className="fw-semibold">{f.name}</span>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary">{f.code}</span>
                                            </td>
                                            <td className="text-muted">
                                                {new Date(f.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="text-end pe-4">
                                                {role === 'admin' && (
                                                    <>
                                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(f)}>
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
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

                {/* Modal */}
                {showModal && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{editing ? 'Edit Faculty' : 'Add Faculty'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Faculty Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                placeholder="e.g. Faculty of Science"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.code}
                                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                required
                                                placeholder="e.g. FOS"
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">
                                            {editing ? 'Update' : 'Create'}
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

export default Faculty;
