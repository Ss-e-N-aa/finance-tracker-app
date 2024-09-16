import './styles/GlobalStyles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './pages/AppLayout'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContextProvider } from './context/userContext';

//     -----------------------------
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard'
import PageNotFound from './pages/PageNotFound';
import Incomes from './pages/Incomes';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import Budgets from './pages/Budgets';
import Overview from './pages/Overview';
//     -----------------------------


export default function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <ToastContainer position="bottom-right" autoClose={2000} />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />} />

            <Route path='/dashboard' element={<Dashboard />}>
              <Route path='overview' element={<Overview />} />
              <Route path='incomes' element={<Incomes />} />
              <Route path='expenses' element={<Expenses />} />
              <Route path='budgets' element={<Budgets />} />
              <Route path='settings' element={<Settings />} />
            </Route>

            <Route path='*' element={<PageNotFound />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  )
}
