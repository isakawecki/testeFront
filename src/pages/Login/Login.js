import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  console.log('Tentando logar com:', { email, senha });

  try {
    const response = await api.post('/login', { email, senha });
    console.log('Resposta do login:', response.data);

    alert('Login bem-sucedido!');

    const { token, tipo, nome, id } = response.data;

    localStorage.setItem('usuarioLogado', JSON.stringify({ token, tipo, nome, id }));
    console.log('Usuário salvo no localStorage');

    if (tipo === 'medico') {
      navigate('/homeMedico ');
    } else if (tipo === 'paciente') {
      navigate('/homePaciente');
    } else {
      setErro('Tipo de usuário inválido');
    }
  } catch (err) {
    console.error('Erro no login:', err);
    setErro('Email ou senha inválidos');
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
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
