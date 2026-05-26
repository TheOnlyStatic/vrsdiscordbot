const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

// ─── CONFIG ────────────────────────────────────────────────────────────────
const config = {
  DISCORD_TOKEN: "YOUR_BOT_TOKEN_HERE",
  CHANNEL_ID: "YOUR_CHANNEL_ID_HERE",
  WEBHOOK_SECRET: "YOUR_SECRET_KEY_HERE", // same value used in Roblox script
  PORT: 3000,
};
// ───────────────────────────────────────────────────────────────────────────

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const app = express();
app.use(express.json());

// POST /purchase — called by the Roblox server-side script
app.post("/purchase", async (req, res) => {
  const { secret, username, userId, gamepassId, gamepassName, amount } =
    req.body;

  // Basic auth check
  if (secret !== config.WEBHOOK_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!username || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const channel = await client.channels.fetch(config.CHANNEL_ID);
    if (!channel) return res.status(500).json({ error: "Channel not found" });

    const embed = new EmbedBuilder()
      .setColor(0xff4444)
      .setTitle("🔔 New Purchase!")
      .setDescription(
        `**${username}** has purchased **${gamepassName || amount || "a gamepass"}**!`
      )
      .addFields(
        {
          name: "📋 Roblox Store Logs",
          value: `UserID: \`${userId}\``,
          inline: false,
        },
        ...(gamepassId
          ? [{ name: "🎮 Gamepass ID", value: `\`${gamepassId}\``, inline: true }]
          : [])
      )
      .setTimestamp()
      .setFooter({ text: "Roblox Store Logs" });

    await channel.send({ embeds: [embed] });
    console.log(`✅ Purchase logged: ${username} (${userId})`);
    res.json({ success: true });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check
app.get("/", (req, res) => res.send("Bot is running!"));

client.once("ready", () => {
  console.log(`✅ Discord bot logged in as ${client.user.tag}`);
  app.listen(config.PORT, () => {
    console.log(`✅ Webhook server listening on port ${config.PORT}`);
  });
});

client.login(config.DISCORD_TOKEN);
