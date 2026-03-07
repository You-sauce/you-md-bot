const { cmd, commands } = require('../command');
const config = require('../config');
const moment = require("moment");
// Commande Ping

const BOT_NEWSLETTER = '120363404137900781'; // Remplacé pour YOU MD BOT

// Commande ping principale
cmd({
    pattern: "ping",
    alias: ["speed", "pong", "ping2", "ping3"],
    react: "📟",
    desc: "Check bot's response time",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const startTime = Date.now();

        // Emojis aléatoires
        const reactionEmojis = ['🔥', '🔮', '💫', '🍹', '🍁', '❇️', '🎋', '🎐', '🪸'];
        const textEmojis = ['🪀', '🪂', '⚡️', '🚀', '🏎️', '🚁', '🌀', '📟', '✨'];
        let reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Envoi réaction
        await conn.sendMessage(from, { react: { text: reactionEmoji, key: mek.key } });

        const midTime = Date.now();
        const ping = midTime - startTime;

        // Envoi message principal
        const pingMsg = await conn.sendMessage(from, { text: "*🖥️ Measuring ping...*" }, { quoted: mek });

        // Résultat final
        const finalText = `*${textEmoji} 𝐏๏፝֟ƞ͛ɠ : ${ping} 𝐌𝐒*`;

        await conn.sendMessage(from, {
            text: finalText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: false,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: BOT_NEWSLETTER,
                    newsletterName: "𝐏๏፝֟ƞ͛ɠ ",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Ping command error:", e);
        reply("❌ Error while measuring ping.");
    }
});

// Commande Alive

let botStartTime = Date.now();

const ALIVE_IMG = "https://files.catbox.moe/wnyveu.jpg";
const ALIVE_AUDIO = "https://files.catbox.moe/oshm4v.mp3";

cmd({
  pattern: "alive",
  desc: "Check if the bot is active",
  category: "info",
  react: "👋",
  filename: __filename
},

async (conn, mek, m, { from, reply }) => {

  try {

    const pushname = m.pushName || "User";

    const time = moment().format("HH:mm:ss");
    const date = moment().format("dddd, MMMM Do YYYY");

    // Uptime
    const run = Date.now() - botStartTime;

    const sec = Math.floor((run / 1000) % 60);
    const min = Math.floor((run / (1000 * 60)) % 60);
    const hour = Math.floor(run / (1000 * 60 * 60));

    const caption = `
╭─ 「 *YOU MD BOT* 」
│✨ Bot is active & online
│👤 Owner : ${config.OWNER_NAME || "Unknown"}
│⚡ Version : 2.0.0
│🕒 Time : ${time}
│📳 Mode : ${config.MODE || "Public"}
│📅 Date : ${date}
│⏳ Uptime : ${hour}h ${min}m ${sec}s
╰────────────────❍
`.trim();

    // Send Image
    await conn.sendMessage(from, {
      image: { url: ALIVE_IMG },
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363404137900781@newsletter",
          newsletterName: "YOU MD BOT",
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Send Voice
    await conn.sendMessage(from, {
      audio: { url: ALIVE_AUDIO },
      mimetype: "audio/mp4",
      ptt: true,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363404137900781@newsletter",
          newsletterName: "YOU MD BOT 🎶",
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (err) {

    console.log("ALIVE ERROR:", err);

    reply("❌ Error while showing alive status.");

  }

});