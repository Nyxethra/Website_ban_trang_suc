import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import 'font-awesome/css/font-awesome.min.css'
import './index.css'
import App from './App';
import { Provider } from 'react-redux';
import {persistor,store} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import 'antd/dist/reset.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

