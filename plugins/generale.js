const { cmd, commands } = require('../command');
const config = require('../config');
const os = require('os');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// =================================================================
// 🏓 COMMANDE PING (Style Speedtest)
// =================================================================
cmd({
    pattern: "uptime",
    alias: ["speed"],
    desc: "Vérifier la latence et les ressources",
    category: "general",
    react: "⚡"
},
async(conn, mek, m, { from, reply, myquoted }) => {
    try {
        const start = Date.now();
        
        // 1. Message d'attente
        const msg = await conn.sendMessage(from, { text: '🔄 ᴛᴇsᴛɪɴɢ sᴘᴇᴇᴅ..._' }, { quoted: myquoted });
        
        const end = Date.now();
        const latency = end - start;
        
        // 2. Calcul Mémoire (RAM)
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
        const usedMem = (totalMem - freeMem).toFixed(0);

        // 3. Message Final Stylé
        const pingMsg = `
⚡ *𝒀𝑶𝑼 𝑴𝑫 𝑩𝑶𝑻 𝑺𝑷𝑬𝑬𝑫* ⚡
╭ ┄┄┄⪼
│📟 *ʟᴀᴛᴇɴᴄʏ:* ${latency}ms
│💻 *ʀᴀᴍ:* ${usedMem}MB / ${totalMem}MB
│🚀 *sᴇʀᴠᴇʀ:* ᴀᴄᴛɪᴠᴇe
╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⪼
> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇
`;

        // 4. Édition du message (Effet visuel)
        await conn.sendMessage(from, { text: pingMsg, edit: msg.key });

    } catch (e) {
        reply("Error: " + e.message);
    }
});
//cmd ping2
//==============[ PING PLUGIN — NOX MINI ]===============//
cmd({
    name: "ping2",
    alias: ['speed2', 'latence'],
    desc: "Teste la vitesse du bot",
    category: "general",
    react: "📍",

    start: async (socket, msg, { sender, pushName, prefix }) => {
        try {

            await socket.sendMessage(sender, { 
                react: { text: '📍', key: msg.key } 
            });

            let videoUrl = 'https://files.catbox.moe/8das33.mp4';
            const start = performance.now();

            await socket.sendMessage(sender, { 
                text: "🔄 *𝐘𝐎𝐔 𝐌𝐃 𝐏𝐈𝐍𝐆 𝐓𝐄𝐒𝐓𝐈𝐍𝐆...*" 
            }, { quoted: msg });

            const latency = Math.floor(performance.now() - start);

            let quality, color, bar;

            if (latency < 100) {
                quality = "🟢 𝐄𝐗𝐂𝐄𝐋𝐋𝐄𝐍𝐓";
                color = "🟢";
                bar = "███████";
            } else if (latency < 300) {
                quality = "🟡 𝐆𝐎𝐎𝐃";
                color = "🟡";
                bar = "█████░░";
            } else if (latency < 600) {
                quality = "🟠 𝐅𝐀𝐈𝐑";
                color = "🟠";
                bar = "███░░░░";
            } else {
                quality = "🔴 𝐏𝐎𝐎𝐑";
                color = "🔴";
                bar = "█░░░░░░";
            }

            const caption = `
╭ ┄┄┄⪼
│ 🚀 *𝐘𝐎𝐔 𝐌𝐃 𝐏𝐈𝐍𝐆 𝐓𝐄𝐒𝐓*
│ ⚡ *Vitesse:* ${latency}ms
│ ${color} *Qualité:* ${quality}
│ 📶 *Signal:* [${bar}]
│ 🕒 *Heure:* ${new Date().toLocaleString()}
╰ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⪼
> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇
            `.trim();

            await socket.sendMessage(sender, {
                video: { url: videoUrl },
                caption: caption,
                buttons: [
                    { buttonId: `${prefix}bot_info`, buttonText: { displayText: '🔮 Bot Info' }, type: 1 },
                    { buttonId: `${prefix}bot_stats`, buttonText: { displayText: '📊 Stats' }, type: 1 }
                ],
                headerType: 4
            }, { quoted: msg });

        } catch (err) {
            console.error("PING ERROR:", err);
        }
    }
});

