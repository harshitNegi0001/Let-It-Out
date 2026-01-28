import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { store } from './store/store.js';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {Toaster} from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  
    <Provider store={store}>
      <Toaster position='top-right'/>
      <App />
    </Provider>

  </BrowserRouter>


  ,
)
