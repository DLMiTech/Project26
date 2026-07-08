import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const Uploads = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;
    const userId = userData?.id;
    const [searchParams] = useSearchParams();
    const urlCourseRepoId = searchParams.get('course_repository_id');

    const [uploads, setUploads] = useState([]);
    const [courseRepos, setCourseRepos] = useState([]);
    const [allSemesters, setAllSemesters] = useState([]);
    const [allRepos, setAllRepos] = useState([]);
    const [selectedCourseRepo, setSelectedCourseRepo] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [uploadToDelete, setUploadToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({
        course_repository_id: urlCourseRepoId || '',
        index_number: '',
        serial_number: ''
    });

    // Fetch all data for selectors
    const fetchAllData = useCallback(async () => {
        try {
            const [reposRes, semsRes, courseRes] = await Promise.all([
                axios.get(`${BASE_URL}/repository`, { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }),
                axios.get(`${BASE_URL}/semester-repo`, { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }),
                axios.get(`${BASE_URL}/course-repository`, { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } })
            ]);

            if (reposRes.data?.success) setAllRepos(reposRes.data.data || []);
            if (semsRes.data?.success) setAllSemesters(semsRes.data.data || []);
            if (courseRes.data?.success) setCourseRepos(courseRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch selector data', err.message);
        }
    }, []);

    const fetchUploads = useCallback(async (courseRepoId) => {
        if (!courseRepoId) return;
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/uploads/course/${courseRepoId}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                setUploads(response.data.data || []);
            }
        } catch (err) {
            if (err.response?.status !== 403) {
                toast.error(err.response?.data?.message || 'Failed to fetch uploads');
            } else {
                toast.error('You do not have access to view these uploads');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        if (urlCourseRepoId && courseRepos.length > 0) {
            const found = courseRepos.find(c => c.id == urlCourseRepoId);
            if (found) {
                setSelectedCourseRepo(found);
                const sem = allSemesters.find(s => s.id == found.semester_id);
                setSelectedSemester(sem || null);
                const repo = allRepos.find(r => r.id == sem?.repository_id);
                setSelectedRepo(repo || null);
                fetchUploads(urlCourseRepoId);
            }
        }
    }, [urlCourseRepoId, courseRepos, allSemesters, allRepos, fetchUploads]);

    const handleRepoChange = (repoId) => {
        const repo = allRepos.find(r => r.id == repoId);
        setSelectedRepo(repo || null);
        setSelectedSemester(null);
        setSelectedCourseRepo(null);
        setUploads([]);
    };

    const handleSemesterChange = (semId) => {
        const sem = allSemesters.find(s => s.id == semId);
        setSelectedSemester(sem || null);
        setSelectedCourseRepo(null);
        setUploads([]);
    };

    const handleCourseRepoChange = (courseRepoId) => {
        const cr = courseRepos.find(c => c.id == courseRepoId);
        setSelectedCourseRepo(cr || null);
        setFormData(prev => ({ ...prev, course_repository_id: courseRepoId }));
        if (cr) fetchUploads(cr.id);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        const data = new FormData();
        data.append('file', file);
        data.append('course_repository_id', formData.course_repository_id);
        if (formData.index_number) data.append('index_number', formData.index_number);
        if (formData.serial_number) data.append('serial_number', formData.serial_number);

        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/uploads`, data, {
                headers: {
                    Authorization: `Bearer ${AuthVerify.getToken()}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data?.success) {
                toast.success('File uploaded successfully');
                setShowUploadModal(false);
                setFile(null);
                setFormData(prev => ({ ...prev, index_number: '', serial_number: '' }));
                fetchUploads(formData.course_repository_id);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!uploadToDelete) return;
        setLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/uploads/${uploadToDelete.id}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                toast.success('File deleted');
                setShowDeleteModal(false);
                setUploadToDelete(null);
                fetchUploads(selectedCourseRepo.id);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete file');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (uploadId, fileName) => {
        try {
            const response = await axios.get(`${BASE_URL}/uploads/download/${uploadId}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'download');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error('Download failed - check your access permissions', err.message);
        }
    };

    const handleDownloadAll = async () => {
        if (!selectedCourseRepo) return;
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/uploads/download-all/${selectedCourseRepo.id}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedCourseRepo.course_code}_files.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Download started');
        } catch (err) {
            toast.error('Download failed - check your access permissions', err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter available options based on parent selection
    const availableSemesters = selectedRepo
        ? allSemesters.filter(s => s.repository_id == selectedRepo.id)
        : [];
    const availableCourseRepos = selectedSemester
        ? courseRepos.filter(c => c.semester_id == selectedSemester.id)
        : [];

    const filteredUploads = uploads.filter(u =>
        u.file_path?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.index_number?.toString().includes(searchTerm) ||
        u.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getFileIcon = (filePath) => {
        const ext = filePath?.split('.').pop()?.toLowerCase();
        const iconMap = {
            pdf: 'bi-file-earmark-pdf',
            doc: 'bi-file-earmark-word',
            docx: 'bi-file-earmark-word',
            xls: 'bi-file-earmark-excel',
            xlsx: 'bi-file-earmark-excel',
            ppt: 'bi-file-earmark-ppt',
            pptx: 'bi-file-earmark-ppt',
            jpg: 'bi-file-earmark-image',
            jpeg: 'bi-file-earmark-image',
            png: 'bi-file-earmark-image',
            zip: 'bi-file-earmark-zip',
            rar: 'bi-file-earmark-zip'
        };
        return iconMap[ext] || 'bi-file-earmark';
    };

    const getFileColor = (filePath) => {
        const ext = filePath?.split('.').pop()?.toLowerCase();
        const colorMap = {
            pdf: '#ef4444',
            doc: '#2563eb',
            docx: '#2563eb',
            xls: '#22c55e',
            xlsx: '#22c55e',
            ppt: '#f59e0b',
            pptx: '#f59e0b',
            jpg: '#8b5cf6',
            jpeg: '#8b5cf6',
            png: '#8b5cf6',
            zip: '#64748b',
            rar: '#64748b'
        };
        return colorMap[ext] || '#94a3b8';
    };

    return (
        <DashLayout>
            <section className="dashboard-body">
                {/* Header */}
                <div className="page-header d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1e293b' }}>Uploads</h2>
                        <p className="text-muted mb-0">
                            {selectedCourseRepo
                                ? `${selectedCourseRepo.course_code} - ${selectedCourseRepo.course_title}`
                                : 'Select a course to view uploads'}
                        </p>
                    </div>
                    {selectedCourseRepo && (
                        <div className="d-flex gap-2">
                            <button
                                className="btn fw-semibold"
                                style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', border: 'none' }}
                                onClick={handleDownloadAll}
                                disabled={uploads.length === 0 || loading}
                            >
                                <i className="bi bi-download me-2"></i>
                                Download All
                            </button>
                            <button
                                className="btn text-white fw-semibold"
                                style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, course_repository_id: selectedCourseRepo.id }));
                                    setShowUploadModal(true);
                                }}
                            >
                                <i className="bi bi-cloud-upload me-2"></i>Upload File
                            </button>
                        </div>
                    )}
                </div>

                {/* Three-Step Selector */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-4">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-archive me-2" style={{ color: '#2563eb' }}></i>
                                    <span className="fw-semibold text-muted me-2" style={{ whiteSpace: 'nowrap' }}>Year:</span>
                                    <select
                                        className="form-select fw-semibold"
                                        style={{ color: '#2563eb', borderColor: 'rgba(37, 99, 235, 0.3)' }}
                                        value={selectedRepo?.id || ''}
                                        onChange={(e) => handleRepoChange(e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        {allRepos.sort((a, b) => b.year - a.year).map(r => (
                                            <option key={r.id} value={r.id}>{r.year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-calendar me-2" style={{ color: selectedRepo ? '#2563eb' : '#cbd5e1' }}></i>
                                    <span className="fw-semibold text-muted me-2" style={{ whiteSpace: 'nowrap' }}>Semester:</span>
                                    <select
                                        className="form-select fw-semibold"
                                        style={{ color: selectedSemester ? '#2563eb' : '#94a3b8' }}
                                        value={selectedSemester?.id || ''}
                                        onChange={(e) => handleSemesterChange(e.target.value)}
                                        disabled={!selectedRepo}
                                    >
                                        <option value="">{selectedRepo ? 'Select...' : 'Select Year First'}</option>
                                        {availableSemesters.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} Semester</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-book me-2" style={{ color: selectedSemester ? '#2563eb' : '#cbd5e1' }}></i>
                                    <span className="fw-semibold text-muted me-2" style={{ whiteSpace: 'nowrap' }}>Course:</span>
                                    <select
                                        className="form-select fw-semibold"
                                        style={{ color: selectedCourseRepo ? '#2563eb' : '#94a3b8' }}
                                        value={selectedCourseRepo?.id || ''}
                                        onChange={(e) => handleCourseRepoChange(e.target.value)}
                                        disabled={!selectedSemester}
                                    >
                                        <option value="">{selectedSemester ? 'Select...' : 'Select Semester First'}</option>
                                        {availableCourseRepos.map(c => (
                                            <option key={c.id} value={c.id}>{c.course_code} - {c.course_title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {selectedCourseRepo && (
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                             style={{ width: 48, height: 48, background: 'rgba(37, 99, 235, 0.1)' }}>
                                            <i className="bi bi-files fs-4" style={{ color: '#2563eb' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Total Files</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{uploads.length}</h4>
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
                                            <i className="bi bi-person fs-4" style={{ color: '#0ea5e9' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Uploaded By</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: '#1e293b', fontSize: '1.1rem' }}>
                                                {uploads[0]?.lecture_name || '-'}
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
                                            <i className="bi bi-calendar-check fs-4" style={{ color: '#8b5cf6' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Latest Upload</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                                                {uploads.length > 0
                                                    ? new Date(Math.max(...uploads.map(u => new Date(u.created_at)))).toLocaleDateString()
                                                    : '-'
                                                }
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
                                            <i className="bi bi-hdd fs-4" style={{ color: '#22c55e' }}></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">My Uploads</h6>
                                            <h4 className="fw-bold mb-0" style={{ color: '#22c55e' }}>
                                                {uploads.filter(u => u.lecture_id == userId).length}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search */}
                {selectedCourseRepo && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-search" style={{ color: '#94a3b8' }}></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search by filename, index or serial number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Uploads List */}
                {!selectedCourseRepo ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5 text-muted">
                            <i className="bi bi-folder2-open fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                            <p className="mb-0">Please select a repository, semester, and course above</p>
                        </div>
                    </div>
                ) : loading && uploads.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: '#2563eb' }} role="status"></div>
                    </div>
                ) : filteredUploads.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5 text-muted">
                            <i className="bi bi-cloud-upload fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                            <p className="mb-0">No uploads found for this course</p>
                            <button
                                className="btn text-white mt-3 fw-semibold"
                                style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                                onClick={() => setShowUploadModal(true)}
                            >
                                Upload First File
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                    <i className="bi bi-folder2-open me-2" style={{ color: '#2563eb' }}></i>
                                    Course Files
                                </h5>
                                <span className="badge rounded-pill" style={{
                                    background: 'rgba(37, 99, 235, 0.1)',
                                    color: '#2563eb'
                                }}>
                                    {filteredUploads.length} file{filteredUploads.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="fw-semibold text-muted ps-4">File</th>
                                        <th className="fw-semibold text-muted">Index #</th>
                                        <th className="fw-semibold text-muted">Serial #</th>
                                        <th className="fw-semibold text-muted">Uploaded By</th>
                                        <th className="fw-semibold text-muted">Date</th>
                                        <th className="fw-semibold text-muted text-end pe-4">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredUploads.map((upload) => {
                                        const fileName = upload.file_path?.split('/').pop() || 'Unknown';
                                        const isMine = upload.lecture_id == userId;
                                        return (
                                            <tr key={upload.id}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded d-flex align-items-center justify-content-center me-3"
                                                             style={{
                                                                 width: 40,
                                                                 height: 40,
                                                                 background: `${getFileColor(upload.file_path)}15`
                                                             }}>
                                                            <i className={`bi ${getFileIcon(upload.file_path)} fs-5`}
                                                               style={{ color: getFileColor(upload.file_path) }}></i>
                                                        </div>
                                                        <div>
                                                            <div className="fw-semibold" style={{
                                                                color: '#1e293b',
                                                                maxWidth: 250,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}>
                                                                {fileName}
                                                            </div>
                                                            <small className="text-muted">
                                                                {upload.course_code} • {upload.semester_name} Sem
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {upload.index_number ? (
                                                        <span className="badge fw-semibold" style={{
                                                            background: 'rgba(37, 99, 235, 0.1)',
                                                            color: '#2563eb'
                                                        }}>
                                                                #{upload.index_number}
                                                            </span>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <small className="text-muted">{upload.serial_number || '-'}</small>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                                             style={{
                                                                 width: 28,
                                                                 height: 28,
                                                                 background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                                                                 fontSize: 11
                                                             }}>
                                                                <span className="text-white fw-bold">
                                                                    {upload.lecture_name?.charAt(0)?.toUpperCase()}
                                                                </span>
                                                        </div>
                                                        <small className="fw-semibold" style={{ color: '#1e293b' }}>
                                                            {upload.lecture_name}
                                                            {isMine && <span className="text-muted fw-normal"> (You)</span>}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {new Date(upload.created_at).toLocaleDateString()}
                                                    </small>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <button
                                                        className="btn btn-sm fw-semibold me-2"
                                                        style={{
                                                            background: 'rgba(37, 99, 235, 0.1)',
                                                            color: '#2563eb',
                                                            border: 'none'
                                                        }}
                                                        onClick={() => handleDownload(upload.id, fileName)}
                                                    >
                                                        <i className="bi bi-download me-1"></i>Download
                                                    </button>
                                                    {(role === 'hod' || isMine) && (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => {
                                                                setUploadToDelete(upload);
                                                                setShowDeleteModal(true);
                                                            }}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Modal */}
                {showUploadModal && selectedCourseRepo && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>
                                        <i className="bi bi-cloud-upload me-2" style={{ color: '#2563eb' }}></i>
                                        Upload File
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => {
                                        setShowUploadModal(false);
                                        setFile(null);
                                    }}></button>
                                </div>
                                <form onSubmit={handleUpload}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Course</label>
                                            <input
                                                type="text"
                                                className="form-control bg-light"
                                                value={`${selectedCourseRepo.course_code} - ${selectedCourseRepo.course_title}`}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">File</label>
                                            <div className="border rounded-3 p-4 text-center" style={{
                                                borderStyle: 'dashed',
                                                borderColor: file ? '#2563eb' : '#cbd5e1',
                                                background: file ? 'rgba(37, 99, 235, 0.03)' : '#f8fafc'
                                            }}>
                                                <input
                                                    type="file"
                                                    className="d-none"
                                                    id="fileInput"
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                    required
                                                />
                                                <label htmlFor="fileInput" className="cursor-pointer" style={{ cursor: 'pointer' }}>
                                                    {file ? (
                                                        <div>
                                                            <i className="bi bi-check-circle-fill fs-2 mb-2 d-block" style={{ color: '#22c55e' }}></i>
                                                            <p className="fw-semibold mb-0" style={{ color: '#1e293b' }}>{file.name}</p>
                                                            <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <i className="bi bi-cloud-arrow-up fs-2 mb-2 d-block" style={{ color: '#2563eb' }}></i>
                                                            <p className="fw-semibold mb-1" style={{ color: '#1e293b' }}>Click to select file</p>
                                                            <small className="text-muted">or drag and drop here</small>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold text-muted">Index Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="e.g., 04/2020/100D"
                                                    value={formData.index_number}
                                                    onChange={(e) => setFormData({ ...formData, index_number: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold text-muted">Serial Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="e.g., 0330180"
                                                    value={formData.serial_number}
                                                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top">
                                        <button type="button" className="btn btn-light" onClick={() => {
                                            setShowUploadModal(false);
                                            setFile(null);
                                        }}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn text-white fw-semibold"
                                            style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', border: 'none' }}
                                            disabled={loading || !file}
                                        >
                                            {loading ? 'Uploading...' : 'Upload'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation */}
                {showDeleteModal && uploadToDelete && (
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
                                    <h5 className="fw-bold mb-2" style={{ color: '#1e293b' }}>Delete File?</h5>
                                    <p className="text-muted mb-0">
                                        Are you sure you want to delete this file? This action cannot be undone.
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

export default Uploads;