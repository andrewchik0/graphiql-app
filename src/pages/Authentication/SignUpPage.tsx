import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import AuthForm, { AuthType } from '../../components/AuthForm/AuthForm';
import { useAppDispatch } from '../../hooks/redux';
import { userSlice } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAuth();
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = (email: string, password: string) => {
    setIsLoading(true);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(
          userSlice.actions.addUser({
            email: user.email,
            id: user.uid,
            token: user.refreshToken,
          })
        );
        setIsLoading(false);
        navigate('/');
      })
      .catch((err) => {
        setIsLoading(false);
        setErrorType(err.code);
      });
  };
  useEffect(() => {
    user.isAuth && navigate('/');
  }, [user.isAuth, navigate]);
  return (
    <AuthForm
      authType={AuthType.register}
      handleLogin={handleRegister}
      error={errorType}
      isLoading={isLoading}
    />
  );
}
