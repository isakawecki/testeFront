<h1>💊 Clínica Frontend</h1>

<p>Este é o frontend do sistema de agendamento médico. Ele permite que médicos e pacientes se cadastrem, façam login, agendem e gerenciem consultas.</p>

<h2>🛠️ Tecnologias</h2>
<ul>
  <li>React.js</li>
  <li>Axios</li>
  <li>React Router</li>
  <li>LocalStorage</li>
  <li>CSS</li>
</ul>

<h2>📁 Estrutura de Pastas</h2>
<pre><code>
src/
├── components/
├── pages/
│   ├── Cadastro/
│   ├── Login/
│   ├── HomePaciente/
│   ├── HomeMedico/
├── services/
│   └── api.js
└── App.js
</code></pre>

<h2>▶️ Como rodar</h2>
<ol>
  <li>Instale as dependências:
    <pre><code>npm install</code></pre>
  </li>
  <li>Inicie a aplicação:
    <pre><code>npm start</code></pre>
  </li>
  <li>Acesse: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></li>
</ol>

<h2>🔐 Login</h2>
<ul>
  <li><strong>Paciente:</strong> pode marcar consultas com médicos disponíveis.</li>
  <li><strong>Médico:</strong> pode aceitar/cancelar consultas e adicionar disponibilidade.</li>
</ul>

<h3>🔗 Backend</h3>
<p>Configure a base URL da API em <code>src/services/api.js</code>:</p>

<pre><code>import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export default api;</code></pre>
