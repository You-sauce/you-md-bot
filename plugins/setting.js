const { cmd } = require('../command');
const config = require("../config");

const { updateUserConfig } = require('../lib/database');

// Helper function to update config in memory and database
const updateConfig = async (key, value, botNumber, config, reply) => {
    try {
        // 1. Update in-memory config (Immediate)
        config[key] = value;
        
        // 2. Update in Database (Persistent)
        const newConfig = { ...config }; 
        newConfig[key] = value;
        
        await updateUserConfig(botNumber, newConfig);
        
        return reply(`✅ *${key}* has been updated to: *${value}*`);
    } catch (e) {
        console.error(e);
        return reply("❌ Error while saving to database.");
    }
};

// ============================================================
// 1. PRESENCE MANAGEMENT (Recording / Typing)
// ============================================================

cmd({
    pattern: "autorecording",
    alias: ["autorec"],
    desc: "Enable/Disable auto recording simulation",
    category: "settings",
    react: "🎤"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("🚫 Owner only!");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_RECORDING', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_RECORDING', 'false', botNumber, config, reply);
    } else {
        reply(`Current Status: ${config.AUTO_RECORDING}\nUsage: .autorecording on/off`);
    }
});

cmd({
    pattern: "autotyping",
    alias: ["autotype"],
    desc: "Enable/Disable auto typing simulation",
    category: "settings",
    react: "⌨️"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("🚫 Owner only!");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_TYPING', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_TYPING', 'false', botNumber, config, reply);
    } else {
        reply(`Current Status: ${config.AUTO_TYPING}\nUsage: .autotyping on/off`);
    }
});

// ============================================================
// 2. CALL MANAGEMENT (Anti-Call)
// ============================================================

cmd({
    pattern: "anticall",
    desc: "Auto reject calls",
    category: "settings",
    react: "📵"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("🚫 Owner only!");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('ANTI_CALL', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('ANTI_CALL', 'false', botNumber, config, reply);
    } else {
        reply(`Current Status: ${config.ANTI_CALL}\nUsage: .anticall on/off`);
    }
});

// ============================================================
// 3. GROUP MANAGEMENT (Welcome / Goodbye)
// ============================================================

cmd({
    pattern: "welcome",
    desc: "Enable/Disable welcome messages",
    category: "settings",
    react: "👋"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("🚫 Owner only!");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('WELCOME', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('WELCOME', 'false', botNumber, config, reply);
    } else {
        reply(`Current Status: ${config.WELCOME}\nUsage: .welcome on/off`);
    }
});

cmd({
    pattern: "goodbye",
    desc: "Enable/Disable goodbye messages",
    category: "settings",
    react: "🚪"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("🚫 Owner only!");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('GOODBYE', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('GOODBYE', 'false', botNumber, config, reply);
    } else {
        reply(`Current Status: ${config.GOODBYE}\nUsage: .goodbye on/off`);
    }
});

// ============================================================
// 4. READ & STATUS MANAGEMENT
// ============================================================

cmd({
    pattern: "autoread",
    desc: "Enable/Disable auto read messages (Blue Tick)",
    category: "settings",
    react: "👀"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("🚫 Owner only!");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('READ_MESSAGE', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('READ_MESSAGE', 'false', botNumber, config, reply);
    } else {
        reply(`Current Status: ${config.READ_MESSAGE}\nUsage: .autoread on/off`);
    }
});

cmd({
    pattern: "autoviewstatus",
    alias: ["avs"],
    desc: "Auto view status updates",
    category: "settings",
    react: "👁️"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("🚫 Owner only!");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_VIEW_STATUS', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_VIEW_STATUS', 'false', botNumber, config, reply);
    } else {
        reply(`Current Status: ${config.AUTO_VIEW_STATUS}\nUsage: .autoviewstatus on/off`);
    }
});

cmd({
    pattern: "autolikestatus",
    alias: ["als"],
    desc: "Auto like status updates",
    category: "settings",
    react: "❤️"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("🚫 Owner only!");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_LIKE_STATUS', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_LIKE_STATUS', 'false', botNumber, config, reply);
    } else {
        reply(`Current Status: ${config.AUTO_LIKE_STATUS}\nUsage: .autolikestatus on/off`);
    }
});

// ============================================================
// 5. SYSTEM (Mode & Prefix)
// ============================================================


cmd({
  pattern: "mode",
  alias: ["setmode"],
  react: "💫",
  desc: "Set bot mode to private or public",
  category: "settings",
  filename: __filename
},

async (conn, mek, m, {
  from,
  args,
  isCreator,
  reply
}) => {

  try {

    // Owner only
    if (!isCreator) {
      return reply("❌ Only the bot owner can use this command.");
    }

    // Show current mode
    if (!args[0]) {
      return reply(
        `📌 Current mode: *${config.MODE}*\n\n` +
        `Usage:\n.mode private\n.mode public`
      );
    }

    const mode = args[0].toLowerCase();

    // Set Private
    if (mode === "private") {

      config.MODE = "private";

      return reply(`
╭─ 「 *YOU MD BOT* 」
│ 📡 Status : Online ✅
│ 🔒 Mode   : PRIVATE
╰────────────────❍
> 𝙼𝙰𝙳𝙴 𝙸𝙽 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇
      `.trim());

    }

    // Set Public
    if (mode === "public") {

      config.MODE = "public";

      return reply(`
╭─ 「 *YOU MD BOT* 」
│ 📡 Status : Online ✅
│ 🔓 Mode   : PUBLIC
╰────────────────❍
> 𝙼𝙰𝙳𝙴 𝙸𝙽 𝙱𝚈 𝚈𝙾𝚄 𝚃𝚁𝙲𝙷𝚇
      `.trim());

    }

    // Invalid
    return reply(
      "❌ Invalid mode.\n\nUse:\n.mode private\n.mode public"
    );

  } catch (err) {

    console.log("MODE ERROR:", err);

    reply("⚠️ Failed to change mode.");

  }

});

cmd({
    pattern: "setprefix",
    desc: "Change bot prefix",
    category: "settings",
    react: "🔣"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("🚫 Owner only!");
    const newPrefix = args[0];

    if (newPrefix) {
        // Ensure prefix is short (single character or short string)
        if (newPrefix.length > 1 && newPrefix !== 'noprefix') return reply("❌ Prefix must be short (e.g. . or ! or #)");
        
        await updateConfig('PREFIX', newPrefix, botNumber, config, reply);
    } else {
        reply(`🔣 Current Prefix: ${config.PREFIX}\nUsage: .setprefix !`);
    }
});
