import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Login.css';

function Login() {

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Entrar</h2>

        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          placeholder="Digite seu e-mail"
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          placeholder="Digite sua senha"
          required
        />

        {erro && <p className="erro">{erro}</p>}

        <button type="submit">Entrar</button>

        <p className="cadastro-link">
          Não tem uma conta?{' '}
          <span
            onClick={() => navigate('/cadastro')}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            Criar conta
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
