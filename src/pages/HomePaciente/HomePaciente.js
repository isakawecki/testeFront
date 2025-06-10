import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function HomePaciente() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');
  const [medicosDisponiveis, setMedicosDisponiveis] = useState([]);
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLocal?.token || usuarioLocal.tipo !== 'paciente') {
      navigate('/login');
      return;
    }
    setUsuario(usuarioLocal);
  }, [navigate]);

  const especialidadesPreDefinidas = [
    'Pediatria',
    'Cardiologia',
    'Dermatologia',
    'Ginecologia',
    'Clínico Geral'
  ];

  const buscarMedicosPorEspecialidade = async () => {
    if (!especialidadeSelecionada) return;

    try {
      const res = await api.get(`/usuarios/especialidade/${especialidadeSelecionada}`);
      setMedicosDisponiveis(res.data);
      setMedicoSelecionado(null);
      setHorarioSelecionado('');
      setMensagem('');
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
    }
  };

  const marcarConsulta = async () => {
    if (!medicoSelecionado || !horarioSelecionado || !usuario) {
      setMensagem('Selecione médico e horário');
      return;
    }

    try {
      await api.post('/consultas', {
        medicoId: medicoSelecionado.id,
        pacienteId: usuario.id,
        data: horarioSelecionado,
        status: 'pendente',
      });

      setMensagem('Consulta agendada com sucesso!');
      setMedicoSelecionado(null);
      setHorarioSelecionado('');
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      setMensagem('Erro ao agendar consulta.');
    }
  };

  return (
    <div className="home-container">
      <h2>Olá, {usuario?.nome}</h2>

      <label>Escolha a especialidade</label>
      <select
        value={especialidadeSelecionada}
        onChange={e => setEspecialidadeSelecionada(e.target.value)}
      >
        <option value="">Selecione</option>
        {especialidadesPreDefinidas.map((esp, i) => (
          <option key={i} value={esp}>{esp}</option>
        ))}
      </select>

      <button onClick={buscarMedicosPorEspecialidade}>Buscar médicos</button>

      {medicosDisponiveis.length > 0 && (
        <>
          <h3>Médicos disponíveis</h3>
          <ul>
            {medicosDisponiveis.map(m => (
              <li key={m.id}>
                <strong>{m.nome}</strong> - {m.telefone}
                <button onClick={() => setMedicoSelecionado(m)}>Selecionar</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {medicoSelecionado && (
        <>
          <h3>Disponibilidade do Dr. {medicoSelecionado.nome}</h3>
          <select
            value={horarioSelecionado}
            onChange={e => setHorarioSelecionado(e.target.value)}
          >
            <option value="">Selecione um horário</option>
            {medicoSelecionado.disponibilidades && medicoSelecionado.disponibilidades.length > 0 ? (
              medicoSelecionado.disponibilidades.map((d, i) => (
                <option key={i} value={d}>{new Date(d).toLocaleString()}</option>
              ))
            ) : (
              <option disabled>Sem disponibilidade</option>
            )}
          </select>

          <button onClick={marcarConsulta}>Agendar consulta</button>
        </>
      )}

      {mensagem && <p>{mensagem}</p>}

      <button onClick={() => {
        localStorage.removeItem('usuarioLogado');
        navigate('/login');
      }}>
        Sair
      </button>
    </div>
  );
}

export default HomePaciente;
