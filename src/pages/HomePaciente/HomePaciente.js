import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './HomePaciente.css';

function HomePaciente() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [medicosDisponiveis, setMedicosDisponiveis] = useState([]);
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [consultasAgendadas, setConsultasAgendadas] = useState([]);

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLocal || usuarioLocal.tipo !== 'paciente') {
      navigate('/login');
      return;
    }
    setUsuario(usuarioLocal);
    setCarregando(false);
    carregarConsultas(usuarioLocal.id);
  }, [navigate]);

  const carregarConsultas = async (pacienteId) => {
    try {
      console.log("➡️ Carregando consultas do paciente", pacienteId);
      const res = await api.get(`/consultas/paciente/${pacienteId}`);
      console.log("✅ Consultas recebidas:", res.data);
      setConsultasAgendadas(res.data);
    } catch (error) {
      console.error('🛑 Erro ao carregar consultas:', error);
      setMensagem('Erro ao carregar consultas');
    }
  };

  const agendarConsulta = async () => {
    if (!medicoSelecionado || !horarioSelecionado) {
      setMensagem('Selecione médico e horário');
      return;
    }
    try {
      console.log(`📅 Agendando consulta: médico=${medicoSelecionado.id}, paciente=${usuario.id}, data=${horarioSelecionado}`);
      const res = await api.post('/consultas', {
        medicoId: medicoSelecionado.id,
        pacienteId: usuario.id,
        dataHora: horarioSelecionado,
        status: 'pendente',
      });
      console.log("✅ Resposta agendamento:", res.data);
      setMensagem('Consulta agendada com sucesso!');
      setMedicoSelecionado(null);
      setHorarioSelecionado('');
      carregarConsultas(usuario.id);
    } catch (error) {
      console.error('🛑 Erro ao agendar consulta:', error);
      setMensagem('Erro ao agendar consulta');
    }
  };

  if (carregando) return <p>Carregando...</p>;

  return (
    <div className="home-container">
      <h2>Olá, {usuario?.nome}</h2>

      {/* Área de agendamento */}
      <section>
        <h3>Médicos disponíveis</h3>
        <button onClick={async () => {
          try {
            const res = await api.get('/medicos/todos');
            console.log("✅ Médicos recebidos:", res.data);
            setMedicosDisponiveis(res.data);
          } catch (e) {
            console.error("🛑 Erro ao buscar médicos:", e);
            setMensagem('Erro ao buscar médicos');
          }
        }}>Buscar todos os médicos</button>

        <ul>
          {medicosDisponiveis.map(medico => (
            <li key={medico.id}>
              Dr(a). {medico.nome} — {medico.especialidade} — {medico.telefone}
              <button onClick={() => setMedicoSelecionado(medico)} style={{ marginLeft: 10 }}>
                Selecionar
              </button>
            </li>
          ))}
        </ul>

        {medicoSelecionado && (
          <div>
            <h4>Agendar com Dr(a). {medicoSelecionado.nome}</h4>
            <input
              type="datetime-local"
              value={horarioSelecionado}
              onChange={e => setHorarioSelecionado(e.target.value)}
            />
            <button onClick={agendarConsulta}>Agendar</button>
          </div>
        )}
      </section>

      <hr />

      {/* Consultas agendadas */}
      <section>
        <h3>Consultas agendadas</h3>
        {consultasAgendadas.length === 0 ? (
          <p>Nenhuma consulta agendada.</p>
        ) : (
          <ul>
            {consultasAgendadas.map(c => (
              <li key={c.id}>
                Médico: {c.medico?.nome || c.nomeMedico} — Data: {new Date(c.dataHora || c.data).toLocaleString()} — Status: {c.status}
                <button onClick={() => {
                  api.delete(`/consultas/${c.id}`).then(() => carregarConsultas(usuario.id));
                }} style={{ marginLeft: 10 }}>
                  Cancelar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {mensagem && <p>{mensagem}</p>}

      <button onClick={() => {
        localStorage.removeItem('usuarioLogado');
        navigate('/login');
      }}>Sair</button>
    </div>
  );
}

export default HomePaciente;
