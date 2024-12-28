const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rota para obter todos os avisos
app.get("/avisos", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [avisos] = await connection.query("SELECT * FROM Aviso");
    await connection.end();
    res.json(avisos);
  } catch (error) {
    console.error("Erro ao buscar avisos:", error);
    res.status(500).send("Erro ao buscar avisos.");
  }
});

// Rota para adicionar um aviso
app.post("/avisos", async (req, res) => {
  try {
    const { aviso } = req.body;
    if (!aviso) {
      return res
        .status(400)
        .json({ message: "O campo 'aviso' é obrigatório." });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [result] = await connection.query(
      "INSERT INTO Aviso (aviso, data) VALUES (?, ?)",
      [aviso, new Date()]
    );
    await connection.end();

    res.status(201).json({ id: result.insertId, aviso, data: new Date() });
  } catch (error) {
    console.error("Erro ao adicionar aviso:", error);
    res.status(500).send("Erro ao adicionar aviso.");
  }
});

// Middleware para tratamento de erros globais
app.use((err, req, res, next) => {
  console.error("Erro inesperado:", err);
  res.status(500).send("Erro interno do servidor.");
});

// Exportar o app para o Vercel
module.exports = app;
