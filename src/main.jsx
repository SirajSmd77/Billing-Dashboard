import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx';




createRoot(document.getElementById('root')).render(

   <BrowserRouter>
   <AppContextProvider>
        <App />
   </AppContextProvider>
   </BrowserRouter>
)
