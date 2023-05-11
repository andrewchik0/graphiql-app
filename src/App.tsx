import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.module.scss';
import { setupStore } from './store/store';
import { Provider } from 'react-redux';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import SignInPage from './pages/Authentication/SignInPage';
import SignUpPage from './pages/Authentication/SignUpPage';
import PlaygroundPage from './pages/PlaygroundPage/PlaygroundPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const store = setupStore();

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<WelcomePage />} />
            <Route path="signin" element={<SignInPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route
              path="playground"
              element={
                <ProtectedRoute>
                  <PlaygroundPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
