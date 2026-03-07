const config = require('../config');

const groupEvents = async (sock, update) => {
    try {
        const { id, participants, action } = update;
        
        // Si rien n'est activé → on sort
        if (
            config.WELCOME !== 'true' &&
            config.GOODBYE !== 'true' &&
            config.ADMINEVENTS !== 'true'
        ) return;

        let metadata;
        try {
            metadata = await sock.groupMetadata(id);
        } catch (e) {
            return;
        }

        for (const participant of participants) {
            let ppUrl;
            try {
                ppUrl = await sock.profilePictureUrl(participant, 'image');
            } catch (e) {
                ppUrl = config.IMAGE_PATH;
            }

            // -------------------------
            //  WELCOME
            // -------------------------
            if (action === 'add' && config.WELCOME === 'true') {
                const welcomeText = `
✦ 𝒀𝑶𝑼 𝑴𝑫 𝑩𝑶𝑻 — 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 ✦
╭ ┄┄┄⪼
│ 👋 𝑯𝒆𝒚 @${participant.split('@')[0]} !
│ 🏠 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐: ${metadata.subject}
│ 👥 𝑴𝒆𝒎𝒃𝒆𝒓𝒔: ${metadata.participants.length}
╰ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⪼
> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇
`;
                await sock.sendMessage(id, {
                    image: { url: ppUrl },
                    caption: welcomeText,
                    mentions: [participant]
                });
            }

            // -------------------------
            //  GOODBYE
            // -------------------------
            if (action === 'remove' && config.GOODBYE === 'true') {
                const goodbyeText = `
✦ 𝒀𝑶𝑼 𝑴𝑫 𝑩𝑶𝑻 — 𝑮𝑶𝑶𝑫𝑩𝒀𝑬 ✦
╭ ┄┄┄⪼
│ 👋 𝑭𝒂𝒓𝒆𝒘𝒆𝒍𝒍 @${participant.split('@')[0]}
│ 🚪 𝑳𝒆𝒇𝒕 𝒈𝒓𝒐𝒖𝒑: ${metadata.subject}
│ 📉 𝑴𝒆𝒎𝒃𝒆𝒓𝒔 𝒓𝒆𝒎𝒂𝒊𝒏𝒊𝒏𝒈: ${metadata.participants.length}
╰ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⪼
> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇
`;
                await sock.sendMessage(id, {
                    image: { url: ppUrl },
                    caption: goodbyeText,
                    mentions: [participant]
                });
            }

            // -------------------------
            //  ADMIN EVENTS (Promote / Demote)
            // -------------------------
            if (config.ADMINEVENTS === 'on') {

                // PROMOTE
                if (action === 'promote') {
                    const promoteText = `
✦ 𝑨𝑫𝑴𝑰𝑵 𝑬𝑽𝑬𝑵𝑻 — 𝑷𝑹𝑶𝑴𝑶𝑻𝑬 ✦
╭ ┄┄┄⪼
│ 🔥 @${participant.split('@')[0]} 𝒗𝒊𝒆𝒏𝒕 𝒅'𝒆̂𝒕𝒓𝒆 𝒑𝒓𝒐𝒎𝒖 !
│ 👑 𝑵𝒐𝒖𝒗𝒆𝒂𝒖 𝒂𝒅𝒎𝒊𝒏 𝒅𝒖 𝒈𝒓𝒐𝒖𝒑𝒆: ${metadata.subject}
╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⪼
> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇
`;
                    await sock.sendMessage(id, {
                        image: { url: ppUrl },
                        caption: promoteText,
                        mentions: [participant]
                    });
                }

                // DEMOTE
                if (action === 'demote') {
                    const demoteText = `
✦ 𝑨𝑫𝑴𝑰𝑵 𝑬𝑽𝑬𝑵𝑻 — 𝑫𝑬𝑴𝑶𝑻𝑬 ✦
╭ ┄┄┄⪼
│ ⚠️ @${participant.split('@')[0]} 𝒂 𝒑𝒆𝒓𝒅𝒖 𝒔𝒐𝒏 𝒓𝒂𝒏𝒈 𝒅'𝒂𝒅𝒎𝒊𝒏.
│ 📉 𝑮𝒓𝒐𝒖𝒑𝒆: ${metadata.subject}
╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⪼
> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇
`;
                    await sock.sendMessage(id, {
                        image: { url: ppUrl },
                        caption: demoteText,
                        mentions: [participant]
                    });
                }
            }
        }
    } catch (e) {
        console.error('❌ Error in groupEvents:', e);
    }
};

module.exports = { groupEvents };
