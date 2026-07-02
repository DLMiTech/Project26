import React from 'react';
import AuthVerify from "./service/AuthVerify.jsx";

const NotFound = () => {
    const userData = AuthVerify.decodeToken();
    const role = userData?.role;

    console.log(userData);
    return (
        <div>
            <h1>Page Not Found</h1>
        </div>
    );
};

export default NotFound;