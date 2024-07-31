import React from 'react';
import './assets/base.scss';
import configureStore from './config/configureStore';
import { Provider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Routes from './Routes';
import ScrollToTop from './utils/ScrollToTop';

const store = configureStore();
function App() {
  return (
    <>
      <Provider store={store}>
        <ToastContainer
          position="bottom-center"
        />
        <BrowserRouter>
          <ScrollToTop>
            <Routes />
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
