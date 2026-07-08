import React, {useCallback, useEffect, useState} from 'react';
import DashLayout from "../DashLayout.jsx";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import CourseRequest from "../../request/course.jsx";
import nodata from "../../../assets/img/no-data.png";


const Course = () => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const fetchCourses = useCallback(async () => {
        setLoading(true);

        try {
            const res = await CourseRequest.getAll(); // Replace with your API method

            if (res?.status === 200) {
                setCourses(res.data);
            } else {
                toast.error(res?.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const filteredCourses = courses.filter((course) =>
        Object.values(course)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );



    const totalPages = Math.ceil(filteredCourses.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentCourses = filteredCourses.slice(
        indexOfFirstRow,
        indexOfLastRow
    );
    const changePage = (page) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    return (
        <DashLayout>
            <section className="dashboard-body">
                <div className="page-header">
                    <div className={`card`}>
                        <div className={`card-header`}>
                            <div className={`d-flex align-items-center justify-content-between`}>
                                <div>
                                    <h3 className={`mb-0`}>Courses</h3>
                                    <small>List if my courses</small>
                                </div>

                                <Link to={`/course/add-course`} className={`btn btn-sm btn-outline-primary`}>Add Course</Link>
                            </div>
                        </div>

                        <div className="card-body">

                            <div className="row mb-3">
                                <div className="col-md-4 ms-auto">
                                    <div className="custom-input">
                                        <div className="input-box">
                                            <i className="ri-search-line left-icon"></i>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search course..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered table-hover text-wrap align-middle">
                                    <thead className="table-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>Info</th>
                                        <th>Semester</th>
                                        <th>Credit Hours</th>
                                        <th>Lecturer</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>

                                    <tbody>

                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-5">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : currentCourses.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center">
                                                <p className={`mt-5`}>No courses found.</p>
                                                <img src={nodata} alt={nodata} className={`img-fluid`} style={{ width: "15rem" }} />
                                            </td>
                                        </tr>
                                    ) : (
                                        currentCourses.map((course, index) => (
                                            <tr key={course.id}>
                                                <td>{indexOfFirstRow + index + 1}</td>
                                                <td>
                                                    <small>{course.code}</small>
                                                    <p className={`mb-0 fw-bold`}>{course.title}</p>
                                                </td>
                                                <td>{course.semester} semester</td>
                                                <td>{course.credit_hours} credit</td>
                                                <td>
                                                    <small>{course.lecturer_name}</small>
                                                    <p className={`mb-0 fw-bold`}>{course.lecturer_email}</p>
                                                </td>
                                                <td>
                                                    {/*{new Date(course.created_at).toLocaleDateString()}*/}
                                                    <div>
                                                        <Link
                                                            to={`/course/delete-course/${course.id}`}
                                                            state={{ course }}
                                                            className="btn btn-sm btn-danger"
                                                        >
                                                            <i className="ri-delete-bin-7-fill"></i>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}

                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <nav className="mt-3">
                                    <ul className="pagination justify-content-end">

                                        <li
                                            className={`page-item ${
                                                currentPage === 1 ? "disabled" : ""
                                            }`}>
                                            <button
                                                className="page-link"
                                                onClick={() => changePage(currentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                        </li>

                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <li
                                                key={i + 1}
                                                className={`page-item ${
                                                    currentPage === i + 1 ? "active" : ""
                                                }`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => changePage(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}

                                        <li
                                            className={`page-item ${
                                                currentPage === totalPages ? "disabled" : ""
                                            }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => changePage(currentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </li>

                                    </ul>
                                </nav>
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </DashLayout>
    );
};

export default Course;