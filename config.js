const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
}

module.exports = {
    // ===========================================================
    // 1. CONFIGURATION DE BASE (Session & Database)
    // ===========================================================
    SESSION_ID: process.env.SESSION_ID || "", 
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://kaviduinduwara:kavidu2008@cluster0.bqmspdf.mongodb.net/soloBot?retryWrites=true&w=majority&appName=Cluster0',
    
    // ===========================================================
    // 2. INFORMATIONS DU BOT
    // ===========================================================
    PREFIX: process.env.PREFIX || '.',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '56945031186', // Mettez votre numéro ici
    BOT_NAME: "𝒀𝑶𝑼 𝑴𝑫 𝑩𝑶𝑻",
    BOT_FOOTER: '> 𝑴𝑨𝑫𝑬 𝑰𝑵 𝑩𝒀 𝒀𝑶𝑼 𝑻𝑬𝑪𝑯𝑿',
    ADMINEVENTS: process.env.ADMINEVENTS || 'on',
    // Mode de travail : public, private, group, inbox
    WORK_TYPE: process.env.WORK_TYPE || "public", 
    
    // ===========================================================
    // 3. FONCTIONNALITÉS AUTOMATIQUES (STATUTS)
    // ===========================================================
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || 'true', // Voir automatiquement les statuts
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'true', // Liker automatiquement les statuts
    AUTO_LIKE_EMOJI: ['❤️', '🌹', '😇', '💥', '🔥', '💫', '💎', '💙', '🌝', '💚'], 
    
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'false', // Répondre aux statuts
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || 'Nice status! 🔥', // Message de réponse
    
    // ===========================================================
    // 4. FONCTIONNALITÉS DE CHAT & PRÉSENCE
    // ===========================================================
    READ_MESSAGE: process.env.READ_MESSAGE || 'false', // Marquer les messages comme lus (Blue Tick)
    AUTO_TYPING: process.env.AUTO_TYPING || 'false', // Afficher "Écrit..."
    AUTO_RECORDING: process.env.AUTO_RECORDING || 'false', // Afficher "Enregistre..."
    
    // ===========================================================
    // 5. GESTION DES GROUPES
    // ===========================================================
    WELCOME: process.env.WELCOME || 'true', // Message de bienvenue
    GOODBYE: process.env.GOODBYE || 'true', // Message d'au revoir
    GROUP_INVITE_LINK: 'https://chat.whatsapp.com/EQZnDec04zLHfQKxfce8jr',
    
    // ===========================================================
    // 6. SÉCURITÉ & ANTI-CALL
    // ===========================================================
    ANTI_CALL: process.env.ANTI_CALL || 'false', // Rejeter les appels
    REJECT_MSG: process.env.REJECT_MSG || '*📞 Call rejected automatically. No calls allowed.*',
    
    // ===========================================================
    // 7. IMAGES & LIENS
    // ===========================================================
    IMAGE_PATH: 'https://files.catbox.moe/ggt6bi.jpg',
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029Vb7EpGwBlHpXKNgFET1Z',
    
    // ===========================================================
    // 8. EXTERNAL API (Optionnel)
    // ===========================================================
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || ''
};
