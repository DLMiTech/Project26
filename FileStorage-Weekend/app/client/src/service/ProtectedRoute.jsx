import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import AuthVerify from "./AuthVerify.jsx";


const ProtectedRoute = ({ children, allowedRoles }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuthorization = async () => {
            return await AuthVerify.isAuthorized();
        };

        checkAuthorization().then((authorized) => {
            setIsAuthorized(authorized);
        });
    }, []);

    if (isAuthorized === null) {
        return <div>
            <div className={`authentication`}>
                <p>Authorizing!!! Please wait ...</p>
            </div>
        </div>;
    }

    if (!isAuthorized) {
        return <Navigate to="/" />;
    }

    if (!AuthVerify.userHasRoles(allowedRoles)) {
        return <Navigate to="/*" />;
    }

    return children;
};

export default ProtectedRoute;