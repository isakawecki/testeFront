import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './HomeMedico.css';

function HomeMedico() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [consultasPendentes, setConsultasPendentes] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLocal || usuarioLocal.tipo !== 'medico') {
      navigate('/login');
      return;
    }

    setUsuario(usuarioLocal);
    carregarConsultas(usuarioLocal.id);
    setCarregando(false);
  }, [navigate]);

  const carregarConsultas = async (medicoId) => {
    try {
      const response = await api.get(`/consultas/profissional/${medicoId}`);
      console.log('Consultas recebidas:', response.data);

      const consultas = Array.isArray(response.data) ? response.data : [];

      // Coloca todas as consultas como "pendentes" para exibir
      setConsultasPendentes(consultas);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      setMensagem('Erro ao carregar consultas');
    }
  };

  const cancelarConsulta = async (consultaId) => {
    try {
      await api.delete(`/consultas/${consultaId}`);
      setMensagem('Consulta cancelada com sucesso');
      carregarConsultas(usuario.id);
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error);
      setMensagem('Erro ao cancelar consulta');
    }
  };

  const deslogar = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  if (carregando) return <p>Carregando...</p>;

  return (
    <div className="home-container">
      <h2>Seja bem-vindo, Dr. {usuario?.nome}</h2>
      <p>Especialidade: {usuario?.especialidade}</p>
      <p>Telefone: {usuario?.telefone}</p>

      <hr />

      <h3>Consultas Pendentes</h3>
      {consultasPendentes.length === 0 ? (
        <p>Nenhuma consulta pendente</p>
      ) : (
        <ul>
          {consultasPendentes.map((c) => (
            <li key={c.id}>
              Paciente: {c.nomePaciente || 'Sem nome'} - {new Date(c.dataHora).toLocaleString()}
              <button
                onClick={() => cancelarConsulta(c.id)}
                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
              >
                Cancelar
              </button>
            </li>
          ))}
        </ul>
      )}

      {mensagem && <p>{mensagem}</p>}

      <button onClick={deslogar}>Sair</button>
    </div>
  );
}

export default HomeMedico;
