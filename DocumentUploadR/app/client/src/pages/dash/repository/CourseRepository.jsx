import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const CourseRepository = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;
    const [searchParams] = useSearchParams();
    const urlSemesterId = searchParams.get('semester_id');

    const [courseRepos, setCourseRepos] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [repositories, setRepositories] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        semester_id: urlSemesterId || '',
        course_id: ''
    });

    // Fetch all repositories and semesters for the selector chain
    const fetchRepositories = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/repository`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                const repos = response.data.data || [];
                setRepositories(repos);
                return repos;
            }
        } catch (err) {
            console.error('Failed to fetch repositories', err.message);
        }
        return [];
    }, []);

    const fetchAllSemesters = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/semester-repo`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                return response.data.data || [];
            }
        } catch (err) {
            console.error('Failed to fetch semesters', err.message);
        }
        return [];
    }, []);

    const fetchAllCourses = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/courses`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setAllCourses(response.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch courses', err.message);
        }
    }, []);

    const fetchCourseRepos = useCallback(async (semesterId) => {
        if (!semesterId) return;
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/course-repository/semester/${semesterId}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setCourseRepos(response.data.data || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch course repositories');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize from URL or defaults
    useEffect(() => {
        const init = async () => {
            const repos = await fetchRepositories();
            const allSems = await fetchAllSemesters();
            setSemesters(allSems);
            await fetchAllCourses();

            if (urlSemesterId) {
                const foundSem = allSems.find(s => s.id == urlSemesterId);
                if (foundSem) {
                    setSelectedSemester(foundSem);
                    const foundRepo = repos.find(r => r.id == foundSem.repository_id);
                    setSelectedRepo(foundRepo || null);
                    setFormData(prev => ({ ...prev, semester_id: urlSemesterId }));
                    fetchCourseRepos(urlSemesterId);
                }
            }
        };
        init();
    }, [urlSemesterId, fetchRepositories, fetchAllSemesters, fetchAllCourses, fetchCourseRepos]);

    const handleRepoChange = (repoId) => {
        const repo = repositories.find(r => r.id == repoId);
        setSelectedRepo(repo || null);
        setSelectedSemester(null);
        setCourseRepos([]);
    };

    const handleSemesterChange = (semId) => {
        const sem = semesters.find(s => s.id == semId);
        setSelectedSemester(sem || null);
        setFormData(prev => ({ ...prev, semester_id: semId, course_id: '' }));
        if (sem) {
            fetchCourseRepos(sem.id);
            // Auto-set repo if not already
            const repo = repositories.find(r => r.id == sem.repository_id);
            if (repo) setSelectedRepo(repo);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/course-repository`,
                formData,
                { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }
            );
            if (response.data?.success) {
                toast.success('Course linked to semester successfully');
                setShowAddModal(false);
                setFormData(prev => ({ ...prev, course_id: '' }));
                fetchCourseRepos(selectedSemester.id);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to link course');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!courseToDelete) return;
        setLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/course-repository/${courseToDelete.id}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                toast.success('Course link removed');
                setShowDeleteModal(false);
                setCourseToDelete(null);
                fetchCourseRepos(selectedSemester.id);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove link');
        } finally {
            setLoading(false);
        }
    };

    // Get available semesters for selected repo
    const availableSemesters = selectedRepo
        ? semesters.filter(s => s.repository_id == selectedRepo.id)
        : [];

    // Get courses not yet linked to this semester
    const linkedCourseIds = courseRepos.map(cr => cr.course_id);
    const availableCourses = allCourses.filter(c => !linkedCourseIds.includes(c.id));

    const filteredCourseRepos = courseRepos.filter(cr =>
        cr.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cr.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashLayout>
            <section className="dashboard-body">
                {/* Header */}
                <div className="page-header d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1e293b' }}>Course Repository</h2>
                        <p className="text-muted mb-0">
                            {selectedSemester
                                ? `Courses in ${selectedSemester.name} Semester, ${selectedRepo?.year}`
                                : 'Select a semester to view linked courses'}
                        </p>
                    </div>
                    {role === 'hod' && selectedSemester && (
                        <button
                            className="btn text-white fw-semibold"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                            onClick={() => {
                                setFormData(prev => ({ ...prev, semester_id: selectedSemester.id, course_id: '' }));
                                setShowAddModal(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-2"></i>Link Course
                        </button>
                    )}
                </div>

                {/* Breadcrumb Selector */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-5">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-archive me-2" style={{ color: '#2563eb' }}></i>
                                    <span className="fw-semibold text-muted me-2" style={{ whiteSpace: 'nowrap' }}>Repository:</span>
                                    <select
                                        className="form-select fw-semibold"
                                        style={{ color: '#2563eb', borderColor: 'rgba(37, 99, 235, 0.3)' }}
                                        value={selectedRepo?.id || ''}
                                        onChange={(e) => handleRepoChange(e.target.value)}
                                    >
                                        <option value="">Select Year...</option>
                                        {repositories
                                            .sort((a, b) => b.year - a.year)
                                            .map((repo) => (
                                                <option key={repo.id} value={repo.id}>{repo.year}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-calendar me-2" style={{ color: selectedRepo ? '#2563eb' : '#cbd5e1' }}></i>
                                    <span className="fw-semibold text-muted me-2" style={{ whiteSpace: 'nowrap' }}>Semester:</span>
                                    <select
                                        className="form-select fw-semibold"
                                        style={{
                                            color: selectedSemester ? '#2563eb' : '#94a3b8',
                                            borderColor: selectedRepo ? 'rgba(37, 99, 235, 0.3)' : '#e2e8f0'
                                        }}
                                        value={selectedSemester?.id || ''}
                                        onChange={(e) => handleSemesterChange(e.target.value)}
                                        disabled={!selectedRepo}
                                    >
                                        <option value="">
                                            {selectedRepo ? 'Select Semester...' : 'Select Repository First'}
                                        </option>
                                        {availableSemesters.map((sem) => (
                                            <option key={sem.id} value={sem.id}>{sem.name} Semester</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-2 text-md-end">
                                {selectedSemester && (
                                    <span className="badge fw-semibold px-3 py-2" style={{
                                        background: 'rgba(37, 99, 235, 0.1)',
                                        color: '#2563eb',
                                        fontSize: '0.9rem'
                                    }}>
                                        {courseRepos.length} course{courseRepos.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {selectedSemester && (
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                             style={{ width: 48, height: 48, background: 'rgba(37, 99, 235, 0.1)' }}>
                                            <i className="bi bi-book fs-4" style={{ color: '#2563eb' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Linked Courses</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{courseRepos.length}</h4>
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
                                             style={{ width: 48, height: 48, background: 'rgba(14, 165, 233, 0.1)' }}>
                                            <i className="bi bi-clock fs-4" style={{ color: '#0ea5e9' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Total Credit Hours</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                                {courseRepos.reduce((sum, cr) => sum + (parseInt(cr.course_credit_hours) || 0), 0)}
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
                                             style={{ width: 48, height: 48, background: 'rgba(139, 92, 246, 0.1)' }}>
                                            <i className="bi bi-file-earmark fs-4" style={{ color: '#8b5cf6' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Available to Link</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{availableCourses.length}</h4>
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
                                            <i className="bi bi-check2-all fs-4" style={{ color: '#22c55e' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">All Linked</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: availableCourses.length === 0 ? '#22c55e' : '#f59e0b' }}>
                                                {availableCourses.length === 0 ? 'Yes' : 'No'}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search */}
                {selectedSemester && (
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
                )}

                {/* Course Cards Grid */}
                {!selectedSemester ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5 text-muted">
                            <i className="bi bi-diagram-3 fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                            <p className="mb-0">Please select a repository and semester above</p>
                        </div>
                    </div>
                ) : loading && courseRepos.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: '#2563eb' }} role="status"></div>
                    </div>
                ) : filteredCourseRepos.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5 text-muted">
                            <i className="bi bi-journal-x fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                            <p className="mb-0">No courses linked to this semester yet</p>
                            {role === 'hod' && (
                                <button
                                    className="btn text-white mt-3 fw-semibold"
                                    style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                                    onClick={() => setShowAddModal(true)}
                                >
                                    Link First Course
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredCourseRepos.map((cr) => (
                            <div key={cr.id} className="col-md-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden"
                                     style={{ transition: 'transform 0.2s' }}
                                     onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                     onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                    {/* Top gradient bar */}
                                    <div style={{
                                        height: 4,
                                        background: 'linear-gradient(90deg, #2563eb, #0ea5e9)'
                                    }}></div>

                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <span className="badge fw-semibold" style={{
                                                background: 'rgba(37, 99, 235, 0.1)',
                                                color: '#2563eb',
                                                fontSize: '0.85rem'
                                            }}>
                                                {cr.course_code}
                                            </span>
                                            {role === 'hod' && (
                                                <button
                                                    className="btn btn-sm btn-link text-danger p-0"
                                                    onClick={() => {
                                                        setCourseToDelete(cr);
                                                        setShowDeleteModal(true);
                                                    }}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>

                                        <h5 className="fw-bold mb-2" style={{ color: '#1e293b' }}>
                                            {cr.course_title}
                                        </h5>

                                        <div className="d-flex gap-2 mb-3">
                                            <span className="badge fw-semibold" style={{
                                                background: 'rgba(14, 165, 233, 0.1)',
                                                color: '#0ea5e9',
                                                fontSize: '0.8rem'
                                            }}>
                                                {cr.course_credit_hours} Credit Hours
                                            </span>
                                            <span className="badge fw-semibold" style={{
                                                background: 'rgba(139, 92, 246, 0.1)',
                                                color: '#8b5cf6',
                                                fontSize: '0.8rem'
                                            }}>
                                                {cr.semester_name} Sem
                                            </span>
                                        </div>

                                        <p className="text-muted mb-3" style={{ fontSize: '0.85rem', minHeight: 40 }}>
                                            {cr.course_description
                                                ? cr.course_description.length > 80
                                                    ? cr.course_description.substring(0, 80) + '...'
                                                    : cr.course_description
                                                : 'No description available'}
                                        </p>

                                        <a
                                            href={`/uploads?course_repository_id=${cr.id}`}
                                            className="btn w-100 fw-semibold"
                                            style={{
                                                background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                                                color: '#fff',
                                                border: 'none'
                                            }}
                                        >
                                            <i className="bi bi-folder2-open me-2"></i>
                                            View Uploads
                                        </a>
                                    </div>
                                    <div className="card-footer bg-light border-top-0 py-2 px-4">
                                        <small className="text-muted">
                                            <i className="bi bi-archive me-1"></i>
                                            {cr.repository_year} • Linked {new Date(cr.created_at).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Modal */}
                {showAddModal && selectedSemester && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>
                                        <i className="bi bi-link-45deg me-2" style={{ color: '#2563eb' }}></i>
                                        Link Course to Semester
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <form onSubmit={handleCreate}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Repository</label>
                                            <input
                                                type="text"
                                                className="form-control bg-light"
                                                value={`${selectedRepo?.year}`}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Semester</label>
                                            <input
                                                type="text"
                                                className="form-control bg-light"
                                                value={`${selectedSemester.name} Semester`}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Select Course</label>
                                            {availableCourses.length === 0 ? (
                                                <div className="alert alert-info">
                                                    <i className="bi bi-info-circle me-2"></i>
                                                    All available courses have been linked to this semester.
                                                </div>
                                            ) : (
                                                <select
                                                    className="form-select"
                                                    value={formData.course_id}
                                                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Choose a course...</option>
                                                    {availableCourses.map((course) => (
                                                        <option key={course.id} value={course.id}>
                                                            {course.code} - {course.title} ({course.credit_hours} hrs)
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
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
                                            disabled={loading || availableCourses.length === 0}
                                        >
                                            {loading ? 'Linking...' : 'Link Course'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation */}
                {showDeleteModal && courseToDelete && (
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
                                    <h5 className="fw-bold mb-2" style={{ color: '#1e293b' }}>Remove Course Link?</h5>
                                    <p className="text-muted mb-0">
                                        Remove <strong>{courseToDelete.course_code}</strong> from {selectedSemester?.name} Semester?
                                        All uploads for this course will be affected.
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
                                        {loading ? 'Removing...' : 'Remove'}
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

export default CourseRepository;