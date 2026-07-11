import React from 'react';
import AuthVerify from "../service/AuthVerify.jsx";

const NotFound = () => {
    const user = AuthVerify.decodeToken();
    return (
        <div>
            <h1>Page Not Found</h1>
        </div>
    );
};

export default NotFound;