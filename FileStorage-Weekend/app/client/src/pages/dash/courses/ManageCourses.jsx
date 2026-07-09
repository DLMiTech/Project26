import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthVerify from "../../../service/AuthVerify.jsx";
import DashLayout from "../DashLayout.jsx";
import URLService from "../../../service/URLService.jsx";

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const ManageCourses = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        code: '',
        title: '',
        credit_hours: '',
        description: ''
    });

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/courses`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setCourses(response.data.data || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/courses`,
                formData,
                { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }
            );
            if (response.data?.success) {
                toast.success('Course created successfully');
                setShowAddModal(false);
                setFormData({ code: '', title: '', credit_hours: '', description: '' });
                fetchCourses();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedCourse) return;
        setLoading(true);
        try {
            const response = await axios.put(
                `${BASE_URL}/courses/${selectedCourse.id}`,
                formData,
                { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }
            );
            if (response.data?.success) {
                toast.success('Course updated successfully');
                setShowEditModal(false);
                setSelectedCourse(null);
                setFormData({ code: '', title: '', credit_hours: '', description: '' });
                fetchCourses();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update course');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        setLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/courses/${id}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                toast.success('Course deleted successfully');
                fetchCourses();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete course');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (course) => {
        setSelectedCourse(course);
        setFormData({
            code: course.code,
            title: course.title,
            credit_hours: course.credit_hours,
            description: course.description || ''
        });
        setShowEditModal(true);
    };

    const filteredCourses = courses.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashLayout>
            <section className="dashboard-body">
                {/* Header */}
                <div className="page-header d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1e293b' }}>Courses</h2>
                        <p className="text-muted mb-0">Manage all academic courses</p>
                    </div>
                    {role === 'hod' && (
                        <button
                            className="btn text-white fw-semibold"
                            style={{ background: 'linear-gradient(135deg, #0ab39c, #405189)', border: 'none' }}
                            onClick={() => {
                                setFormData({ code: '', title: '', credit_hours: '', description: '' });
                                setShowAddModal(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-2"></i>Add Course
                        </button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style={{ width: 48, height: 48, background: 'rgba(37, 99, 235, 0.1)' }}>
                                        <i className="bi bi-book fs-4" style={{ color: '#2563eb' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Total Courses</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{courses.length}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style={{ width: 48, height: 48, background: 'rgba(14, 165, 233, 0.1)' }}>
                                        <i className="bi bi-clock fs-4" style={{ color: '#0ea5e9' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Total Credit Hours</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                            {courses.reduce((sum, c) => sum + (parseInt(c.credit_hours) || 0), 0)}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style={{ width: 48, height: 48, background: 'rgba(139, 92, 246, 0.1)' }}>
                                        <i className="bi bi-award fs-4" style={{ color: '#8b5cf6' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Avg Credit Hours</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                            {courses.length ? (courses.reduce((sum, c) => sum + (parseInt(c.credit_hours) || 0), 0) / courses.length).toFixed(1) : 0}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-search" style={{ color: '#94a3b8' }}></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Search by course code or title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* ManageCourses Table */}
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                <i className="bi bi-list-ul me-2" style={{ color: '#2563eb' }}></i>
                                All Courses
                            </h5>
                            <span className="badge rounded-pill" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                                {filteredCourses.length} courses
                            </span>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {loading && courses.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: '#2563eb' }} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-journal-x fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                                <p className="mb-0">No courses found</p>
                                {searchTerm && <small>Try adjusting your search</small>}
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="fw-semibold text-muted ps-4">Code</th>
                                        <th className="fw-semibold text-muted">Title</th>
                                        <th className="fw-semibold text-muted">Credit Hours</th>
                                        <th className="fw-semibold text-muted">Description</th>
                                        <th className="fw-semibold text-muted">Created</th>
                                        {role === 'hod' && (
                                            <th className="fw-semibold text-muted text-end pe-4">Actions</th>
                                        )}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredCourses.map((course) => (
                                        <tr key={course.id}>
                                            <td className="ps-4">
                                                    <span className="badge fw-semibold" style={{
                                                        background: 'rgba(37, 99, 235, 0.1)',
                                                        color: '#2563eb',
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        {course.code}
                                                    </span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold" style={{ color: '#1e293b' }}>{course.title}</div>
                                            </td>
                                            <td>
                                                    <span className="badge fw-semibold" style={{
                                                        background: 'rgba(14, 165, 233, 0.1)',
                                                        color: '#0ea5e9',
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        {course.credit_hours} hrs
                                                    </span>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {course.description ? (
                                                        course.description.length > 60
                                                            ? course.description.substring(0, 60) + '...'
                                                            : course.description
                                                    ) : '-'}
                                                </small>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {new Date(course.created_at).toLocaleDateString()}
                                                </small>
                                            </td>
                                            {role === 'hod' && (
                                                <td className="text-end pe-4">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => openEditModal(course)}
                                                    >
                                                        <i className="bi bi-pencil-square me-1"></i>Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(course.id)}
                                                    >
                                                        <i className="bi bi-trash me-1"></i>Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Modal */}
                {showAddModal && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>
                                        <i className="bi bi-plus-circle me-2" style={{ color: '#2563eb' }}></i>
                                        Add New Course
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold text-muted">Course Code</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="e.g., CS101"
                                                    value={formData.code}
                                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold text-muted">Credit Hours</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="e.g., 3"
                                                    min="1"
                                                    max="10"
                                                    value={formData.credit_hours}
                                                    onChange={(e) => setFormData({ ...formData, credit_hours: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Course Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g., Introduction to Computer Science"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Brief course description..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top">
                                        <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                                        <button
                                            type="submit"
                                            className="btn text-white fw-semibold"
                                            style={{ background: 'linear-gradient(135deg, #0ab39c, #405189)', border: 'none' }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Creating...' : 'Create Course'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && selectedCourse && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>
                                        <i className="bi bi-pencil-square me-2" style={{ color: '#2563eb' }}></i>
                                        Edit Course
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <form onSubmit={handleUpdate}>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold text-muted">Course Code</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.code}
                                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold text-muted">Credit Hours</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    min="1"
                                                    max="10"
                                                    value={formData.credit_hours}
                                                    onChange={(e) => setFormData({ ...formData, credit_hours: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Course Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top">
                                        <button type="button" className="btn btn-light" onClick={() => setShowEditModal(false)}>Cancel</button>
                                        <button
                                            type="submit"
                                            className="btn text-white fw-semibold"
                                            style={{ background: 'linear-gradient(135deg, #0ab39c, #405189)', border: 'none' }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Updating...' : 'Update Course'}
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

export default ManageCourses;