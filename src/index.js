const express = require("express");
require("dotenv").config();
const connectToDatabase = require("./db/mongo");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const dbObject = await connectToDatabase();
    const usuariosCollection = dbObject.db.collection("usuarios");
    const usuarios = await usuariosCollection.find({}).toArray();
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
