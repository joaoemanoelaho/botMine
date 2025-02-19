const express = require("express");
const https = require("https");
const mineflayer = require('mineflayer');
const pvp = require('mineflayer-pvp').plugin;
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const armorManager = require('mineflayer-armor-manager');
const AutoAuth = require('mineflayer-auto-auth');

const app = express();
app.use(express.json());

// Servir a página index.html
app.get("/", (_, res) => res.sendFile(__dirname + "/index.html"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Mantém a instância ativa no Koyeb a cada 4 minutos
setInterval(() => {
  https.get("https://mixed-rhianna-fgdt-ded50c23.koyeb.app/", (res) => {
    console.log(`🔄 Mantendo a instância ativa... Status Code: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error("❌ Erro ao pingar o servidor:", err.message);
  });
}, 240000); // Ping a cada 4 minutos

let bot;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function moveRandomly() {
  if (!bot || !bot.entity) return;

  const directions = ['forward', 'back', 'left', 'right', 'jump'];
  const randomDirection = directions[getRandomInt(0, directions.length - 1)];
  const moveDuration = getRandomInt(1000, 3000);
  const stopDuration = getRandomInt(0, 60000);

  bot.setControlState(randomDirection, true);
  console.log(`🟢 Movendo: ${randomDirection} por ${moveDuration / 1000} segundos`);

  setTimeout(() => {
    bot.setControlState(randomDirection, false);
    console.log(`⏸️ Parando por ${stopDuration / 1000} segundos`);
    setTimeout(moveRandomly, stopDuration);
  }, moveDuration);
}

function createBot() {
  if (bot) {
    console.log("🔄 Desconectando bot antigo antes de criar um novo...");
    bot.end(); // Encerra corretamente o bot antigo
    bot = null;
  }

  console.log("🟢 Criando e conectando o bot...");
  bot = mineflayer.createBot({
    host: 'joaoemaanoel-PJfk.aternos.me',
    version: '1.21', // Defina a versão exata do seu servidor
    username: `Bot_${getRandomInt(1000, 9999)}`,
    port: 29848,
    plugins: [AutoAuth],
    AutoAuth: 'bot112022'
  });

  bot.loadPlugin(pvp);
  bot.loadPlugin(armorManager);
  bot.loadPlugin(pathfinder);

  bot.on('login', () => {
    console.log("✅ Bot entrou no servidor!");
    setTimeout(moveRandomly, getRandomInt(1000, 3000));
  });

  bot.on('kicked', (reason) => {
    console.log(`❌ Bot foi expulso: ${reason}`);
    bot.end();
    bot = null;
    setTimeout(createBot, 120000); // Aguarda 2 minutos antes de tentar reconectar
  });

  bot.on('error', (err) => {
    console.log("⚠️ Erro detectado:", err);
    bot.end();
    bot = null;
    setTimeout(createBot, 120000);
  });

  bot.on('end', () => {
    console.log("🔄 Bot desconectado! Tentando reconectar em 2 minutos...");
    bot.end();
    bot = null;
    setTimeout(createBot, 120000);
  });
}

createBot();
