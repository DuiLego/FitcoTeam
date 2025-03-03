import React from 'react';
import { Navigate } from 'react-router-dom';

const NoMatch = () => {    
    return <Navigate to='/home' replace />;
}

export default NoMatch;