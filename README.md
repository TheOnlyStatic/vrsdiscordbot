# Roblox → Discord Purchase Bot

Sends a Discord embed message every time a player buys a gamepass in your Roblox game.

---

## How It Works

```
Player buys gamepass in Roblox
       ↓
Roblox server script fires (PurchaseTracker.lua)
       ↓
HTTP POST sent to your Node.js server (index.js)
       ↓
Discord bot sends embed to your channel
```

---

## Setup Guide

### Step 1 — Create a Discord Bot
1. Go to https://discord.com/developers/applications
2. Click **New Application** → give it a name
3. Go to **Bot** tab → click **Add Bot**
4. Under **Token**, click **Copy** — this is your `DISCORD_TOKEN`
5. Under **Privileged Gateway Intents**, enable **Server Members Intent** if needed
6. Go to **OAuth2 → URL Generator** → check `bot` + `Send Messages` + `Embed Links`
7. Open the generated URL and invite the bot to your server

### Step 2 — Get Your Channel ID
1. In Discord, go to **User Settings → Advanced → Enable Developer Mode**
2. Right-click your target channel → **Copy ID** — this is your `CHANNEL_ID`

### Step 3 — Configure the Bot
Open `index.js` and fill in:
```js
const config = {
  DISCORD_TOKEN: "your-bot-token",
  CHANNEL_ID:   "your-channel-id",
  WEBHOOK_SECRET: "make-up-any-secret-string",  // e.g. "mygame_secret_123"
  PORT: 3000,
};
```

### Step 4 — Run the Bot
```bash
npm install
node index.js
```
Your bot and webhook server are now running.

> **Hosting options**: Run on a VPS (DigitalOcean, Hetzner), a free service like Railway.app, or your own machine with port forwarding.

### Step 5 — Configure the Roblox Script
1. Open `PurchaseTracker.lua`
2. Fill in your server's public IP/URL and the same secret:
```lua
local WEBHOOK_URL    = "http://YOUR_SERVER_IP:3000/purchase"
local WEBHOOK_SECRET = "mygame_secret_123"
```
3. Add your gamepass IDs to the `GAMEPASS_NAMES` table:
```lua
local GAMEPASS_NAMES = {
    [123456789] = "VIP Pass",
}
```
4. In Roblox Studio: paste the script into **ServerScriptService**
5. Enable **HTTP Requests**: Game Settings → Security → Allow HTTP Requests ✅

---

## Testing
Once everything is running, you can test with curl:
```bash
curl -X POST http://localhost:3000/purchase \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-secret","username":"TestPlayer","userId":"12345","gamepassId":"111","gamepassName":"VIP Pass"}'
```
You should see the embed appear in Discord instantly.
