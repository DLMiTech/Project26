import React, { useState, useEffect, useCallback } from 'react';
import DashLayout from "../DashLayout.jsx";
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthVerify from "../../../service/AuthVerify.jsx";
import URLService from "../../../service/URLService.jsx";

const BASE_URL = URLService.baseURL() || 'http://localhost:3001/api';

const LectureCourses = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;
    const userId = userData?.id;

    const [lectureCourses, setLectureCourses] = useState([]);
    const [allLectures, setAllLectures] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        user_id: '',
        course_id: '',
        semester: '1st'
    });

    // Fetch data based on role
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (role === 'hod') {
                // HOD sees all lecture-course assignments
                const response = await axios.get(`${BASE_URL}/lecture-courses`, {
                    headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
                });
                if (response.data?.success) {
                    setLectureCourses(response.data.data || []);
                }
            } else {
                // Lecture sees only their own
                const response = await axios.get(`${BASE_URL}/lecture-courses/my-courses`, {
                    headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
                });
                if (response.data?.success) {
                    setLectureCourses(response.data.data || []);
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch lecture courses');
        } finally {
            setLoading(false);
        }
    }, [role]);

    const fetchLecturesAndCourses = useCallback(async () => {
        if (role !== 'hod') return;
        try {
            const [lecturesRes, coursesRes] = await Promise.all([
                axios.get(`${BASE_URL}/auth/lectures`, {
                    headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
                }),
                axios.get(`${BASE_URL}/courses`, {
                    headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
                })
            ]);

            console.log(lecturesRes);

            if (lecturesRes.data?.success) {
                setAllLectures(lecturesRes.data.data || []);
            }
            if (coursesRes.data?.success) {
                setAllCourses(coursesRes.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch lectures or courses', err.message);
        }
    }, [role]);

    useEffect(() => {
        fetchData();
        fetchLecturesAndCourses();
    }, [fetchData, fetchLecturesAndCourses]);

    const handleAssign = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/lecture-courses`,
                formData,
                { headers: { Authorization: `Bearer ${AuthVerify.getToken()}` } }
            );
            if (response.data?.success) {
                toast.success('Course assigned to lecture successfully');
                setShowAssignModal(false);
                setFormData({ user_id: '', course_id: '', semester: '1st' });
                fetchData();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to assign course');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this course assignment?')) return;
        setLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/lecture-courses/${id}`, {
                headers: { Authorization: `Bearer ${AuthVerify.getToken()}` }
            });
            if (response.data?.success) {
                toast.success('Course assignment removed');
                fetchData();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove assignment');
        } finally {
            setLoading(false);
        }
    };

    const handleViewLectureCourses = (lectureId) => {
        setSelectedLecture(lectureId);
    };

    const filteredCourses = lectureCourses.filter(lc =>
        lc.lecture_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lc.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lc.course_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const semesterBadge = (semester) => {
        const style = semester === '1st'
            ? { background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }
            : { background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' };
        return (
            <span className="badge fw-semibold" style={{ ...style, fontSize: '0.8rem' }}>
                {semester} Semester
            </span>
        );
    };

    // Group by lecture for HOD view
    const groupedByLecture = filteredCourses.reduce((acc, item) => {
        const key = item.lecture_id;
        if (!acc[key]) {
            acc[key] = {
                lecture_id: item.lecture_id,
                lecture_name: item.lecture_name,
                lecture_email: item.lecture_email,
                courses: []
            };
        }
        acc[key].courses.push(item);
        return acc;
    }, {});

    const lectureGroups = Object.values(groupedByLecture);

    return (
        <DashLayout>
            <section className="dashboard-body">
                {/* Header */}
                <div className="page-header d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1e293b' }}>
                            {role === 'hod' ? 'Lecture Courses' : 'My Courses'}
                        </h2>
                        <p className="text-muted mb-0">
                            {role === 'hod'
                                ? 'Manage course assignments for lectures'
                                : 'View your assigned courses'}
                        </p>
                    </div>
                    {role === 'hod' && (
                        <button
                            className="btn text-white fw-semibold"
                            style={{ background: 'linear-gradient(135deg, #0ab39c, #405189)', border: 'none' }}
                            onClick={() => {
                                setFormData({ user_id: '', course_id: '', semester: '1st' });
                                setShowAssignModal(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-2"></i>Assign Course
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
                                        <i className="bi bi-link-45deg fs-4" style={{ color: '#2563eb' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Total Assignments</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{lectureCourses.length}</h4>
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
                                        <i className="bi bi-people fs-4" style={{ color: '#22c55e' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">
                                            {role === 'hod' ? 'Lectures' : 'Courses'}
                                        </h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                            {role === 'hod' ? lectureGroups.length : lectureCourses.length}
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
                                         style={{ width: 48, height: 48, background: 'rgba(37, 99, 235, 0.1)' }}>
                                        <i className="bi bi-1-circle fs-4" style={{ color: '#2563eb' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">1st Semester</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#2563eb' }}>
                                            {lectureCourses.filter(c => c.semester === '1st').length}
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
                                         style={{ width: 48, height: 48, background: 'rgba(14, 165, 233, 0.1)' }}>
                                        <i className="bi bi-2-circle fs-4" style={{ color: '#0ea5e9' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">2nd Semester</h6>
                                        <h4 className="fw-bold mb-0" style={{ color: '#0ea5e9' }}>
                                            {lectureCourses.filter(c => c.semester === '2nd').length}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-search" style={{ color: '#94a3b8' }}></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder={role === 'hod' ? "Search by lecture name or course..." : "Search your courses..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* HOD View - Grouped by Lecture */}
                {role === 'hod' && (
                    <div>
                        {loading && lectureCourses.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: '#2563eb' }} role="status"></div>
                            </div>
                        ) : lectureGroups.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-person-workspace fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                                <p className="mb-0">No course assignments found</p>
                            </div>
                        ) : (
                            lectureGroups.map((group) => (
                                <div key={group.lecture_id} className="card border-0 shadow-sm mb-3">
                                    <div className="card-header bg-white border-bottom py-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                     style={{
                                                         width: 44,
                                                         height: 44,
                                                         background: 'linear-gradient(135deg, #0ab39c, #405189)'
                                                     }}>
                                                    <span className="text-white fw-bold">
                                                        {group.lecture_name?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{group.lecture_name}</h6>
                                                    <small className="text-muted">{group.lecture_email}</small>
                                                </div>
                                            </div>
                                            <span className="badge rounded-pill" style={{
                                                background: 'rgba(37, 99, 235, 0.1)',
                                                color: '#2563eb'
                                            }}>
                                                {group.courses.length} course{group.courses.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0 align-middle">
                                                <thead className="bg-light">
                                                <tr>
                                                    <th className="fw-semibold text-muted ps-4">Course Code</th>
                                                    <th className="fw-semibold text-muted">Title</th>
                                                    <th className="fw-semibold text-muted">Semester</th>
                                                    <th className="fw-semibold text-muted">Credit Hours</th>
                                                    <th className="fw-semibold text-muted text-end pe-4">Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {group.courses.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="ps-4">
                                                                <span className="badge fw-semibold" style={{
                                                                    background: 'rgba(37, 99, 235, 0.1)',
                                                                    color: '#2563eb',
                                                                    fontSize: '0.85rem'
                                                                }}>
                                                                    {item.course_code}
                                                                </span>
                                                        </td>
                                                        <td>
                                                            <div className="fw-semibold" style={{ color: '#1e293b' }}>
                                                                {item.course_title}
                                                            </div>
                                                        </td>
                                                        <td>{semesterBadge(item.semester)}</td>
                                                        <td>
                                                                <span className="badge fw-semibold" style={{
                                                                    background: 'rgba(14, 165, 233, 0.1)',
                                                                    color: '#0ea5e9',
                                                                    fontSize: '0.85rem'
                                                                }}>
                                                                    {item.course_credit_hours} hrs
                                                                </span>
                                                        </td>
                                                        <td className="text-end pe-4">
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <i className="bi bi-trash me-1"></i>Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Lecture View - My Courses Table */}
                {role === 'lecture' && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                    <i className="bi bi-book me-2" style={{ color: '#2563eb' }}></i>
                                    My Assigned Courses
                                </h5>
                                <span className="badge rounded-pill" style={{
                                    background: 'rgba(37, 99, 235, 0.1)',
                                    color: '#2563eb'
                                }}>
                                    {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {loading && lectureCourses.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: '#2563eb' }} role="status"></div>
                                </div>
                            ) : filteredCourses.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-journal-x fs-1 mb-3 d-block" style={{ color: '#cbd5e1' }}></i>
                                    <p className="mb-0">No courses assigned to you yet</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="fw-semibold text-muted ps-4">Course Code</th>
                                            <th className="fw-semibold text-muted">Title</th>
                                            <th className="fw-semibold text-muted">Semester</th>
                                            <th className="fw-semibold text-muted">Credit Hours</th>
                                            <th className="fw-semibold text-muted">Description</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredCourses.map((item) => (
                                            <tr key={item.id}>
                                                <td className="ps-4">
                                                        <span className="badge fw-semibold" style={{
                                                            background: 'rgba(37, 99, 235, 0.1)',
                                                            color: '#2563eb',
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            {item.course_code}
                                                        </span>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold" style={{ color: '#1e293b' }}>
                                                        {item.course_title}
                                                    </div>
                                                </td>
                                                <td>{semesterBadge(item.semester)}</td>
                                                <td>
                                                        <span className="badge fw-semibold" style={{
                                                            background: 'rgba(14, 165, 233, 0.1)',
                                                            color: '#0ea5e9',
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            {item.course_credit_hours} hrs
                                                        </span>
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {item.course_description
                                                            ? item.course_description.length > 50
                                                                ? item.course_description.substring(0, 50) + '...'
                                                                : item.course_description
                                                            : '-'
                                                        }
                                                    </small>
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

                {/* Assign Modal */}
                {showAssignModal && role === 'hod' && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold" style={{ color: '#1e293b' }}>
                                        <i className="bi bi-plus-circle me-2" style={{ color: '#2563eb' }}></i>
                                        Assign Course to Lecture
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
                                </div>
                                <form onSubmit={handleAssign}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Select Lecture</label>
                                            <select
                                                className="form-select"
                                                value={formData.user_id}
                                                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                                required
                                            >
                                                <option value="">Choose a lecture...</option>
                                                {allLectures.map((lecture) => (
                                                    <option key={lecture.id} value={lecture.id}>
                                                        {lecture.name} ({lecture.email})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Select Course</label>
                                            <select
                                                className="form-select"
                                                value={formData.course_id}
                                                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                                required
                                            >
                                                <option value="">Choose a course...</option>
                                                {allCourses.map((course) => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.code} - {course.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted">Semester</label>
                                            <div className="d-flex gap-3">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="semester"
                                                        id="sem1st"
                                                        value="1st"
                                                        checked={formData.semester === '1st'}
                                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                                    />
                                                    <label className="form-check-label fw-semibold" htmlFor="sem1st">
                                                        1st Semester
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="semester"
                                                        id="sem2nd"
                                                        value="2nd"
                                                        checked={formData.semester === '2nd'}
                                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                                    />
                                                    <label className="form-check-label fw-semibold" htmlFor="sem2nd">
                                                        2nd Semester
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top">
                                        <button type="button" className="btn btn-light" onClick={() => setShowAssignModal(false)}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn text-white fw-semibold"
                                            style={{ background: 'linear-gradient(135deg, #0ab39c, #405189)', border: 'none' }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Assigning...' : 'Assign Course'}
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

export default LectureCourses;