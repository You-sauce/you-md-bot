const { cmd } = require('../command');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs');
const Config = require('../config');
const path = require('path');

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

