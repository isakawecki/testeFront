import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === '' || senha === '') {
      setErro('Preencha todos os campos');
      return;
    }

    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
      setErro('Nenhuma conta cadastrada');
      return;
    }

    const usuario = JSON.parse(usuarioStr);

    if (email === usuario.email && senha === usuario.senha) {
      // Salva nome e tipo no localStorage para usar na home
      localStorage.setItem('tipoUsuario', usuario.tipoUsuario);
      localStorage.setItem('nomeUsuario', usuario.nome);

      setErro('');
      alert(`Login bem-sucedido como ${usuario.tipoUsuario}!`);

      if (usuario.tipoUsuario === 'medico') {
        navigate('/homeMedico');
      } else {
        navigate('/homePaciente');
      }
    } else {
      setErro('E-mail ou senha incorretos');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Entrar</h2>

        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
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
