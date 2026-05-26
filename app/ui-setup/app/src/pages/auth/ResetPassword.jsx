import React from 'react';
import {Link} from "react-router-dom";

const ResetPassword = () => {
    return (
        <div>
            <h1>ResetPassword</h1>
            <p>Login <Link to={`/`}>Login</Link></p>
        </div>
    );
};

export default ResetPassword;