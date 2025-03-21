import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { UserState, userSlice } from '../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from './redux';
import { useEffect, useState } from 'react';

export type Authentication = UserState & { isAuth: boolean; isLoading: boolean };

let resolve: (value: unknown) => void;
onAuthStateChanged(getAuth(), () => resolve(null));

export default function useAuth(): Authentication {
  const auth = getAuth();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
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
      setIsLoading(false);
    });
  });
  const user = useAppSelector((state) => state.userSlice);

  if (resolve == undefined) throw new Promise((r) => (resolve = r));
  return {
    ...user,
    isAuth: !!user.email,
    isLoading: isLoading,
  };
}
