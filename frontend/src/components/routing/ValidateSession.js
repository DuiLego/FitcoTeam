import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ValidateSession = ({ isAuthenticated, children }) => {    
    const { isAuthenticated: isAuthenticatedSesion } = useSelector(state => state.auth);

    if (isAuthenticated && isAuthenticatedSesion){
        return <Navigate to='/home' replace />;
    }

    return children ? children : <Outlet />;
}

export default ValidateSession;