import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const Repository = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;

    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [yearInput, setYearInput] = useState('');

    const fetchRepositories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/repository`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setRepositories(response.data.data || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch repositories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRepositories();
    }, [fetchRepositories]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/repository`,
                { year: parseInt(yearInput) },
                { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }
            );
            if (response.data?.success) {
                toast.success(`Repository ${yearInput} created successfully`);
                setShowAddModal(false);
                setYearInput('');
                fetchRepositories();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create repository');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedRepo) return;
        setLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/repository/${selectedRepo.id}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                toast.success(`Repository ${selectedRepo.year} deleted`);
                setShowDeleteModal(false);
                setSelectedRepo(null);
                fetchRepositories();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete repository');
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <DashLayout>
            <section className="dashboard-body">
                {/* Header */}
                <div className="page-header d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1e293b' }}>Repositories</h2>
                        <p className="text-muted mb-0">Manage academic year repositories</p>
                    </div>
                    {role === 'hod' && (
                        <button
                            className="btn text-white fw-semibold"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                            onClick={() => {
                                setYearInput(currentYear.toString());
                                setShowAddModal(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-2"></i>Create Repository
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
                                        <i className="bi bi-archive fs-4" style={{ color: '#2563eb' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Total Repositories</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{repositories.length}</h4>
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
                                        <i className="bi bi-calendar-check fs-4" style={{ color: '#0ea5e9' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Latest Year</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                            {repositories.length > 0 ? Math.max(...repositories.map(r => r.year)) : '-'}
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
                                        <i className="bi bi-calendar-range fs-4" style={{ color: '#8b5cf6' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Year Range</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                            {repositories.length > 1
                                                ? `${Math.min(...repositories.map(r => r.year))} - ${Math.max(...repositories.map(r => r.year))}`
                                                : repositories.length === 1
                                                    ? repositories[0].year
                                                    : '-'
                                            }
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Repository Cards Grid */}
                {loading && repositories.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: '#2563eb' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : repositories.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5 text-muted">
                            <i className="bi bi-folder-x fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                            <p className="mb-0">No repositories found</p>
                            {role === 'hod' && (
                                <button
                                    className="btn text-white mt-3 fw-semibold"
                                    style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                                    onClick={() => {
                                        setYearInput(currentYear.toString());
                                        setShowAddModal(true);
                                    }}
                                >
                                    Create First Repository
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {repositories
                            .sort((a, b) => b.year - a.year)
                            .map((repo) => {
                                const isLatest = repo.year === Math.max(...repositories.map(r => r.year));
                                return (
                                    <div key={repo.id} className="col-md-4 col-lg-3">
                                        <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden"
                                             style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                                             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                            {/* Top accent bar */}
                                            <div style={{
                                                height: 4,
                                                background: isLatest
                                                    ? 'linear-gradient(90deg, #2563eb, #0ea5e9)'
                                                    : '#e2e8f0'
                                            }}></div>

                                            {isLatest && (
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <span className="badge fw-semibold" style={{
                                                        background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                                                        color: '#fff',
                                                        fontSize: '0.7rem'
                                                    }}>
                                                        LATEST
                                                    </span>
                                                </div>
                                            )}

                                            <div className="card-body text-center py-4">
                                                <div className="mb-3">
                                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                                         style={{
                                                             width: 72,
                                                             height: 72,
                                                             background: isLatest
                                                                 ? 'linear-gradient(135deg, #2563eb, #0ea5e9)'
                                                                 : 'rgba(37, 99, 235, 0.08)'
                                                         }}>
                                                        <i className={`bi ${isLatest ? 'bi-folder-check' : 'bi-folder'} fs-2`}
                                                           style={{ color: isLatest ? '#fff' : '#2563eb' }}></i>
                                                    </div>
                                                </div>
                                                <h3 className="fw-bold mb-1" style={{ color: '#1e293b' }}>{repo.year}</h3>
                                                <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                                                    Academic Year Repository
                                                </p>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <a
                                                        href={`/repositories/semester-repo?repository_id=${repo.id}`}
                                                        className="btn btn-sm fw-semibold"
                                                        style={{
                                                            background: 'rgba(37, 99, 235, 0.1)',
                                                            color: '#2563eb',
                                                            border: 'none'
                                                        }}
                                                    >
                                                        <i className="bi bi-eye me-1"></i>View
                                                    </a>
                                                    {role === 'hod' && (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedRepo(repo);
                                                                setShowDeleteModal(true);
                                                            }}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="card-footer bg-light border-top-0 text-center py-2">
                                                <small className="text-muted">
                                                    Created {new Date(repo.created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/* Add Modal */}
                {showAddModal && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>
                                        <i className="bi bi-folder-plus me-2" style={{ color: '#2563eb' }}></i>
                                        Create Repository
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <form onSubmit={handleCreate}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Academic Year</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-lg text-center fw-bold"
                                                style={{ fontSize: '1.5rem', color: '#2563eb' }}
                                                placeholder="2026"
                                                min="1900"
                                                max="2100"
                                                value={yearInput}
                                                onChange={(e) => setYearInput(e.target.value)}
                                                required
                                                autoFocus
                                            />
                                            <small className="text-muted mt-1 d-block">
                                                Enter the academic year (e.g., 2026)
                                            </small>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top">
                                        <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn text-white fw-semibold"
                                            style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                                            disabled={loading || !yearInput}
                                        >
                                            {loading ? 'Creating...' : 'Create Repository'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedRepo && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered modal-sm">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-body text-center py-4">
                                    <div className="mb-3">
                                        <div className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                             style={{ width: 56, height: 56, background: 'rgba(239, 68, 68, 0.1)' }}>
                                            <i className="bi bi-exclamation-triangle fs-3" style={{ color: '#ef4444' }}></i>
                                        </div>
                                    </div>
                                    <h5 className="fw-bold mb-2" style={{ color: '#1e293b' }}>Delete Repository?</h5>
                                    <p className="text-muted mb-0">
                                        Are you sure you want to delete <strong>{selectedRepo.year}</strong>?
                                        This will also remove all semesters and course links.
                                    </p>
                                </div>
                                <div className="modal-footer border-top justify-content-center">
                                    <button type="button" className="btn btn-light" onClick={() => setShowDeleteModal(false)}>
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn text-white fw-semibold"
                                        style={{ background: '#ef4444', border: 'none' }}
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </DashLayout>
    );
};

export default Repository;