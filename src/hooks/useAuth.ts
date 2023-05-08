import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { UserState, userSlice } from '../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from './redux';

export type Authentication = UserState & { isAuth: boolean };

export default function useAuth(): Authentication {
  const auth = getAuth();
  const dispatch = useAppDispatch();
  onAuthStateChanged(auth, (userAuth) => {
    if (userAuth) {
      dispatch(
        userSlice.actions.addUser({
          email: userAuth.email,
          id: userAuth.uid,
          token: userAuth.refreshToken,
        })
      );
    } else {
      dispatch(userSlice.actions.removeUser());
    }
  });
  const user = useAppSelector((state) => state.userSlice);

  return {
    ...user,
    isAuth: !!user.email,
  };
}