// =================================================================
// 📜 COMMANDE MENU (Style Dashboard)
// =================================================================
cmd({
    pattern: "menu",
    alias: ["list", "help", "commands"],
    desc: "Afficher le menu",
    category: "general",
    react: "🔆"
}, async (conn, mek, m, { from, pushname, reply, isOwner, myquoted }) => {

    // ─── STYLE TYPEWRITER (FOOTER) ───
    const toTypewriter = (text) => {
        if (!text) return '';
        return text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 127391);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 127391);
            if (code >= 48 && code <= 57) return String.fromCharCode(code + 127381);
            return char;
        }).join('');
    };

    try {
        // ─── UPTIME ───
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const mnt = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        const uptimeString = `${h}h ${mnt}m ${s}s`;

        // ─── DATE & HEURE (HAÏTI) ───
        const date = new Date().toLocaleDateString("fr-FR", {
            timeZone: "America/Port-au-Prince"
        });
        const time = new Date().toLocaleTimeString("fr-FR", {
            timeZone: "America/Port-au-Prince"
        });

        // ─── RAM ───
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "MB";

        // ─── HEADER MENU (STYLE JOLIE) ───
        let menu = `
╭┄┄『 ✦ 𝒀𝑶𝑼 𝑴𝑫 𝑩𝑶𝑻 ✦ 』
┆ 👤 *𝚄𝚂𝙴𝚁* : ${pushname}
┆ 👑 *𝚁𝙰𝙽𝙺* : ${isOwner ? 'OWNER' : 'USER'}
┆ ⏳ *𝚄𝙿𝚃𝙸𝙼𝙴* : ${uptimeString}
┆ 💾 *𝚁𝙰𝙼* : ${memoryUsage}
┆ 🗓️ *𝙳𝙰𝚃𝙴* : ${date}
┆ ⌚ *𝚃𝙸𝙼𝙴* : ${time}
╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌◇
`;

        // ─── CLASSEMENT DES COMMANDES PAR CATÉGORIE ───
        const categoryMap = {};

        commands.forEach(cmd => {
            const cat = cmd.category || "general";
            if (!categoryMap[cat]) categoryMap[cat] = [];
            categoryMap[cat].push(cmd.pattern);
        });

        // ─── TRI DES CATÉGORIES ───
        const categories = Object.keys(categoryMap).sort();

        // ─── CONSTRUCTION DU MENU ───
        categories.forEach(cat => {
            menu += `
╭┄┄〔 ${cat.toUpperCase()} 〕
`;
            categoryMap[cat].forEach(c => {
                menu += `┆◈ ${config.PREFIX}${c}\n`;
            });
            menu += `╰╌╌╌╌╌╌╌╌╌╌✹\n`;
        });

        // ─── FOOTER ───
        const footer = toTypewriter(config.BOT_FOOTER || "> 𝑷𝑶𝑾𝑬𝑹𝑬𝑫 𝑩𝒀 𝒀𝑶𝑼 𝑻𝑬𝑪𝑯𝑿");

        menu += `
> ${footer}
`;

        // ─── ENVOI ───
        await conn.sendMessage(from, {
            image: { url: config.IMAGE_PATH },
            caption: menu
        }, { quoted: myquoted });

    } catch (err) {
        console.error(err);
        reply("❌ Erreur lors de la génération du menu:\n" + err.message);
    }
});


