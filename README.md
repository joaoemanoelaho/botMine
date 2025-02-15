# 🏆 Bot Minecraft AFK - Mineflayer

Este é um bot para **Minecraft Java Edition** que pode permanecer ativo em servidores **Aternos** ou qualquer outro servidor, usando a biblioteca [Mineflayer](https://github.com/PrismarineJS/mineflayer).

O bot pode: ✅ Ficar **AFK** para manter o servidor ativo\
✅ **Proteger uma área** com PVP automático\
✅ **Andar aleatoriamente** para evitar kick por inatividade

---

## **🚀 Instalação**

Você pode rodar este bot no **Windows, Termux (Android) ou Linux**.

### **1️⃣ Instalar Node.js**

Se você **não tem o Node.js instalado**, instale primeiro:

- **Windows:** [https://nodejs.org/](https://nodejs.org/)
- **Termux (Android):**
  ```sh
  pkg update && pkg upgrade -y
  pkg install nodejs git -y
  ```
- **Linux (Ubuntu/Debian):**
  ```sh
  sudo apt update && sudo apt upgrade -y
  sudo apt install nodejs npm git -y
  ```

---

### **2️⃣ Baixar o Projeto**

Clone o repositório ou baixe o código manualmente.

```sh
git clone https://github.com/seu-usuario/bot-mc.git
cd bot-mc
```

Caso não tenha `git`, baixe o código manualmente e extraia para uma pasta.

---

### **3️⃣ Instalar Dependências**

Antes de rodar, instale as dependências necessárias:

```sh
npm install
```

Se houver erro, tente instalar as dependências manualmente:

```sh
npm install express mineflayer mineflayer-pvp mineflayer-pathfinder mineflayer-armor-manager mineflayer-auto-auth
```

---

### **4️⃣ Configurar o Bot**

Abra o arquivo `bot.js` e edite as seguintes linhas:

```js
const bot = mineflayer.createBot({
  host: "SEU-SERVIDOR.aternos.me", // IP do servidor
  port: 25565, // Porta do servidor
  username: "BotAFK", // Nome do bot no jogo
});
```

Salve o arquivo.

---

### **5️⃣ Iniciar o Bot**

Para rodar o bot, use:

```sh
node bot.js
```

Se quiser manter o bot rodando **24/7**, veja abaixo.

---

## **🔥 Como Manter o Bot Online 24/7**

Se você **fechar o terminal**, o bot **vai parar**. Para evitar isso:

### **✅ Método 1: Rodar em Segundo Plano (nohup)**

No **Linux/Termux**, execute:

```sh
nohup node bot.js > log.txt 2>&1 &
```

Para ver os logs:

```sh
tail -f log.txt
```

Para parar o bot:

```sh
pkill node
```

---

### **✅ Método 2: Usar tmux (Recomendado)**

1. \*\*Instale o \*\*`` (Linux/Termux):
   ```sh
   pkg install tmux -y
   ```
2. **Inicie uma sessão para o bot**:
   ```sh
   tmux new-session -s meu-bot
   ```
3. **Rode o bot normalmente**:
   ```sh
   node bot.js
   ```
4. **Para sair sem parar o bot**, pressione:
   ```
   CTRL + B, depois solte e aperte D
   ```
5. Para voltar à sessão do bot:
   ```sh
   tmux attach-session -t meu-bot
   ```
6. Para fechar o bot:
   ```sh
   tmux kill-session -t meu-bot
   ```

---

### **✅ Método 3: Usar PM2 (Melhor para Servidores)**

Se estiver rodando o bot em um **servidor VPS**, pode usar o **PM2** para manter ele sempre ativo.

1. **Instale o PM2**:
   ```sh
   npm install -g pm2
   ```
2. **Inicie o bot com o PM2**:
   ```sh
   pm2 start bot.js --name "meu-bot" --restart-delay=60000
   ```
3. **Comandos úteis do PM2**:
   - Ver status do bot:
     ```sh
     pm2 status
     ```
   - Reiniciar manualmente:
     ```sh
     pm2 restart meu-bot
     ```
   - Parar o bot:
     ```sh
     pm2 stop meu-bot
     ```
   - Iniciar automaticamente ao ligar o PC/servidor:
     ```sh
     pm2 startup
     ```

---

## **🎮 Problemas Comuns e Soluções**

❌ **Erro \*\*\*\***``\
✅ Rode:

```sh
npm install express
```

❌ **Erro \*\*\*\***``\
✅ O `package.json` pode estar ausente. Rode:

```sh
npm init -y
npm install
```

❌ **Bot não conecta ao servidor**\
✅ Verifique se o **servidor Aternos está online** e se **o IP/porta estão corretos**.

❌ **Bot desconecta sozinho após um tempo**\
✅ Habilite **modo pirata (**``**)** no Aternos.

---

## **🚀 Contribuições**

Se quiser melhorar o projeto, sinta-se à vontade para abrir **pull requests** ou sugerir mudanças.

💡 **Dúvidas? Entre em contato no Discord!** 🛠️

tesetr
