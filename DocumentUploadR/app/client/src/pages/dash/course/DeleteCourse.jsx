import React, { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DashLayout from "../DashLayout.jsx";
import CourseRequest from "../../request/course.jsx";

const DeleteCourse = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const course = location.state?.course;

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        try {
            const res = await CourseRequest.delete(id);

            if (res?.status === 200) {
                toast.success(res.message);
                navigate("/course");
            } else {
                toast.error(res?.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashLayout>
            <section className="dashboard-body">
                <div className="page-header">
                    <div className="card">

                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <Link
                                    to="/course"
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    <i className="ri-arrow-left-line me-1"></i>
                                    Back
                                </Link>

                                <div className="text-end">
                                    <h3 className="mb-0">Delete Course</h3>
                                    <small>Confirm before deleting</small>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">

                            <div className="alert alert-danger">
                                <h5 className="alert-heading">
                                    <i className="ri-error-warning-fill me-2"></i>
                                    Confirm Delete
                                </h5>

                                <p className="mb-3">
                                    Are you sure you want to delete this course?
                                    This action cannot be undone.
                                </p>

                                {course && (
                                    <div className="border rounded p-3 bg-white text-dark mb-3">
                                        <p className="mb-1">
                                            <strong>Course Code:</strong> {course.code}
                                        </p>

                                        <p className="mb-1">
                                            <strong>Title:</strong> {course.title}
                                        </p>

                                        <p className="mb-1">
                                            <strong>Semester:</strong> {course.semester}
                                        </p>

                                        <p className="mb-0">
                                            <strong>Credit Hours:</strong> {course.credit_hours}
                                        </p>
                                    </div>
                                )}

                                <div className="d-flex gap-2">

                                    <button
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                ></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-delete-bin-7-fill me-1"></i>
                                                Delete Course
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        to="/course"
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </Link>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </DashLayout>
    );
};

export default DeleteCourse;