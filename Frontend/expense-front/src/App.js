import './App.css';
import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
// page imports
import Budget from './pages/Budget'
import ExpenseInput from './pages/ExpenseInput'
import Expenses from './pages/Expenses'
import Home from './pages/Home'
import Income from './pages/Income'
import IncomeInput from './pages/IncomeInput'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Reports from './pages/Reports'
import Savings from './pages/Savings'
import Settings from './pages/Settings'
import Navbar from './components/Navbar.Js'


function App() {
  return (
    <Router> 
      <div className="App">
          <Navbar/>
          <Routes>
            <Route exact path="/"  element={<Home/>} />
            <Route path="/expenses/input" element={<ExpenseInput/>} />
            <Route path="/expenses/list" element={<Expenses/>} />
            <Route path="/income/input" element={<IncomeInput/>} />
            <Route path="/income/list" element={<Income/>} />
            <Route path="/savings/goals" element={<Savings/>} />
            <Route path="/budgeting" element={<Budget/>} />
            <Route path="/reports" element={<Reports/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/settings" element={<Settings/>} />
          </Routes>                    
          
      </div>
    </Router>
  );
}

export default App;
