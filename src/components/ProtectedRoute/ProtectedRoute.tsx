import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Roller from '../Roller/Roller';

interface IProtectedRoute {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({ children }) => {
  const auth = getAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoadingAuth(false);
    });
  }, [auth]);

  return loadingAuth ? (
    <Roller x={0} y={0} scale={1} style={{ margin: 'auto' }} />
  ) : authenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default ProtectedRoute;
