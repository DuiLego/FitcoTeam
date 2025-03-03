import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    let isAuthenticated = useAuth();

    if (!isAuthenticated){
        return <Navigate to='/login' replace />;
    }

    return children ? children : <Outlet />;
}

const useAuth = () => {
    const token = localStorage.getItem('token');

    if(token){
          return true;
    }else{
          return false;
    }
}

export default PrivateRoute;