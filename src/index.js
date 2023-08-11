const express = require("express");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const mongo = require("./db/mongo");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const conexao = await mongo();
    const collection = conexao.db.collection("usuarios");
    const usuario = await collection.find({}).toArray();
    return res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro rota GET:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

app.patch("/:id", async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;
    const conexao = await mongo();
    const collection = conexao.db.collection("usuarios");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          nome: body.nome,
          anoDeNascimento: body.anoDeNascimento,
          sobrenome: body.sobrenome,
        },
      },
      { returnOriginal: false }
    );

    if (result.value) {
      return res.status(200).json({
        message: "Usuário atualizado com sucesso",
        user: result.value,
      });
    } else {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error("Erro rota PATCH:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const conexao = await mongo();
    const collection = conexao.db.collection("usuarios");
    const resultado = await collection.deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 1) {
      return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } else {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error("Erro rota DELETE:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

app.post("/:id", async (req, res) => {
  try {
    const body = req.body;
    const conexao = await mongo();
    const collection = conexao.db.collection("usuarios");
    const usuario = await collection.insertOne({
      nome: body.nome,
      sobrenome: body.sobrenome,
      anoDeNascimento: body.anoDeNascimento,
    });
    return res.status(200).json(usuario);
  } catch {
    console.error("Erro rota POST:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
