import AuthForm, { AuthType } from '../../components/AuthForm/AuthForm';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { userSlice } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAuth();
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = (email: string, password: string) => {
    setIsLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
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
        setErrorType(err.code);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    user.isAuth && navigate('/');
  }, [user.isAuth, navigate]);
  return (
    <AuthForm
      authType={AuthType.login}
      handleLogin={handleLogin}
      error={errorType}
      isLoading={isLoading}
    />
  );
}
