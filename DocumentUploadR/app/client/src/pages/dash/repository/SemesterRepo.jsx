import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";

import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const SemesterRepo = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;
    const [searchParams] = useSearchParams();
    const urlRepoId = searchParams.get('repository_id');

    const [semesters, setSemesters] = useState([]);
    const [repositories, setRepositories] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [semesterToDelete, setSemesterToDelete] = useState(null);

    const [formData, setFormData] = useState({
        repository_id: urlRepoId || '',
        name: '1st'
    });

    const fetchRepositories = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/repository`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setRepositories(response.data.data || []);
                // Auto-select from URL param or latest
                if (urlRepoId) {
                    const found = response.data.data.find(r => r.id == urlRepoId);
                    if (found) setSelectedRepo(found);
                } else if (response.data.data.length > 0) {
                    const latest = response.data.data.sort((a, b) => b.year - a.year)[0];
                    setSelectedRepo(latest);
                    setFormData(prev => ({ ...prev, repository_id: latest.id }));
                }
            }
        } catch (err) {
            console.error('Failed to fetch repositories', err.message);
        }
    }, [urlRepoId]);

    const fetchSemesters = useCallback(async (repoId) => {
        if (!repoId) return;
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/semester-repo/repository/${repoId}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setSemesters(response.data.data || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch semesters');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRepositories();
    }, [fetchRepositories]);

    useEffect(() => {
        if (selectedRepo) {
            fetchSemesters(selectedRepo.id);
        }
    }, [selectedRepo, fetchSemesters]);

    const handleRepoChange = (repoId) => {
        const repo = repositories.find(r => r.id == repoId);
        setSelectedRepo(repo || null);
        setFormData(prev => ({ ...prev, repository_id: repoId }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/semester-repo`,
                formData,
                { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }
            );
            if (response.data?.success) {
                toast.success(`Semester ${formData.name} created for ${selectedRepo?.year}`);
                setShowAddModal(false);
                setFormData(prev => ({ ...prev, name: '1st' }));
                fetchSemesters(selectedRepo.id);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create semester');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!semesterToDelete) return;
        setLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/semester-repo/${semesterToDelete.id}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                toast.success(`Semester ${semesterToDelete.name} deleted`);
                setShowDeleteModal(false);
                setSemesterToDelete(null);
                fetchSemesters(selectedRepo.id);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete semester');
        } finally {
            setLoading(false);
        }
    };

    const semesterIcon = (name) => {
        return name === '1st' ? 'bi-1-circle-fill' : 'bi-2-circle-fill';
    };

    const semesterColor = (name) => {
        return name === '1st'
            ? { bg: 'rgba(37, 99, 235, 0.1)', icon: '#2563eb', border: '#2563eb' }
            : { bg: 'rgba(14, 165, 233, 0.1)', icon: '#0ea5e9', border: '#0ea5e9' };
    };

    return (
        <DashLayout>
            <section className="dashboard-body">
                {/* Header */}
                <div className="page-header d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1e293b' }}>Semesters</h2>
                        <p className="text-muted mb-0">
                            {selectedRepo
                                ? `Managing semesters for ${selectedRepo.year} academic year`
                                : 'Select a repository to view semesters'}
                        </p>
                    </div>
                    {role === 'hod' && selectedRepo && (
                        <button
                            className="btn text-white fw-semibold"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                            onClick={() => {
                                setFormData(prev => ({ ...prev, repository_id: selectedRepo.id, name: '1st' }));
                                setShowAddModal(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-2"></i>Add Semester
                        </button>
                    )}
                </div>

                {/* Repository Selector */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-archive me-2" style={{ color: '#2563eb' }}></i>
                                <span className="fw-semibold text-muted me-2">Repository:</span>
                            </div>
                            <select
                                className="form-select fw-semibold"
                                style={{ maxWidth: 200, color: '#2563eb', borderColor: 'rgba(37, 99, 235, 0.3)' }}
                                value={selectedRepo?.id || ''}
                                onChange={(e) => handleRepoChange(e.target.value)}
                            >
                                <option value="">Select Year...</option>
                                {repositories
                                    .sort((a, b) => b.year - a.year)
                                    .map((repo) => (
                                        <option key={repo.id} value={repo.id}>
                                            {repo.year}
                                        </option>
                                    ))}
                            </select>
                            {selectedRepo && (
                                <span className="badge fw-semibold" style={{
                                    background: 'rgba(37, 99, 235, 0.1)',
                                    color: '#2563eb'
                                }}>
                                    {semesters.length} semester{semesters.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats for Selected Repo */}
                {selectedRepo && (
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                             style={{ width: 48, height: 48, background: 'rgba(37, 99, 235, 0.1)' }}>
                                            <i className="bi bi-calendar fs-4" style={{ color: '#2563eb' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Year</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{selectedRepo.year}</h4>
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
                                             style={{ width: 48, height: 48, background: 'rgba(34, 197, 94, 0.1)' }}>
                                            <i className="bi bi-check-circle fs-4" style={{ color: '#22c55e' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Semesters Added</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{semesters.length}/2</h4>
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
                                             style={{ width: 48, height: 48, background: 'rgba(245, 158, 11, 0.1)' }}>
                                            <i className="bi bi-info-circle fs-4" style={{ color: '#f59e0b' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Status</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: semesters.length === 2 ? '#22c55e' : '#f59e0b' }}>
                                                {semesters.length === 2 ? 'Complete' : 'Incomplete'}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Semester Cards */}
                {!selectedRepo ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5 text-muted">
                            <i className="bi bi-archive fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                            <p className="mb-0">Please select a repository from the dropdown above</p>
                        </div>
                    </div>
                ) : loading && semesters.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: '#2563eb' }} role="status"></div>
                    </div>
                ) : semesters.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5 text-muted">
                            <i className="bi bi-calendar-x fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                            <p className="mb-0">No semesters found for {selectedRepo.year}</p>
                            {role === 'hod' && (
                                <button
                                    className="btn text-white mt-3 fw-semibold"
                                    style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                                    onClick={() => setShowAddModal(true)}
                                >
                                    Add First Semester
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {semesters
                            .sort((a, b) => (a.name === '1st' ? -1 : 1))
                            .map((sem) => {
                                const colors = semesterColor(sem.name);
                                return (
                                    <div key={sem.id} className="col-md-6">
                                        <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                                            {/* Left accent bar */}
                                            <div className="position-absolute start-0 top-0 bottom-0"
                                                 style={{ width: 4, background: colors.border }}></div>

                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                             style={{ width: 56, height: 56, background: colors.bg }}>
                                                            <i className={`bi ${semesterIcon(sem.name)} fs-3`}
                                                               style={{ color: colors.icon }}></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                                                {sem.name} Semester
                                                            </h4>
                                                            <small className="text-muted">
                                                                {sem.repository_year} Academic Year
                                                            </small>
                                                        </div>
                                                    </div>
                                                    {role === 'hod' && (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => {
                                                                setSemesterToDelete(sem);
                                                                setShowDeleteModal(true);
                                                            }}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="d-flex gap-2 mt-3">
                                                    <a
                                                        href={`/repositories/course-repository?semester_id=${sem.id}`}
                                                        className="btn fw-semibold flex-fill"
                                                        style={{
                                                            background: colors.bg,
                                                            color: colors.icon,
                                                            border: 'none'
                                                        }}
                                                    >
                                                        <i className="bi bi-folder me-2"></i>
                                                        Manage Courses
                                                    </a>
                                                    <a
                                                        href={`/uploads?semester_id=${sem.id}`}
                                                        className="btn btn-outline-secondary"
                                                    >
                                                        <i className="bi bi-upload"></i>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="card-footer bg-light border-top-0 py-2 px-4">
                                                <small className="text-muted">
                                                    <i className="bi bi-clock me-1"></i>
                                                    Created {new Date(sem.created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/* Add Modal */}
                {showAddModal && selectedRepo && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>
                                        <i className="bi bi-calendar-plus me-2" style={{ color: '#2563eb' }}></i>
                                        Add Semester
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <form onSubmit={handleCreate}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Repository</label>
                                            <input
                                                type="text"
                                                className="form-control bg-light fw-semibold"
                                                value={`${selectedRepo.year}`}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Semester</label>
                                            <div className="d-flex gap-3">
                                                {['1st', '2nd'].map((sem) => {
                                                    const colors = semesterColor(sem);
                                                    const isDisabled = semesters.some(s => s.name === sem);
                                                    return (
                                                        <div
                                                            key={sem}
                                                            className={`form-check card p-3 flex-fill text-center cursor-pointer ${isDisabled ? 'opacity-50' : ''}`}
                                                            style={{
                                                                border: formData.name === sem ? `2px solid ${colors.border}` : '2px solid #e2e8f0',
                                                                borderRadius: 10,
                                                                cursor: isDisabled ? 'not-allowed' : 'pointer'
                                                            }}
                                                            onClick={() => !isDisabled && setFormData(prev => ({ ...prev, name: sem }))}
                                                        >
                                                            <input
                                                                className="form-check-input d-none"
                                                                type="radio"
                                                                name="semester"
                                                                value={sem}
                                                                checked={formData.name === sem}
                                                                onChange={() => setFormData(prev => ({ ...prev, name: sem }))}
                                                                disabled={isDisabled}
                                                            />
                                                            <i className={`bi ${semesterIcon(sem)} fs-2 mb-2 d-block`}
                                                               style={{ color: colors.icon }}></i>
                                                            <label className="form-check-label fw-bold" style={{ color: '#1e293b' }}>
                                                                {sem} Semester
                                                            </label>
                                                            {isDisabled && (
                                                                <small className="d-block text-danger mt-1" style={{ fontSize: '0.7rem' }}>
                                                                    Already exists
                                                                </small>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
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
                                            disabled={loading || semesters.length >= 2}
                                        >
                                            {loading ? 'Creating...' : 'Add Semester'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation */}
                {showDeleteModal && semesterToDelete && (
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
                                    <h5 className="fw-bold mb-2" style={{ color: '#1e293b' }}>Delete Semester?</h5>
                                    <p className="text-muted mb-0">
                                        Delete <strong>{semesterToDelete.name} Semester</strong> from {selectedRepo?.year}?
                                        All linked courses will be removed.
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

export default SemesterRepo;