import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WelcomePage from '../../pages/WelcomePage/WelcomePage';
import SignInPage from '../../pages/Authentication/SignInPage';
import SignUpPage from '../../pages/Authentication/SignUpPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';

export default function Outlet() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
