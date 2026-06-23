import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../../lib/api';

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token');
        }

        await auth.getProfile();

        if (isMounted) {
          setAuthStatus('authenticated');
        }
      } catch (error) {
        console.error('Auth check failed:', error);

        if (isMounted) {
          setAuthStatus('unauthenticated');
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authStatus === 'checking') {
    return (
      <div className="h-screen flex items-center justify-center bg-[#EFF2F9] dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
