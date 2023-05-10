import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.module.scss';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { setupStore } from './store/store';
import { Provider } from 'react-redux';
import SignInPage from './pages/Authentication/SignInPage';
import SignUpPage from './pages/Authentication/SignUpPage';
import PlaygroundPage from './pages/PlaygroundPage/PlaygroundPage';

const store = setupStore();

function App() {
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
