import React from 'react';
import DashLayout from "../DashLayout.jsx";
import AuthVerify from "../../service/AuthVerify.jsx";
import Admin from "./Admin.jsx";
import Lectures from "./Lectures.jsx";

const AccessControl = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;
    return (
        <DashLayout>
            <section className="dashboard-body">
                <div className="page-header">

                </div>
            </section>
        </DashLayout>
    );
};

export default AccessControl;