import './styles/GlobalStyles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './pages/AppLayout'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContextProvider } from './context/userContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard'

/*  <Route path='*' element={<PageNotFound />} /> */

export default function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <ToastContainer position="bottom-right" autoClose={2000} />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  )
}
