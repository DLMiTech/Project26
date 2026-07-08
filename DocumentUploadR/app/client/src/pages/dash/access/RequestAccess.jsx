import React, {useCallback, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import DashLayout from "../DashLayout.jsx";
import {toast} from "react-toastify";
import CourseRequest from "../../request/course.jsx";
import AccessRequest from "../../request/access.jsx";

const RequestAccess = () => {
    const [loading, setLoading] = useState(false);
    const [requestForm, setRequestForm] = useState(
        {course_id:"", semester:"", access_level:"", note:""})
    const [loadingCourse, setLoadingCourse] = useState(false);
    const [courses, setCourses] = useState([]);


    const fetchCourses = useCallback(async () => {
        setLoadingCourse(true);

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
            setLoadingCourse(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const validate = () => {
        if (!requestForm.course_id || !requestForm.semester || !requestForm.access_level ) {
            toast.warn("All fields with * are required to request for access.");
            return false;
        }
        return true;
    }
    const handleRequestAccess = (e) => {
        setRequestForm({
            ...requestForm,
            [e.target.name]: e.target.value});
    }

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            //Call API
            const payload = {
                ...requestForm,
            }

            const res = await AccessRequest.requestAccess(payload);

            if (res?.status === 201) {
                toast.success(res?.message);
                setRequestForm({
                    course_id:"", semester:"", access_level:"", note:""
                })
            } else {
                toast.error(res?.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }


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
                                    <h3 className="mb-0">Request Access</h3>
                                    <small>You access will be approved after request</small>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <form action="" onSubmit={handleSubmitRequest}>
                                <div className={`row`}>
                                    <div className={`col-md-6`}>
                                        <div className="custom-input">
                                            <label>Select course <span className={`text-danger`}>*</span></label>
                                            <div className="input-box">

                                                <select
                                                    className="form-control"
                                                    value={requestForm.course_id}
                                                    onChange={handleRequestAccess}
                                                    name="course_id"
                                                >
                                                    <option value="">{loadingCourse ? "Loading courses" : "Select access level"}</option>
                                                    {courses.map((course) => (
                                                        <option key={course.id} value={course.id}>{course.title} - {course.code}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`col-md-6`}>
                                    </div>

                                    <div className={`col-md-6`}>
                                        <div className="custom-input">
                                            <label>Select semester<span className={`text-danger`}>*</span></label>
                                            <div className="input-box">

                                                <select
                                                    className="form-control"
                                                    value={requestForm.semester}
                                                    onChange={handleRequestAccess}
                                                    name="semester"
                                                >
                                                    <option value="">Select Semester</option>
                                                    <option value="1st">First Semester</option>
                                                    <option value="2nd">Second Semester</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`col-md-6`}>
                                        <div className="custom-input">
                                            <label>Access level <span className={`text-danger`}>*</span></label>
                                            <div className="input-box">

                                                <select
                                                    className="form-control"
                                                    value={requestForm.access_level}
                                                    onChange={handleRequestAccess}
                                                    name="access_level"
                                                >
                                                    <option value="">Select access level</option>
                                                    <option value="view">View Scripts</option>
                                                    <option value="download">Download Scripts</option>
                                                    <option value="edit">Modify Scripts</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`col-md-12`}>
                                        <div className="custom-input">
                                            <label>Note</label>
                                            <div className="input-box">


                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Access note"
                                                    value={requestForm.note}
                                                    onChange={handleRequestAccess}
                                                    name="note"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button className="login-button">
                                        {loading ? "Requesting Access ..." : "Request Access"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </DashLayout>
    );
};

export default RequestAccess;