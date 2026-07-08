import React, { useState } from "react";
import DashLayout from "../DashLayout.jsx";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AccessRequest from "../../request/access.jsx";

const GrantAccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const access = location.state?.access;

    const [loading, setLoading] = useState(false);

    const [grantAccess, setGrantAccess] = useState({
        start_datetime: "",
        end_datetime: "",
        status: "approve",
    });

    const validate = () => {
        if (!grantAccess.start_datetime || !grantAccess.end_datetime || !grantAccess.status) {
            toast.warn("All fields are required to grant access.");
            return false;
        }
        return true;
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        setGrantAccess((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const payload = {
                ...grantAccess,
            };

            const res = await AccessRequest.grant(payload, id);

            console.log(res)

            if (res?.status === 200) {
                toast.success(res.message);
                navigate("/access-control");
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
                                    to="/access-control"
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    <i className="ri-arrow-left-line me-1"></i>
                                    Back
                                </Link>

                                <div className="text-end">
                                    <h3 className="mb-0">
                                        Grant Access
                                    </h3>
                                    <small>
                                        Grant or decline lecturer access
                                    </small>
                                </div>

                            </div>
                        </div>

                        <div className="card-body">

                            <div className="alert alert-info">
                                Review the access request below before granting or declining it.
                            </div>

                            {/* Request Information */}
                            <div className="card border mb-4">
                                <div className="card-header fw-bold">
                                    Request Information
                                </div>

                                <div className="card-body">
                                    <div className="row gy-3">

                                        <div className="col-md-6">
                                            <strong>Lecturer</strong>
                                            <p className="mb-0">{access?.lecturer_name}</p>
                                        </div>

                                        <div className="col-md-6">
                                            <strong>Email</strong>
                                            <p className="mb-0">{access?.lecturer_email}</p>
                                        </div>

                                        <div className="col-md-6">
                                            <strong>Course</strong>
                                            <p className="mb-0">
                                                {access?.course_code} - {access?.course_title}
                                            </p>
                                        </div>

                                        <div className="col-md-3">
                                            <strong>Semester</strong>
                                            <p className="mb-0">{access?.semester}</p>
                                        </div>

                                        <div className="col-md-3">
                                            <strong>Access Level</strong>
                                            <p className="mb-0 text-capitalize">
                                                {access?.access_level}
                                            </p>
                                        </div>

                                        <div className="col-md-12">
                                            <strong>Current Status</strong>
                                            <p className="mb-0">
                        <span className="badge bg-warning text-dark">
                            {access?.status}
                        </span>
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Grant Access Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">

                                    <div className="col-md-6">
                                        <div className="custom-input">
                                            <label>Start Date & Time <span className={`text-danger`}>*</span></label>
                                            <div className="input-box">

                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    name="start_datetime"
                                                    value={grantAccess.start_datetime}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="custom-input">
                                            <label>End Date & Time <span className={`text-danger`}>*</span></label>
                                            <div className="input-box">

                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    name="end_datetime"
                                                    value={grantAccess.end_datetime}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="custom-input">
                                            <label>Status <span className={`text-danger`}>*</span></label>
                                            <div className="input-box">

                                                <select
                                                    className="form-select"
                                                    name="status"
                                                    value={grantAccess.status}
                                                    onChange={handleChange}
                                                >
                                                    <option value="approve">Approve</option>
                                                    <option value="decline">Decline</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <button
                                            className="btn btn-primary me-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="ri-check-line me-1"></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>

                                        <Link
                                            to="/access-control"
                                            className="btn btn-secondary">
                                            Cancel
                                        </Link>
                                    </div>

                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </section>
        </DashLayout>
    );
};

export default GrantAccess;