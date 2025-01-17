const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5100;

// Configurações de middleware
app.use(cors());
app.use(bodyParser.json());

// Log das variáveis de ambiente (remova em produção)
console.log('Configurações do banco:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS ? '[PRESENTE]' : '[VAZIO]',
  database: process.env.DB_NAME
});

// Configuração do banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '', // Garante que undefined se torna string vazia
  database: process.env.DB_NAME || 'livraria_teste',
});

// Testar conexão
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    console.error('Detalhes da configuração:', {
      host: db.config.host,
      user: db.config.user,
      database: db.config.database,
      // Não logar a senha por segurança
    });
  } else {
    console.log('Conectado ao banco de dados');
  }
});

// Rotas de exemplo
app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/get-users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/messages', (req, res) => {
  db.query('SELECT * FROM messages', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Inicializar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.post("/post-users", (req, res) => {
  const { username, password } = req.body;  // Mudando para username

  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Erro ao inserir no banco:", err);
      res.status(500).send("Erro no servidor");
    } else {
      res.status(200).json({ message: "Usuário cadastrado com sucesso!" });
    }
  });
});

app.post("/new-messages", (req, res) => {
  const {message, user, book} = req.body;

  const sql = "INSERT INTO messages (message, user, book) VALUES (?, ?, ?)";

  db.query(sql, [message, user, book], (err, result) => {
    if(err) {
      console.error("Erro ao inserir no banco:", err);
      res.status(500).send("Erro no servidor");
    } else {
      res.status(200).json({ message: "Mensagem cadastrada com sucesso!"});
    }
  });
});

app.put("/update-users", (req, res) => {
  const {name, password, id} = req.body;

  const sql = "UPDATE users SET name = ?, password = ? WHERE id = ?";

  db.query(sql, [name, password, id], (err, result) => {
    if(err) {
      console.error("Erro ao inserir no banco:", err);
      res.status(500).send("Erro no servidor");
    } else {
      res.status(200).json({ message: "Usuário alterado com succesoo!"});
    }
  })
})