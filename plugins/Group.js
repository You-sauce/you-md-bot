// 📌 HIDETAG — Tag tout le monde sans montrer les mentions
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require("../config");
cmd({
    pattern: "hidetag",
    desc: "Tag tout le monde sans afficher les mentions",
    category: "group",
    react: "👻"
},
async (socket, mek, m, { reply, args, isGroup, participants, from }) => {

    if (!isGroup) return reply("❌ Groupe uniquement !");
    let text = args.join(" ") || " ";

    let members = participants.map(v => v.id);

    await socket.sendMessage(from, {
        text: text,
        mentions: members
    });
});


// 📌 TAGADMIN — Mentionne uniquement les admins
cmd({
    pattern: "tagadmin",
    desc: "Tag uniquement les admins",
    category: "group",
    react: "🛡️"
},
async (socket, mek, m, { reply, isGroup, participants, from }) => {

    if (!isGroup) return reply("❌ Groupe uniquement !");

    let admins = participants
        .filter(u => u.admin)
        .map(a => a.id);

    if (admins.length === 0) return reply("❌ Aucun admin trouvé.");

    let txt = "╭┄┄┄⪼\n│🛡️ *ADMIN TAG*\n│";
    admins.forEach(a => {
        txt += `│⭐ @${a.split("@")[0]}\n`;
    });

    await socket.sendMessage(from, {
        text: txt,
        mentions: admins
    });
});


// 📌 ONLINE — Liste les personnes en ligne + envoie à chacun
cmd({
    pattern: "online",
    desc: "Liste des personnes en ligne",
    category: "group",
    react: "🟢"
},
async (socket, mek, m, { reply, isGroup, participants, from }) => {

    if (!isGroup) return reply("❌ Groupe uniquement !");

    // 🔥 Baileys donne presence = "available" (en ligne)
    let onlines = participants.filter(p => p.isOnline || p.presence === "available");

    if (onlines.length === 0) return reply("😴 Personne n'est en ligne.");

    let list = "╭┄┄┄⪼\n│🟢 *Personnes en ligne :*\n│";

    for (let u of onlines) {
        list += `│• @${u.id.split("@")[0]}\n`;

        // envoyer un ping à chaque personne
        await socket.sendMessage(u.id, {
            text: "👀 Tu es en ligne !"
        });
    }

    await socket.sendMessage(from, {
        text: list,
        mentions: onlines.map(v => v.id)
    });
});


cmd({
    name: "adminmsg",
    alias: ['adminevents', 'adminevent'],
    category: "group",
    desc: "Activer ou désactiver les messages promote/demote",
    react: "⚙️",

    start: async (sock, m, { text, isOwner, sender, prefix }) => {

        // Vérifier propriétaire
        if (!isOwner) {
            return sock.sendMessage(m.chat, { text: "❌ *Seul le propriétaire du bot peut utiliser cette commande !*" });
        }

        if (!text) {
            return sock.sendMessage(m.chat, {
                text: `╭┄┄┄⪼\n│⚙️ *𝐴𝐷𝑀𝐼𝑁 𝐸𝑉𝐸𝑁𝑇𝑆 𝑆𝐸𝑇𝑇𝐼𝑁𝐺*` +
                      `│𝐸𝑇𝐴𝑇 : *${config.ADMINEVENTS}*\n` +
                      `│• ${prefix}adminmsg on\n` +
                      `│• ${prefix}adminmsg off\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⪼`
            });
        }

        const choice = text.toLowerCase().trim();

        if (choice !== "on" && choice !== "off") {
            return sock.sendMessage(m.chat, { text: "❌ 𝑈𝑠𝑒 𝑜𝑛/𝑜𝑓𝑓" });
        }

        // Lire config.js
        const configPath = path.join(__dirname, '../config.js');
        let file = fs.readFileSync(configPath, 'utf8');

        // Remplace la valeur ADMINEVENTS
        file = file.replace(
            /ADMINEVENTS:\s*process\.env\.ADMINEVENTS\s*\|\|\s*['"]\w+['"]/,
            `ADMINEVENTS: process.env.ADMINEVENTS || '${choice}'`
        );

        // Écrire dans le fichier
        fs.writeFileSync(configPath, file, 'utf8');

        // Mettre à jour dans la mémoire du bot
        config.ADMINEVENTS = choice;

        await sock.sendMessage(m.chat, { 
            text: `✅ *ADMIN EVENTS mis à jour !*\n\n🔧 État : *${choice.toUpperCase()}*`
        });
    }
});

