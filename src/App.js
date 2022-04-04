import logo from './logo.svg';
import HomePage from './pages/HomePage.js';
import RegistrationPage from './pages/RegistrationPage';
import AppointmentsPage from './pages/AppointmentsPage';
import './App.css';

import { useAuth0 } from "./react-auth0-spa";
import { useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  const [user, setUser] = useState();

  const { isAuthenticated } = useAuth0();
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage/>}/>
          <Route path="/register" element={<RegistrationPage/>}/>
          <Route path="/appointments" element={<AppointmentsPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
