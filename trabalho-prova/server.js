const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();
const port = 3000;

app.use(express.json());

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

let receitas = [
  {
    id: 1,
    nome: "Bolo de Cenoura",
    tipo: "sobremesa",
    ingredientes: ["cenoura", "farinha", "açúcar", "ovo"],
    preparo: "Misture os ingredientes e asse."
  },
  {
    id: 2,
    nome: "Pão de Queijo",
    tipo: "entrada",
    ingredientes: ["polvilho", "queijo", "ovo", "óleo"],
    preparo: "Misture tudo e asse em forminhas."
  },
  {
    id: 3,
    nome: "Torta de Limão",
    tipo: "sobremesa",
    ingredientes: ["limão", "açúcar", "creme de leite", "massa"],
    preparo: "Misture todos os ingredientes e asse por 30 minutos."
  },
  {
    id: 4,
    nome: "Lasagna",
    tipo: "prato principal",
    ingredientes: ["massa de lasanha", "carne moída", "queijo", "molho de tomate"],
    preparo: "Monte as camadas e asse por 45 minutos."
  },
  {
    id: 5,
    nome: "Brigadeiro",
    tipo: "sobremesa",
    ingredientes: ["leite condensado", "chocolate em pó", "manteiga", "granulado"],
    preparo: "Cozinhe os ingredientes até dar ponto, enrole e passe no granulado."
  },
  {
    id: 6,
    nome: "Feijoada",
    tipo: "prato principal",
    ingredientes: ["feijão preto", "carne seca", "linguiça", "arroz"],
    preparo: "Cozinhe tudo junto e sirva com arroz e farofa."
  },
  {
    id: 7,
    nome: "Mousse de Maracujá",
    tipo: "sobremesa",
    ingredientes: ["maracujá", "creme de leite", "leite condensado", "gelatina"],
    preparo: "Misture os ingredientes e leve à geladeira até firmar."
  },
  {
    id: 8,
    nome: "Sopa de Legumes",
    tipo: "entrada",
    ingredientes: ["cenoura", "batata", "abobrinha", "cebola", "caldo de galinha"],
    preparo: "Cozinhe os legumes em água com caldo até ficarem macios."
  },
  {
    id: 9,
    nome: "Panqueca",
    tipo: "prato principal",
    ingredientes: ["farinha", "leite", "ovo", "recheio de sua escolha"],
    preparo: "Misture os ingredientes, frite em uma frigideira e adicione o recheio."
  },
  {
    id: 10,
    nome: "Torta de Frango",
    tipo: "prato principal",
    ingredientes: ["massa de torta", "frango desfiado", "creme de leite", "queijo"],
    preparo: "Misture o frango com os outros ingredientes, coloque na massa e asse."
  }
];


app.get('/receitas', (req, res) => {
  const { ingrediente, tipo } = req.query;

  let resultados = receitas;
  if (ingrediente) {
    resultados = resultados.filter(r => r.ingredientes.includes(ingrediente.toLowerCase()));
  }
  if (tipo) {
    resultados = resultados.filter(r => r.tipo === tipo.toLowerCase());
  }

  res.json(resultados);
});

app.post('/receitas', (req, res) => {
  const { nome, tipo, ingredientes, preparo } = req.body;
  const novaReceita = {
    id: receitas.length ? receitas[receitas.length - 1].id + 1 : 1,
    nome,
    tipo,
    ingredientes: ingredientes.map(i => i.toLowerCase()),
    preparo
  };
  receitas.push(novaReceita);
  res.status(201).json(novaReceita);
});

app.get('/receitas/:id', (req, res) => {
  const receita = receitas.find(r => r.id === parseInt(req.params.id));
  if (!receita) return res.status(404).json({ error: 'Receita não encontrada' });
  res.json(receita);
});

app.put('/receitas/:id', (req, res) => {
  const { nome, tipo, ingredientes, preparo } = req.body;
  const receita = receitas.find(r => r.id === parseInt(req.params.id));
  if (!receita) return res.status(404).json({ error: 'Receita não encontrada' });

  if (nome) receita.nome = nome;
  if (tipo) receita.tipo = tipo;
  if (ingredientes) receita.ingredientes = ingredientes.map(i => i.toLowerCase());
  if (preparo) receita.preparo = preparo;

  res.json(receita);
});

app.delete('/receitas/:id', (req, res) => {
  const index = receitas.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Receita não encontrada' });

  const receitaRemovida = receitas.splice(index, 1);
  res.json(receitaRemovida[0]);
});

https.createServer(options, app).listen(port, () => {
  console.log(`Servidor HTTPS rodando em https://localhost:${port}`);
});
