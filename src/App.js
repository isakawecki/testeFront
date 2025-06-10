import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import HomeMedico from './pages/HomeMedico/HomeMedico';
import HomePaciente from './pages/HomePaciente/HomePaciente';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/homeMedico" element={<HomeMedico />} />
        <Route path="/homePaciente" element={<HomePaciente />} />
      </Routes>
    </Router>
  );
}

export default App;