// =================================================================
// 👑 COMMANDE OWNER (Carte de visite)
// =================================================================
cmd({
    pattern: "owner",
    desc: "Contacter le créateur",
    category: "general",
    react: "👑"
},
async(conn, mek, m, { from, myquoted }) => {
    const ownerNumber = config.OWNER_NUMBER;
    
    // Création d'une vCard (Fiche contact)
    const vcard = 'BEGIN:VCARD\n' +
                  'VERSION:3.0\n' +
                  'FN:𝐘𝐎𝐔 𝐓𝐄𝐂𝐇𝐗 (𝐎𝐖𝐍𝐄𝐑)\n' +
                  'ORG:𝐘𝐎𝐔 𝐂𝐎𝐑𝐏𝐒;\n' +
                  `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\n` +
                  'END:VCARD';

    await conn.sendMessage(from, {
        contacts: {
            displayName: '𝐘𝐎𝐔 𝐓𝐄𝐂𝐇𝐗',
            contacts: [{ vcard }]
        }
    }, { quoted: myquoted });
});
-
// =================================================================
// 👑 COMMANDE GETPP (Carte de visite)
// =================================================================
cmd({
    pattern: "getpp",
    alias: ["stealpp"],
    react: "🖼️",
    desc: "Sends the profile picture of a user by phone number (owner only)",
    category: "owner",
    use: ".getpp <phone number>",
    filename: __filename
},
async (conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the user is the bot owner
        if (!isOwner) return reply("🛑 𝚈𝙾𝚄 𝙰𝚁𝙴 𝙽𝙾𝚃 𝙼𝚈 𝙾𝚆𝙽𝙴𝚁!");

        // Check if a phone number is provided
        if (!args[0]) return reply("🔥 𝙿𝙻𝙴𝙰𝚂𝙴 𝙿𝚁𝙾𝚅𝙸𝙳 𝙰 𝙽𝚄𝙼𝙱𝙴𝚁 ");

        // Format the phone number to JID
        let targetJid = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";

        // Get the profile picture URL
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(targetJid, "image");
        } catch (e) {
            return reply("🖼️ 𝙿𝚁𝙾𝙵𝙸𝙻𝙴 𝙽𝙾𝚃 𝙰𝙲𝙲𝙴𝚂𝚂𝙴𝙳");
        }

        // Get the user's name or number for the caption
        let userName = targetJid.split("@")[0]; // Default to phone number
        try {
            const contact = await conn.getContact(targetJid);
            userName = contact.notify || contact.vname || userName;
        } catch {
            // Fallback to phone number if contact info is unavailable
        }

        // Send the profile picture
        await conn.sendMessage(from, { 
            image: { url: ppUrl }, 
            caption: `📌 𝙿𝚁𝙾𝙵𝙸𝙻𝙴 𝙿𝙸𝙲𝚃𝚄𝚁𝙴 𝙾𝙵𝙵 ${userName}` 
        });

        // Send a reaction to the command message
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        // Reply with a generic error message and log the error
        reply("🛑 An error occurred while fetching the profile picture! Please try again later.");
        l(e); // Log the error for debugging
    }
});

// =================================================================
// 👑 COMMANDE URL (Carte de visite)
// =================================================================
cmd({
    pattern: "url",
    alias: ["tourl"],
    desc: "Uploader un média et obtenir une URL",
    category: "main",
    react: "🔗"
}, async (socket, mek, m, { reply, from }) => {

    try {
        // 📌 média cité ou message direct
        const msg = m.quoted ? m.quoted : m;

        if (!msg.mtype || !msg.msg || !msg.msg.mimetype) {
            return reply("🔗 Réponds à un média (image, vidéo, audio, document).");
        }

        const mime = msg.msg.mimetype;

        // ⏳
        reply("⏳ Upload en cours...");

        // ⬇️ téléchargement
        const buffer = await msg.download();
        if (!buffer) return reply("❌ Impossible de télécharger le média.");

        // ⚖️ Calcul de la taille (SizeMedia)
        const sizeInBytes = buffer.length;
        const sizeMedia = (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";

        // 📂 fichier temporaire
        const ext = mime.split("/")[1] || "bin";
        const tempPath = path.join(__dirname, `../temp_${Date.now()}.${ext}`);
        fs.writeFileSync(tempPath, buffer);

        // 📤 Catbox upload
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(tempPath));

        const res = await axios.post(
            "https://catbox.moe/user/api.php",
            form,
            { headers: form.getHeaders() }
        );

        const mediaUrl = res.data.trim();

        // 🧾 MEDIA TYPE basé sur mtype
        let mediaType = "FILE";
        if (msg.mtype === "imageMessage") mediaType = "IMAGE";
        else if (msg.mtype === "videoMessage") mediaType = "VIDEO";
        else if (msg.mtype === "audioMessage") mediaType = "AUDIO";
        else if (msg.mtype === "documentMessage") mediaType = "DOCUMENT";

        // 🗓️ Date Haïti
        const uploadDate = new Date().toLocaleString("fr-FR", {
            timeZone: "America/Port-au-Prince"
        });

        let u = "`";
        
        // 📤 réponse finale avec sizeMedia ajouté
        await socket.sendMessage(from, {
            text:
`📥 ${u}𝙳𝙰𝚃𝙰 𝚄𝙿𝙻𝙾𝙰𝙳${u}
╭───〔 🛡️ 𝚈𝙾𝚄 𝚄𝚁𝙻 〕───╼
│ 📥 𝙼𝙴𝙳𝙸𝙰 : ${mediaType}
│ ⚖️ 𝚂𝙸𝚉𝙴 : ${sizeMedia}
│ 🔗 𝙻𝙸𝙽𝙺 : ${mediaUrl}
│ 📅 𝚃𝙸𝙼𝙴 : ${uploadDate}
╰───────────────────────◈
> *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇*`
        });

        // 🧹 clean
        fs.unlinkSync(tempPath);

    } catch (err) {
        console.error(err);
        reply("❌ Erreur pendant l’upload.");
    }
});
