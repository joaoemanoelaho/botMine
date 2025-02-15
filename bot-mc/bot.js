const express = require("express");
const http = require("http");
const mineflayer = require('mineflayer');
const pvp = require('mineflayer-pvp').plugin;
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const armorManager = require('mineflayer-armor-manager');
const AutoAuth = require('mineflayer-auto-auth');

const app = express();
app.use(express.json());

app.get("/", (_, res) => res.sendFile(__dirname + "/index.html"));
app.listen(process.env.PORT);

setInterval(() => {
  console.log("⏳ Mantendo o processo ativo...");
}, 224000);

let bot;

function createBot() {
  if (bot) {
    console.log("🔄 O bot já está conectado, não será recriado.");
    return;
  }

  console.log("🟢 Criando e conectando o bot...");

  bot = mineflayer.createBot({
    host: 'joaoemaanoel-PJfk.aternos.me',
    version: false, // Defina a versão se necessário, ex: '1.16.5'
    username: 'oi',
    port: 29848,
    plugins: [AutoAuth],
    AutoAuth: 'bot112022'
  });

  bot.loadPlugin(pvp);
  bot.loadPlugin(armorManager);
  bot.loadPlugin(pathfinder);

  bot.on('login', () => {
    console.log("✅ Bot entrou no servidor!");
  });

  bot.on('chat', (username, message) => {
    if (message === 'guard') {
      const player = bot.players[username];
      if (!player) return;
      bot.chat('I will guard!');
      guardArea(player.entity.position);
    }
    if (message === 'stop') {
      bot.chat('I will stop!');
      stopGuarding();
    }
  });

  bot.on('kicked', (reason) => {
    console.log(`❌ Bot foi expulso: ${reason}`);
    bot = null;
    setTimeout(createBot, 60000); // Aguarda 1 minuto antes de tentar reconectar
  });

  bot.on('error', (err) => {
    console.log("⚠️ Erro detectado:", err);
    bot = null;
    setTimeout(createBot, 60000);
  });

  bot.on('end', () => {
    console.log("🔄 Bot desconectado! Tentando reconectar em 1 minuto...");
    bot = null;
    setTimeout(createBot, 60000);
  });

  // Simula movimentação para evitar kick
  setInterval(() => {
    if (bot && bot.entity) {
      console.log("🟢 Movendo para evitar kick...");
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }
  }, 60000);
}

// Iniciar o bot apenas se não estiver rodando
createBot();
