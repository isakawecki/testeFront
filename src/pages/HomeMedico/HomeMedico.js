import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function HomeMedico() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [disponibilidade, setDisponibilidade] = useState('');
  const [consultasPendentes, setConsultasPendentes] = useState([]);
  const [consultasAceitas, setConsultasAceitas] = useState([]);

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLocal?.token || usuarioLocal.tipo !== 'medico') {
      navigate('/login');
      return;
    }
    setUsuario(usuarioLocal);
    carregarConsultas(usuarioLocal.id);
  }, [navigate]);

  const carregarConsultas = async (medicoId) => {
    try {
      const response = await api.get(`/consultas/medico/${medicoId}`);
      const pendentes = response.data.filter(c => c.status === 'pendente');
      const aceitas = response.data.filter(c => c.status === 'aceita');
      setConsultasPendentes(pendentes);
      setConsultasAceitas(aceitas);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    }
  };

  const adicionarDisponibilidade = async () => {
    if (!disponibilidade || !usuario) return;

    try {
      await api.post(`/usuarios/${usuario.id}/disponibilidade`, {
        dataHora: disponibilidade,
      });

      const medicoAtualizado = await api.get(`/usuarios/${usuario.id}`);
      setUsuario(medicoAtualizado.data);
      setDisponibilidade('');
    } catch (error) {
      console.error('Erro ao adicionar disponibilidade:', error);
    }
  };

  const aceitarConsulta = async (consultaId) => {
    try {
      await api.put(`/consultas/${consultaId}/aceitar`);
      carregarConsultas(usuario.id);
    } catch (error) {
      console.error('Erro ao aceitar consulta:', error);
    }
  };

  const deslogar = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h2>Seja bem-vindo, Dr. {usuario?.nome}</h2>
      <p>Especialidade: {usuario?.especialidade}</p>
      <p>Telefone: {usuario?.telefone}</p>

      <hr />

      <h3>Definir disponibilidade</h3>
      <input
        type="datetime-local"
        value={disponibilidade}
        onChange={e => setDisponibilidade(e.target.value)}
      />
      <button onClick={adicionarDisponibilidade}>Adicionar</button>

      <h4>Datas disponíveis:</h4>
      <ul>
        {(usuario?.disponibilidades || []).map((d, i) => (
          <li key={i}>{new Date(d).toLocaleString()}</li>
        ))}
      </ul>

      <hr />

      <h3>Consultas Pendentes</h3>
      {consultasPendentes.length === 0 && <p>Nenhuma consulta pendente</p>}
      <ul>
        {consultasPendentes.map(c => (
          <li key={c.id}>
            Paciente: {c.paciente.nome} - {new Date(c.data).toLocaleString()}
            <button onClick={() => aceitarConsulta(c.id)}>Aceitar</button>
          </li>
        ))}
      </ul>

      <h3>Consultas Aceitas</h3>
      {consultasAceitas.length === 0 && <p>Nenhuma consulta aceita</p>}
      <ul>
        {consultasAceitas.map(c => (
          <li key={c.id}>
            Paciente: {c.paciente.nome} - {new Date(c.data).toLocaleString()}
          </li>
        ))}
      </ul>

      <button onClick={deslogar}>Sair</button>
    </div>
  );
}

export default HomeMedico;
