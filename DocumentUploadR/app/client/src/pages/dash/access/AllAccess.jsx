import React, {useCallback, useEffect, useState} from 'react';
import AccessRequest from "../../request/access.jsx";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import DashLayout from "../DashLayout.jsx";
import access from "../../request/access.jsx";
import nodata from '../../../assets/img/no-data.png'

const AllAccess = () => {
    const [loading, setLoading] = useState(false);
    const [myAccess, setMyAccess] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const fetchAccess = useCallback(async () => {
        setLoading(true);

        try {
            const res = await AccessRequest.getAllAccessBoth();

            if (res?.status === 200) {
                setMyAccess(res.data || []);
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
        fetchAccess();
    }, [fetchAccess]);

    const filteredAccess = myAccess.filter((access) =>
        Object.values(access)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAccess.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentAccess = filteredAccess.slice(
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

                                <div className="">
                                    <h3 className="mb-0">All Access</h3>
                                    <small>Select one and grant access or decline</small>
                                </div>

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
                                        <th>Course</th>
                                        <th>Access</th>
                                        <th>Status</th>
                                        <th>Data</th>
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
                                    ) : currentAccess.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center">
                                                <p className={`mt-5`}>No access found.</p>
                                                <img src={nodata} alt={nodata} className={`img-fluid`} style={{ width: "15rem" }} />
                                            </td>
                                        </tr>
                                    ) : (
                                        currentAccess.map((access, index) => (
                                            <tr key={access.id}>
                                                <td>{indexOfFirstRow + index + 1}</td>
                                                <td>
                                                    <small>{access.course_code}</small>
                                                    <p className={`mb-0 fw-bold`}>{access.course_title}</p>
                                                </td>
                                                <td>{access.access_level}</td>
                                                <td>
                                        <span
                                            className={`badge ${
                                                access.status === "approve"
                                                    ? "bg-success"
                                                    : access.status === "pending"
                                                        ? "bg-warning text-dark"
                                                        : "bg-danger"
                                            }`}>
                                            {access.status}
                                        </span>
                                                </td>
                                                <td>{new Date(access.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <div className={`d-flex gap-2`}>
                                                        <Link
                                                            to={`/access-control/grant/${access.id}`}
                                                            state={{ access }}
                                                            className="btn btn-sm btn-success"
                                                        >
                                                            <i className="ri-arrow-right-double-line"></i>
                                                        </Link>

                                                        <Link
                                                            to={`/access-control/delete/${access.id}`}
                                                            state={{ access }}
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

export default AllAccess;