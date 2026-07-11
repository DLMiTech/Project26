import React from 'react';
import {Link} from "react-router-dom";

const Index = () => {
    return (
        <div className={`container mt-5`}>
            <h1>Index</h1>
            <Link to="/login">Start</Link>
        </div>
    );
};

export default Index;