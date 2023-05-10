import { BrowserRouter } from 'react-router-dom';
import './App.module.scss';
import { setupStore } from './store/store';
import { Provider } from 'react-redux';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Outlet from './components/Outlet/Outlet';

const store = setupStore();

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Header />
        <Outlet />
        <Footer />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
