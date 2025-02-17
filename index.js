const express = require("express");
const http = require("http");
const https = require("https");
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

// Mantém a instância ativa no Koyeb
setInterval(() => {
  https.get("https://mixed-rhianna-fgdt-ded50c23.koyeb.app/", (res) => {
    console.log(`🔄 Mantendo a instância ativa... Status Code: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error("❌ Erro ao pingar o servidor:", err.message);
  });
}, 600000); // Ping a cada 10 minutos (600000ms)

let bot;

// Função para gerar um tempo aleatório entre min e max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para movimentação com paradas aleatórias
function moveRandomly() {
  if (!bot || !bot.entity) return;

  const directions = ['forward', 'back', 'left', 'right', 'jump'];
  const randomDirection = directions[getRandomInt(0, directions.length - 1)];

  const moveDuration = getRandomInt(1000, 3000); // Movimenta entre 1 a 3 segundos
  const stopDuration = getRandomInt(0, 60000); // Para entre 0 a 60 segundos

  bot.setControlState(randomDirection, true);
  console.log(`🟢 Movendo: ${randomDirection} por ${moveDuration / 1000} segundos`);

  setTimeout(() => {
    bot.setControlState(randomDirection, false);
    console.log(`⏸️ Parando por ${stopDuration / 1000} segundos`);

    // Espera o tempo de parada antes de se mover novamente
    setTimeout(moveRandomly, stopDuration);
  }, moveDuration);
}

// Função para criar o bot
function createBot() {
  if (bot) {
    console.log("🔄 O bot já está conectado, não será recriado.");
    return;
  }

  console.log("🟢 Criando e conectando o bot...");

  bot = mineflayer.createBot({
    host: 'joaoemaanoel-PJfk.aternos.me',
    version: false, // Defina a versão se necessário, ex: '1.16.5'
    username: `Bot_${getRandomInt(1000, 9999)}`, // Nome aleatório para evitar conflitos
    port: 29848,
    plugins: [AutoAuth],
    AutoAuth: 'bot112022'
  });

  bot.loadPlugin(pvp);
  bot.loadPlugin(armorManager);
  bot.loadPlugin(pathfinder);

  bot.on('login', () => {
    console.log("✅ Bot entrou no servidor!");
    setTimeout(moveRandomly, getRandomInt(1000, 3000)); // Começa a se mover após um tempo aleatório
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
