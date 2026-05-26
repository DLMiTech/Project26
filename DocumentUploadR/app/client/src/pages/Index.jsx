import React from 'react';
import {Link} from "react-router-dom";

const Index = () => {
    return (
        <div className={`container mt-5`}>
            <h1>Hello, Start</h1>
            <Link to={`/login`}>Start</Link>
        </div>
    );
};

export default Index;