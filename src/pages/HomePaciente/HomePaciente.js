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

  const especialidades = ['Pediatria', 'Cardiologia', 'Dermatologia', 'Ortopedia'];

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuarioLocal && usuarioLocal.tipo === 'paciente') {
      setUsuario(usuarioLocal);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const buscarMedicos = async () => {
    if (!especialidadeSelecionada) {
      setMensagem('Selecione uma especialidade');
      return;
    }
    try {
      // Buscar médicos pela especialidade
      const response = await api.get(`/usuarios?tipo=medico&especialidade=${especialidadeSelecionada}`);
      setMedicosDisponiveis(response.data);
      setMedicoSelecionado(null);
      setHorarioSelecionado('');
      setMensagem('');
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      setMensagem('Erro ao buscar médicos.');
    }
  };

  const marcarConsulta = async () => {
    if (!medicoSelecionado || !horarioSelecionado) {
      setMensagem('Selecione um médico e horário!');
      return;
    }

    try {
      await api.post('/consultas', {
        pacienteId: usuario.id,
        medicoId: medicoSelecionado.id,
        data: horarioSelecionado,
        status: 'pendente',
      });
      setMensagem('Consulta solicitada com sucesso!');
      setHorarioSelecionado('');
    } catch (error) {
      console.error('Erro ao marcar consulta:', error);
      setMensagem('Erro ao marcar consulta.');
    }
  };

  const deslogar = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  return (
    <div className="home-container">
      <h2>Bem-vindo(a), {usuario?.nome}</h2>

      <h3>Buscar Médico por Especialidade</h3>
      <select
        value={especialidadeSelecionada}
        onChange={(e) => setEspecialidadeSelecionada(e.target.value)}
      >
        <option value="">Selecione uma especialidade</option>
        {especialidades.map((esp) => (
          <option key={esp} value={esp}>
            {esp}
          </option>
        ))}
      </select>
      <button onClick={buscarMedicos}>Buscar</button>

      {medicosDisponiveis.length > 0 && (
        <div>
          <h3>Médicos disponíveis</h3>
          <ul>
            {medicosDisponiveis.map((medico) => (
              <li key={medico.id}>
                <strong>{medico.nome}</strong> - {medico.especialidade} - {medico.telefone}
                <br />
                <label>Escolher horário:</label>
                <select
                  onChange={(e) => {
                    setMedicoSelecionado(medico);
                    setHorarioSelecionado(e.target.value);
                  }}
                >
                  <option value="">Selecione</option>
                  {(medico.disponibilidades || []).map((d, i) => (
                    <option key={i} value={d}>
                      {new Date(d).toLocaleString()}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
          <button onClick={marcarConsulta}>Agendar Consulta</button>
          {mensagem && <p>{mensagem}</p>}
        </div>
      )}

      <button onClick={deslogar}>Sair</button>
    </div>
  );
}

export default HomePaciente;
