const { cmd } = require('../command');
const { commands } = require('../command');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs');
const Config = require('../config');
const path = require('path');
// SMALL CAPS FUNCTION
function toSmallCaps(text) {
return text
.replace(/a/g,"ᴀ").replace(/b/g,"ʙ").replace(/c/g,"ᴄ")
.replace(/d/g,"ᴅ").replace(/e/g,"ᴇ").replace(/f/g,"ғ")
.replace(/g/g,"ɢ").replace(/h/g,"ʜ").replace(/i/g,"ɪ")
.replace(/j/g,"ᴊ").replace(/k/g,"ᴋ").replace(/l/g,"ʟ")
.replace(/m/g,"ᴍ").replace(/n/g,"ɴ").replace(/o/g,"ᴏ")
.replace(/p/g,"ᴘ").replace(/q/g,"ǫ").replace(/r/g,"ʀ")
.replace(/s/g,"s").replace(/t/g,"ᴛ").replace(/u/g,"ᴜ")
.replace(/v/g,"ᴠ").replace(/w/g,"ᴡ").replace(/x/g,"x")
.replace(/y/g,"ʏ").replace(/z/g,"ᴢ");
}

// CASE COUNT
const count = global.commands ? global.commands.length : 0;
// ------------------ GETIMAGE ------------------
cmd({
  pattern: "getimage",
  alias: ["tophoto","url2image","urltoimage","imagefromurl","fetchimage"],
  desc: "Convert image URL to WhatsApp image",
  category: "owner",
  react: "🖼️",
  filename: __filename
}, async (conn, mek, m, { from, reply, text }) => {
  if (!text) return reply('❌ Provide an image URL\nExample: !getimage https://example.com/image.jpg');
  const imageUrl = text.trim();
  if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) return reply('❌ Invalid image URL');
  try {
    const response = await axios.head(imageUrl);
    if (!response.headers['content-type']?.startsWith('image/')) return reply('❌ URL does not point to a valid image');
    await conn.sendMessage(from, { image: { url: imageUrl }, caption: 'Here is your image from the URL' }, { quoted: mek });
  } catch {
    reply('❌ Could not access image URL.');
  }
});

// ------------------ LEAVE ------------------
cmd({
  pattern: "leave",
  alias: ["left","leftgc","leavegc"],
  desc: "Leave the group",
  react: "🎉",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isCreator, reply }) => {
  if (!isGroup) return reply("❗ Only in groups.");
  if (!isCreator) return reply("❗ Owner only.");
  await reply(`👋 Goodbye everyone!`);
  setTimeout(async () => { await conn.groupLeave(from); }, 1500);
});

