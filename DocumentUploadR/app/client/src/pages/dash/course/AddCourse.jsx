import React, {useState} from 'react';
import {Link} from "react-router-dom";
import DashLayout from "../DashLayout.jsx";
import {toast} from "react-toastify";
import CourseRequest from "../../request/course.jsx";

const AddCourse = () => {
    const [loading, setLoading] = useState(false);
    const [addCourseForm, setAddCourseForm] = useState(
        {code:"", title:"", semester:"", credit_hours:"", description:""})

    const validate = () => {
        if (!addCourseForm.code || !addCourseForm.title || !addCourseForm.semester || !addCourseForm.credit_hours) {
            toast.warn("All fields are required to add course.");
            return false;
        }
        return true;
    }
    const handleAddCourse = (e) => {
        setAddCourseForm({
            ...addCourseForm,
            [e.target.name]: e.target.value});
    }

    const handleSubmitAddCourse = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            //Call API
            const payload = {
                ...addCourseForm,
            }
            const res = await CourseRequest.add(payload);

            if (res?.status === 201) {
                toast.success(res?.message);
                setAddCourseForm({
                    code:"", title:"", semester:"", credit_hours:"", description:""
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
                    <div className={`card`}>
                        <div className={`card-header`}>
                            <div className={`d-flex align-items-center justify-content-between`}>
                                <Link to={`/course`} className={`btn btn-sm btn-outline-primary`}>
                                    <i className="ri-arrow-left-line"></i>
                                    Back
                                </Link>

                                <div>
                                    <h3 className={`mb-0`}>Add New Course</h3>
                                    <small>All fields are required to add course.</small>
                                </div>
                            </div>
                        </div>

                        <div className={`card-body`}>
                            <form action="" onSubmit={handleSubmitAddCourse}>
                                <div className={`row`}>
                                    <div className={`col-md-6`}>
                                        <div className="custom-input">
                                            <label>Course code <span className={`text-danger`}>*</span></label>
                                            <div className="input-box">

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="course code"
                                                    value={addCourseForm.code}
                                                    onChange={handleAddCourse}
                                                    name="code"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`col-md-6`}>
                                        <div className="custom-input">
                                            <label>Course title <span className={`text-danger`}>*</span></label>
                                            <div className="input-box">

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="course title"
                                                    value={addCourseForm.title}
                                                    onChange={handleAddCourse}
                                                    name="title"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`col-md-6`}>
                                        <div className="custom-input">
                                            <label>Select semester<span className={`text-danger`}>*</span></label>
                                            <div className="input-box">

                                                <select
                                                    className="form-control"
                                                    value={addCourseForm.semester}
                                                    onChange={handleAddCourse}
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
                                            <label>Course credit hours <span className={`text-danger`}>*</span></label>
                                            <div className="input-box">

                                                <select
                                                    className="form-control"
                                                    value={addCourseForm.credit_hours}
                                                    onChange={handleAddCourse}
                                                    name="credit_hours"
                                                >
                                                    <option value="">Select credit hours</option>
                                                    <option value="1">1 credit hours</option>
                                                    <option value="2">2 credit hours</option>
                                                    <option value="3">3 credit hours</option>
                                                    <option value="4">4 credit hours</option>
                                                    <option value="5">5 credit hours</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`col-md-12`}>
                                        <div className="custom-input">
                                            <label>Course description</label>
                                            <div className="input-box">


                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="course description"
                                                    value={addCourseForm.description}
                                                    onChange={handleAddCourse}
                                                    name="description"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button className="login-button">
                                        {loading ? "Adding New Course ..." : "Add Course"}
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

export default AddCourse;