// src/pages/Cadastro/Cadastro.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
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

  const especialidades = ['Pediatria', 'Cardiologia', 'Dermatologia', 'Ginecologia', 'Clínico Geral'];

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
      ...(tipoUsuario === 'medico' && { especialidade }),
      ...(tipoUsuario === 'paciente' && { dataNascimento }),
    };

    try {
      if (tipoUsuario === 'medico') {
        await api.post('/medicos/cadastrar', usuario);
      } else {
        await api.post('/pacientes/cadastrar', usuario);
      }

      // Após cadastro, faz login automaticamente
      const loginRes = await api.post(
        tipoUsuario === 'medico' ? '/medicos/login' : '/pacientes/login',
        { email, senha }
      );

      // Salva token e dados do usuário vindos da API
      localStorage.setItem('usuarioLogado', JSON.stringify(loginRes.data));
      localStorage.setItem('tipoUsuario', tipoUsuario);

      navigate(tipoUsuario === 'medico' ? '/homeMedico' : '/homePaciente');
    } catch (err) {
      const erroMsg = err.response?.data?.message || 'Erro ao cadastrar';
      setErro(erroMsg);
    }
  };

  return (
    <div className="cadastro-container">
      <form className="cadastro-form" onSubmit={handleCadastro}>
        <h2>Criar Conta</h2>

        <label>Nome</label>
        <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />

        <label>E-mail</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label>Senha</label>
        <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />

        <label>Confirme a senha</label>
        <input type="password" value={confirmaSenha} onChange={e => setConfirmaSenha(e.target.value)} required />

        <div className="tipo-usuario">
          <p>Tipo de usuário:</p>
          <label>
            <input
              type="radio"
              value="medico"
              checked={tipoUsuario === 'medico'}
              onChange={e => setTipoUsuario(e.target.value)}
            />
            Médico
          </label>
          <label>
            <input
              type="radio"
              value="paciente"
              checked={tipoUsuario === 'paciente'}
              onChange={e => setTipoUsuario(e.target.value)}
            />
            Paciente
          </label>
        </div>

        <label>Telefone</label>
        <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} required />

        {tipoUsuario === 'medico' && (
          <>
            <label>Especialidade</label>
            <select value={especialidade} onChange={e => setEspecialidade(e.target.value)} required>
              <option value="">Selecione</option>
              {especialidades.map((esp, i) => (
                <option key={i} value={esp}>{esp}</option>
              ))}
            </select>
          </>
        )}

        {tipoUsuario === 'paciente' && (
          <>
            <label>Data de Nascimento</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={e => setDataNascimento(e.target.value)}
              required
            />
          </>
        )}

        {erro && <p className="erro">{erro}</p>}

        <button type="submit">Criar Conta</button>

        <p className="login-link">
          Já tem conta?{' '}
          <span onClick={() => navigate('/login')} style={{ color: 'blue', cursor: 'pointer' }}>
            Fazer login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