// ------------------ PLAY ------------------
cmd({
  pattern: 'play',
  desc: 'Search & play YouTube audio',
  category: 'downloader',
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  if (!args.length) return reply('❌ Provide a song name\nExample: .play Kau masih kekasihku');
  const query = args.join(' ');
  const api = `https://api.deline.web.id/downloader/ytplay?q=${encodeURIComponent(query)}`;
  await conn.sendMessage(from, { react: { text: '🎧', key: mek.key } });
  try {
    const { data } = await axios.get(api);
    if (!data.status || !data.result) return reply('❌ Failed to find the song');
    const res = data.result;
    const caption = `╭───『 YTB PLAY 』\n┊❍ Title: ${res.title}\n┊❍ Quality: ${res.pick?.quality || '128kbps'}\n┊❍ Size: ${res.pick?.size || 'Unknown'}\n╰───────────`;
    await conn.sendMessage(from, {
      audio: { url: res.dlink },
      mimetype: 'audio/mpeg',
      fileName: `${res.title}.mp3`,
      caption,
      contextInfo: { forwardingScore: 5, isForwarded: true }
    }, { quoted: mek });
    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// ------------------ TIKTOK ------------------
cmd({
  pattern: "tiktok",
  desc: "Download TikTok video without watermark",
  category: "downloader",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  if (!args[0]) return reply("❌ Provide a TikTok link!\nExample: .tiktok https://vt.tiktok.com/XYZ");
  const tiktokUrl = args[0];
  await conn.sendMessage(from, { react: { text: "🎵", key: mek.key } });
  try {
    const { data } = await axios.get(`https://jawad-tech.vercel.app/download/tiktok?url=${encodeURIComponent(tiktokUrl)}`);
    if (!data.status || !data.result) return reply("❌ Failed to download TikTok video.");
    const meta = data.metadata || {};
    const videoUrl = data.result;
    const caption = `╭───『 TIKTOK DOWNLOAD 』\n┊📌 Title: ${meta.title || "Unknown"}\n┊👤 Author: ${meta.author || "Unknown"}\n╰──────────`;
    await conn.sendMessage(from, { video: { url: videoUrl }, mimetype: "video/mp4", caption }, { quoted: mek });
  } catch { reply("❌ Error downloading TikTok video."); }
});

// ------------------ VIDEO ------------------
cmd({
  pattern: "video",
  desc: "Download video from YouTube by name or link",
  category: "downloader",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  if (!args[0]) return reply("❌ Video name or YouTube link required.");
  let videoUrl = args.join(" ");
  await conn.sendMessage(from, { react: { text: "🎬", key: mek.key } });
  try {
    if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
      const searchRes = await axios.get(`https://api.yupra.my.id/api/search/youtube?q=${encodeURIComponent(videoUrl)}`);
      if (!searchRes.data.results?.length) return reply("❌ No results found.");
      videoUrl = searchRes.data.results[0].url;
    }
    const { data } = await axios.get(`https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(videoUrl)}`);
    if (!data.result?.mp4) return reply("❌ Failed to get video.");
    await conn.sendMessage(from, { video: { url: data.result.mp4 }, mimetype: "video/mp4", caption: data.result.title || "YouTube Video" }, { quoted: mek });
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
  } catch { reply("❌ Error while processing video."); }
});
// ------------------ VIEW-ONCE REVEAL (VV) ------------------
cmd({
  pattern: "vv",
  alias: ["viewonce","reveal"],
  desc: "Reveal view-once image or video",
  category: "main",
  react: "👁️",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quoted) return reply("❌ Reply to a view-once media.");
  const viewOnce = quoted.viewOnceMessageV2 || quoted.viewOnceMessage || null;
  const media = viewOnce?.message?.imageMessage || viewOnce?.message?.videoMessage || quoted.imageMessage || quoted.videoMessage;
  if (!media) return reply("❌ Unsupported media.");
  const isImage = media.mimetype?.startsWith("image");
  const isVideo = media.mimetype?.startsWith("video");
  if (!isImage && !isVideo) return reply("❌ Invalid media.");
  await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
  try {
    const stream = await downloadContentFromMessage(media, isImage ? "image" : "video");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    await conn.sendMessage(from, { [isImage ? "image" : "video"]: buffer, caption: media.caption || "👁️ View-once revealed" }, { quoted: mek });
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
  } catch { reply("❌ Failed to reveal media."); }
});

//------------------- VV2 CMD ------------------

cmd({
  pattern: "vv2",
  alias: ["wah","ohh","oho","nice","ok"],
  desc: "Retrieve view once message",
  category: "owner",
  filename: __filename
},
async (conn, mek, m, { from, sender, reply, isCreator }) => {

try {

if (!isCreator) return;

if (!m.quoted) {
return reply("🍁 Reply to a *view once* message.");
}

let quoted = m.quoted;
let type = quoted.mtype;

if (!["imageMessage","videoMessage","audioMessage"].includes(type)) {
return reply("❌ Only image, video, and audio supported.");
}

let buffer = await quoted.download();

let msg = {};

if (type === "imageMessage") {
msg = {
image: buffer,
caption: quoted.text || quoted.caption || "",
mimetype: "image/jpeg"
};
}

else if (type === "videoMessage") {
msg = {
video: buffer,
caption: quoted.text || quoted.caption || "",
mimetype: "video/mp4"
};
}

else if (type === "audioMessage") {
msg = {
audio: buffer,
mimetype: "audio/mp4",
ptt: quoted.ptt || false
};
}

// Send to your DM
await conn.sendMessage(sender, msg, { quoted: mek });

} catch (error) {

console.log("VV2 ERROR:", error);

reply("❌ Error retrieving view once message.");

}

});

// ------------------ BOT / MENU2 ------------------

cmd({
pattern: "menu2",
alias: ["techx"],
desc: "Bot menu",
category: "main",
react: "🔆",
filename: __filename
},
async (sock, mek, m, { from }) => {

try {

const { prepareWAMessageMedia } = require('baileys');
const os = require('os');

await sock.sendMessage(from, { react: { text: "🔆", key: mek.key } });

// Variables
const speed = (Date.now() - mek.messageTimestamp * 1000) / 1000;
const dateHaiti = new Date().toLocaleString("fr-FR", { timeZone: "America/Port-au-Prince" });
const prefix = Config.PREFIX || ".";

const footer = toSmallCaps("powered by you techx");
const thumb = "https://files.catbox.moe/rzbd7d.jpg";

// Media
const media = await prepareWAMessageMedia(
{ image: { url: thumb } },
{ upload: sock.waUploadToServer }
);

// SECTION 1
const bodyMain = `*╭┄┄┄┄┄┄┄┄┄┄┄┄┄┈┄┄┄⪼*\n*│ ʙᴏᴛ sᴛᴀᴛᴜᴛ✰*\n` +
`*│- ᴅᴇᴠ ɴᴀᴍᴇ: you ♪Techx*\n` +
`*│- ʜᴏʟᴀ 👋 @${m.sender.split('@')[0]}*\n` +
`*╰┄┄┄┄┄┄┄┄┄┄┄┄┄┈┄┄┄⪼*\n` +
`*╭───◈ 「 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 」🤖*\n` +
`*│-⏱️ ᴅᴀᴛᴇ :* ${dateHaiti}\n` +
`*│-🚀 ᴠɪᴛᴇssᴇ :* ${speed}s\n` +
`*│-✨ ᴘʀᴇғɪx :* ${prefix}\n` +
`*│-🫟 ᴏᴡɴᴇʀ :* you Techx\n` +
`*│-🤖 ʙᴏᴛ ɴᴀᴍᴇ :* you md mini\n` +
`*│-🧩 ᴛɢ :* youtechx\n` +
`*╰─────────────────✸*\n\n` +
`*ᴛᴏᴛᴀʟ ᴄᴀsᴇs :* ${count}\n` +
`_*sᴡɪᴘᴇ ᴛᴏ ᴇxᴘʟᴏʀᴇ ᴄᴏᴍᴍᴀɴᴅs!*_`;

// CARDS
const cards = [
{
header: { imageMessage: media.imageMessage, hasMediaAttachment: true },
body: { text: bodyMain },
footer: { text: footer },
nativeFlowMessage: {
buttons: [{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: toSmallCaps("évaluer l'expérience"),
id: ".ping"
})
}]
}
},

{
header: { imageMessage: media.imageMessage, hasMediaAttachment: true },
body: { text: `╭┄┄┄┄┄┄┄┄┄┄┄┄┄┈┄┄┄⪼\n│ *🤖 𝐒𝐄𝐂𝐓𝐈𝐎𝐍 𝐈𝐀 & 𝐂𝐎𝐑𝐄*\n` +
`│• ᴀɪ, ʏᴏᴜᴀɪ, ʙᴏᴛᴀɪ\n` +
`│• ᴄᴏɴғɪɢ, sᴛᴀᴛᴜs, ᴜᴘᴛɪᴍᴇ, ᴍᴏᴅᴇ, ᴇɴᴠ\n` +
`│• sᴇᴛᴘʀᴇғɪx, sᴇᴛᴘᴘ, ᴏᴡɴᴇʀ, ᴀʟɪᴠᴇ\n` +
`│• ᴘɪɴɢ, ᴘᴀɪʀ, ɢᴇᴛʙᴏᴛ, ʙᴏᴛᴄʟᴏɴᴇ\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┈┄┄┄⪼` },
footer: { text: footer },
nativeFlowMessage: {
buttons: [{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: toSmallCaps("évaluer l'expérience"),
id: ".ai"
})
}]
}
},

{
header: { imageMessage: media.imageMessage, hasMediaAttachment: true },
body: { text: `╭┄┄┄┄┄┄┄┄┄┄┄┄┄┈┄┄┄⪼\n│ *📥 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 & 𝐒𝐄𝐀𝐑𝐂𝐇*\n` +
`│• ʏᴛᴍᴘ4, ᴠɪᴅᴇᴏ, ᴛɪᴋᴛᴏᴋ, ᴛᴛ\n` +
`│• ᴀᴘᴋ, ᴅᴏᴡɴʟᴏᴀᴅ, ғʙ\n` +
`│• ᴘɪɴᴛᴇʀᴇsᴛ, ᴘɪɴ, ɪᴍɢ, ɪᴍɢsᴇᴀʀᴄʜ\n` +
`│• ᴄʟᴏɴᴇᴡᴇʙ, ᴡᴇʙᴅʟ, ss, ssᴡᴇʙ\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┈┄┄┄⪼` },
footer: { text: footer },
nativeFlowMessage: {
buttons: [{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: toSmallCaps("évaluer l'expérience"),
id: ".download"
})
}]
}
},

