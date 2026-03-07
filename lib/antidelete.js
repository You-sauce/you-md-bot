const { getAntideleteStatus } = require('../data/Antidelete');
const config = require('../config');

const handleAntidelete = async (conn, updates, store) => {
    try {
        for (const update of updates) {
            if (update.key.fromMe) continue;

            const isRevoke = update.update.messageStubType === 68 || 
                             (update.update.message && 
                              update.update.message.protocolMessage && 
                              update.update.message.protocolMessage.type === 0);

            if (isRevoke) {
                const chatId = update.key.remoteJid;
                const messageId = update.key.id;
                const participant = update.key.participant || chatId;

                const isEnabled = await getAntideleteStatus(chatId);
                if (!isEnabled) return;

                if (!store || !store.messages[chatId]) return;
                const msg = await store.loadMessage(chatId, messageId);

                if (msg) {
                    const alertText = `
𝒀𝑶𝑼 𝑴𝑫 𝑩𝑶𝑻 — 𝑨𝑵𝑻𝑰 𝑫𝑬𝑳𝑬𝑻𝑬
╭ ┄┄┄⪼
│ 🚫 *𝙽𝙴𝚆 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 !*
│ 👤 𝚄𝚂𝙴𝚁: *@${participant.split('@')[0]}*
│ 🏷️ 𝚌𝚑𝚊𝚝 / 𝚐𝚛𝚘𝚞𝚙: *${metadata.subject || "Private Chat"}*
│ 🕒 𝚃𝙸𝙼𝙴: *${new Date().toLocaleString()}*
│ 𝙰𝙽𝚃𝙸 𝙳𝙴𝙻𝙴𝚃𝙴 𝙼𝙴𝚂𝚂𝙰𝙶𝙴
╰ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⪼
> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇
`;
                    await conn.sendMessage(chatId, { text: alertText, mentions: [participant] });
                    await conn.sendMessage(chatId, { forward: msg, contextInfo: { isForwarded: false } }, { quoted: msg });
                }
            }
        }
    } catch (e) { console.error("Antidelete Error:", e); }
};

module.exports = { handleAntidelete };
