import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Importa a instância do Axios
import './Cadastro.css';

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('paciente');
  const [telefone, setTelefone] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erro, setErro] = useState('');

  const especialidadesPreDefinidas = [
    'Pediatria',
    'Cardiologia',
    'Dermatologia',
    'Ginecologia',
    'Clínico Geral'
  ];

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (senha !== confirmaSenha) {
      setErro('As senhas não conferem');
      return;
    }

    const usuario = {
      nome,
      email,
      senha,
      telefone,
      tipo: tipoUsuario,
      especialidade: tipoUsuario === 'medico' ? especialidade : null,
      dataNascimento: tipoUsuario === 'paciente' ? dataNascimento : null,
    };

    try {
      const res = await api.post('/auth/register', usuario);
      alert(res.data);

      // Agora realiza o login automaticamente
      const loginRes = await api.post('/auth/login', { email, senha });

      localStorage.setItem('usuarioLogado', JSON.stringify(loginRes.data));
      localStorage.setItem('tipoUsuario', tipoUsuario);

      navigate(tipoUsuario === 'medico' ? '/homeMedico' : '/homePaciente');
    } catch (err) {
      setErro(err.response?.data || 'Erro ao cadastrar usuário');
    }
  };

  return (
    <div className="cadastro-container">
      <form className="cadastro-form" onSubmit={handleCadastro}>
        <h2>Criar Conta</h2>

        <label>Nome</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label>E-mail</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} />

        <label>Confirme a senha</label>
        <input type="password" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} required minLength={6} />

        <div className="tipo-usuario">
          <p>Entrar como:</p>
          <label>
            <input type="radio" name="tipoUsuario" value="medico" checked={tipoUsuario === 'medico'} onChange={(e) => setTipoUsuario(e.target.value)} />
            Médico
          </label>
          <label>
            <input type="radio" name="tipoUsuario" value="paciente" checked={tipoUsuario === 'paciente'} onChange={(e) => setTipoUsuario(e.target.value)} />
            Paciente
          </label>
        </div>

        <label>Telefone</label>
        <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />

        {tipoUsuario === 'medico' && (
          <>
            <label>Especialidade</label>
            <select value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} required>
              <option value="">Selecione</option>
              {especialidadesPreDefinidas.map((esp, index) => (
                <option key={index} value={esp}>{esp}</option>
              ))}
            </select>
          </>
        )}

        {tipoUsuario === 'paciente' && (
          <>
            <label>Data de Nascimento</label>
            <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
          </>
        )}

        {erro && <p className="erro">{erro}</p>}

        <button type="submit">Criar Conta</button>

        <p className="login-link">
          Já tem uma conta?{' '}
          <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'blue' }}>
            Fazer login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