{
header: { imageMessage: media.imageMessage, hasMediaAttachment: true },
body: { text: `╭┄┄┄┄┄┄┄┄┄┄┄┄┄┈┄┄┄⪼\n│ *🛡️ 𝐆𝐑𝐎𝐔𝐏 & 𝐀𝐃𝐌𝐈𝐍*\n` +
`│• ᴀᴅᴅ, ᴋɪᴄᴋ, ᴘʀᴏᴍᴏᴛᴇ, ᴅᴇᴍᴏᴛᴇ\n` +
`│• ᴍᴜᴛᴇ, ᴜɴᴍᴜᴛᴇ, ᴏᴘᴇɴ, ᴄʟᴏsᴇ\n` +
`│• ᴋɪᴄᴋᴀʟʟ, ᴋɪᴄᴋᴀʟʟ2, ᴋɪᴄᴋᴀʟʟ3\n` +
`│• ᴀɴᴛɪʟɪɴᴋ, ᴡᴇʟᴄᴏᴍᴇ, ᴀᴅᴍɪɴᴇᴠᴇɴᴛs\n` +
`│• ᴛᴀɢᴀʟʟ, ᴛɢ\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┈┄┄┄⪼` },
footer: { text: footer },
nativeFlowMessage: {
buttons: [{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: toSmallCaps("évaluer l'expérience"),
id: ".tagall"
})
}]
}
},

