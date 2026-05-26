import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import AuthService from "./AuthService.jsx";


const ProtectedRoute = ({ children, allowedRoles }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuthorization = async () => {
            return await AuthService.isAuthorized();
        };

        checkAuthorization().then((authorized) => {
            setIsAuthorized(authorized);
        });
    }, []);

    if (isAuthorized === null) {
        return <div>
            <div className="authentication">
                <div className="spinner-border text-white" role="status">
                    <span className="visually-hidden"></span>
                </div>
                <h1>App Name</h1>
                <p className="mb-0 ms-3 text-white">Authorizing!!! Please with...</p>
            </div>
        </div>;
    }

    if (!isAuthorized) {
        return <Navigate to="/" />;
    }

    if (!AuthService.userHasRoles(allowedRoles)) {
        return <Navigate to="/*" />;
    }

    return children;
};

export default ProtectedRoute;