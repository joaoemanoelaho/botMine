const express = require("express");
const http = require("http");
const mineflayer = require('mineflayer');
const pvp = require('mineflayer-pvp').plugin;
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const armorManager = require('mineflayer-armor-manager');
const AutoAuth = require('mineflayer-auto-auth');

const app = express();
app.use(express.json());

app.get("/", (_, res) => res.send("Bot está rodando! 🚀"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); // Mensagem de console quando o bot estiver online

setInterval(() => {
  http.get("https://mixed-rhianna-fgdt-ded50c23.koyeb.app/");
  console.log("Mantendo a instância ativa...");
}, 600000); // Ping a cada 10 minutos

setInterval(() => {
  http.get("https://bot-mine-44hjmdptb-joaoemanoelahos-projects.vercel.app");
  console.log("Mantendo a instância ativa...");
}, 12000); // Ping a cada 2 minutos	



let bot;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function moveRandomly() {
  if (!bot || !bot.entity) return;

  const directions = ['forward', 'back', 'left', 'right'];
  const randomDirection = directions[getRandomInt(0, directions.length - 1)];

  bot.setControlState(randomDirection, true);
  setTimeout(() => {
    bot.setControlState(randomDirection, false);
  }, getRandomInt(1000, 3000)); // Movimenta por 1 a 3 segundos

  console.log(`🟢 Movendo aleatoriamente para evitar kick: ${randomDirection}`);

  // Define um tempo aleatório para o próximo movimento (entre 1 e 3 minutos)
  const nextMove = getRandomInt(60000, 180000);
  setTimeout(moveRandomly, nextMove);
}

function createBot() {
  if (bot) {
    console.log("🔄 O bot já está conectado, não será recriado.");
    return;
  }

  console.log("🟢 Criando e conectando o bot...");

  bot = mineflayer.createBot({
    host: 'joaoemaanoel-PJfk.aternos.me',
    version: false, // Defina a versão se necessário, ex: '1.16.5'
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
    setTimeout(moveRandomly, getRandomInt(60000, 180000)); // Inicia os movimentos aleatórios após login
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
}

// Iniciar o bot apenas se não estiver rodando
createBot();
