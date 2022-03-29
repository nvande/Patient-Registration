import logo from './logo.svg';
import HomePage from './pages/HomePage.js';
import RegistrationPage from './pages/RegistrationPage';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage/>}/>
          <Route path="/register" element={<RegistrationPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