{
header: { imageMessage: media.imageMessage, hasMediaAttachment: true },
body: { text: `╭┄┄┄┄┄┄┄┄┄┄┄┄┄┈┄┄┄⪼\n│ *✨ 𝐓𝐎𝐎𝐋𝐒 & 𝐂𝐎𝐍𝐕𝐄𝐑𝐓*\n` +
`│• ʀᴇᴍɪɴɪ, ʜᴅ,\n` +
`│• ᴛᴏᴜʀʟ, ᴠᴠ, ᴠᴠ2\n` +
`│• sᴛɪᴄᴋᴇʀ, ᴛᴀᴋᴇ,\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┈┄┄┄⪼` },
footer: { text: footer },
nativeFlowMessage: {
buttons: [{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: toSmallCaps("évaluer l'expérience"),
id: ".tourl"
})
}]
}
}
];

// SEND
const msg = {
viewOnceMessage: {
message: {
interactiveMessage: {
body: { text: toSmallCaps("you md navigation system") },
carouselMessage: { cards: cards },
contextInfo: { mentionedJid: [m.sender] }
}
}
}
};

await sock.relayMessage(from, msg, {});
await sock.sendMessage(from, { react: { text: "✅", key: mek.key } });

} catch (e) {

console.error('Menu Carousel Error:', e);
m.reply(toSmallCaps("error: failed to generate carousel menu."));

}

});

//------------------ GETCMD ------------------

cmd({
pattern: "getcmd",
alias: ["source","js"],
desc: "Fetch the full source code of a command",
category: "owner",
react: "📜",
filename: __filename
},
async (conn, mek, m, { from, args, reply, isOwner }) => {

try {

if (!isOwner) return reply("❌ You don't have permission to use this command!");
if (!args[0]) return reply("❌ Example: .get alive");

const commandName = args[0].toLowerCase();

const commandData = commands.find(
cmd => cmd.pattern === commandName ||
(cmd.alias && cmd.alias.includes(commandName))
);

if (!commandData) return reply("❌ Command not found!");

const commandPath = commandData.filename;

// Read file
const fullCode = fs.readFileSync(commandPath,'utf-8');

let truncatedCode = fullCode;

if (truncatedCode.length > 4000) {
truncatedCode = fullCode.substring(0,4000) + "\n\n// Code too long, sending full file 📂";
}

const formattedCode = `⬤───〔 *📜 Command Source* 〕───⬤
\`\`\`js
${truncatedCode}
\`\`\`
╰──────────⊷  
⚡ Full file sent below 📂  
Powered By *YOU MD BOT*`;

// Send preview
await conn.sendMessage(from,{
image:{url:"https://files.catbox.moe/rzbd7d.jpg"},
caption:formattedCode,
contextInfo:{
mentionedJid:[m.sender],
forwardingScore:999,
isForwarded:true,
forwardedNewsletterMessageInfo:{
newsletterJid:'120363404137900781@newsletter',
newsletterName:'YOU MD BOT',
serverMessageId:143
}
}
},{quoted:mek});

// Send full file
const fileName = `${commandName}.js`;
const tempPath = path.join(__dirname,fileName);

fs.writeFileSync(tempPath,fullCode);

await conn.sendMessage(from,{
document:fs.readFileSync(tempPath),
mimetype:'text/javascript',
fileName:fileName
},{quoted:mek});

fs.unlinkSync(tempPath);

}catch(e){

console.error("Error in .get command:",e);

reply(`❌ Error: ${e.message}`);

}

});