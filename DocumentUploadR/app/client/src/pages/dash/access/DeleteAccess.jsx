import React, {useState} from 'react';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import DashLayout from "../DashLayout.jsx";
import {toast} from "react-toastify";
import AccessRequest from "../../request/access.jsx";

const DeleteAccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const access = location.state?.access;

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        try {
            const res = await AccessRequest.deleteAccess(id);

            if (res?.status === 200) {
                toast.success(res.message);
                navigate("/access-control/get-all");
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
                                    to="/access-control/get-all"
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    <i className="ri-arrow-left-line me-1"></i>
                                    Back
                                </Link>

                                <div className="text-end">
                                    <h3 className="mb-0">Delete Access</h3>
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
                                    Are you sure you want to delete this access?
                                    This action cannot be undone.
                                </p>

                                {access && (
                                    <div className="border rounded p-3 bg-white text-dark mb-3">
                                        <p className="mb-1">
                                            <strong>Course Code:</strong> {access.course_code || ""}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Course title:</strong> {access.course_title || ""}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Lecturer name:</strong> {access.lecturer_name || ""}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Access level:</strong> {access.access_level || ""}
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
                                                Delete Access
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        to="/access-control/get-all"
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

export default DeleteAccess;