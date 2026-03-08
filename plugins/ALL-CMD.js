const { cmd } = require("../command");
const axios = require("axios");
const os = require("os");
const { cmd } = require('../command');
const fancy = require('../lib/style');
const config = require("../config");
const { runtime } = require("../lib/function");

/* ───── MENU ───── */
cmd({
    pattern: "menu3",
    alias: ["list"],
    desc: "Show all commands",
    category: "main",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const text = `
╭━〔 *${config.BOT_NAME}* 〕━╮
│⚡ Prefix: ${config.PREFIX}
│🧠 Owner: ${config.OWNER_NAME}
│⌛ Uptime: ${(process.uptime()/60).toFixed(2)} min
╰━━━━━━━━━━━━╯

📥 Download:
- .fb <url>
- .tiktok <url>
- .ig2 <url>
- .twitter <url>
- .mediafire <url>
- .apk <appname>
- .gdrive <url>

🎨 Fun/Tools:
- .img <keywords>
- .sticker
- .tts <text>
- .trt <lang>

ℹ️ Info:
- .alive
- .ping
- .owner
- .status
- .list
- .script
`;
        await conn.sendMessage(from, { text }, { quoted: mek });
    } catch (err) {
        console.error(err);
        reply("❌ Failed to show menu.");
    }
});

/* ───── FUN ───── */
cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg"],
    react: "🦋",
    desc: "Search and download Google images",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("🖼️ Please provide a search query\nExample: .img cute cats");

        await reply(`🔍 Searching images for "${query}"...`);

        const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        if (!response.data?.success || !response.data.results?.length)
            return reply("❌ No images found. Try different keywords");

        const results = response.data.results.sort(() => 0.5 - Math.random()).slice(0, 5);

        for (const imageUrl of results) {
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: `📷 Result for: ${query}\n> © Powered by Diana Tech`
            }, { quoted: mek });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (err) {
        console.error(err);
        reply(`❌ ${err.message}`);
    }
});

/* ───── DOWNLOAD ───── */

cmd({
    pattern: "ig2",
    alias: ["insta2", "Instagram2"],
    desc: "Download Instagram videos",
    react: "🎥",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith("http")) return reply("❌ Provide valid Instagram link");
        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${q}`);
        if (!data || data.status !== 200 || !data.downloadUrl) return reply("❌ Failed to fetch Instagram video");
        await conn.sendMessage(from, { video: { url: data.downloadUrl }, mimetype: "video/mp4", caption: "📥 Instagram Video Downloaded ✅" }, { quoted: m });
    } catch (err) { console.error(err); reply("❌ Error fetching Instagram video"); }
});

cmd({
    pattern: "twitter",
    alias: ["tweet", "twdl"],
    desc: "Download Twitter videos",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith("https://")) return reply("❌ Provide valid Twitter URL");
        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
        const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
        if (!data.status || !data.result) return reply("❌ Failed to fetch Twitter video");
        await conn.sendMessage(from, { video: { url: data.result.video_hd }, caption: `📥 Twitter Video ✅\n${data.result.desc || ""}` }, { quoted: m });
    } catch (err) { console.error(err); reply("❌ Error fetching Twitter video"); }
});

cmd({
    pattern: "mediafire",
    alias: ["mfire"],
    desc: "Download MediaFire files",
    category: "download",
    react: "🎥",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Provide valid MediaFire link");
        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
        const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
        if (!data.status || !data.result?.dl_link) return reply("❌ Failed to fetch MediaFire file");
        await conn.sendMessage(from, { document: { url: data.result.dl_link }, mimetype: data.result.fileType || "application/octet-stream", fileName: data.result.fileName || "file" }, { quoted: m });
    } catch (err) { console.error(err); reply("❌ Error fetching MediaFire file"); }
});

cmd({
    pattern: "apk",
    desc: "Download APK from Aptoide",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Provide app name");
        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
        const { data } = await axios.get(`http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`);
        if (!data?.datalist?.list?.length) return reply("❌ App not found");
        const app = data.datalist.list[0];
        await conn.sendMessage(from, { document: { url: app.file.path_alt }, fileName: `${app.name}.apk`, mimetype: "application/vnd.android.package-archive", caption: `📦 ${app.name} APK` }, { quoted: m });
    } catch (err) { console.error(err); reply("❌ Error fetching APK"); }
});

cmd({
    pattern: "gdrive",
    desc: "Download Google Drive files",
    category: "download",
    react: "🌐",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Provide Google Drive link");
        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
        const { data } = await axios.get(`https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`);
        if (!data?.result?.downloadUrl) return reply("❌ Failed to fetch Google Drive file");
        await conn.sendMessage(from, { document: { url: data.result.downloadUrl }, fileName: data.result.fileName, mimetype: data.result.mimetype, caption: "📥 File downloaded ✅" }, { quoted: m });
    } catch (err) { console.error(err); reply("❌ Error fetching Google Drive file"); }
});



cmd({
    pattern: "fancy",
    desc: "Apply fancy text styles",
    category: "fun",
    react: "💫",
    filename: __filename
}, async (conn, mek, m, { from, args, prefix, reply }) => {
    try {
        const id = args[0]?.match(/\d+/)?.join('');
        const text = args.slice(1).join(" ");

        // Si aucun argument → afficher la liste des styles
        if (!args.length) {
            return reply(
                `╭─ 「 *\`𝐅𝐀𝐍𝐂𝐘 𝐒𝐓𝐘𝐋𝐄\`* 」\n│EXAMPLE: FANCY 10 XTREMEXMD\n│` +
                String.fromCharCode(8206).repeat(4001) + 
                fancy.list('XTREME XMD', fancy)
            );
        }

        if (!id || !text) {
            return reply(
                `Example: ${prefix}fancy 10 XTREME-XMD\n` +
                String.fromCharCode(8206).repeat(4001) + 
                fancy.list('XTREME-XMD', fancy)
            );
        }

        const selectedStyle = fancy[parseInt(id) - 1];
        if (selectedStyle) {
            return reply(fancy.apply(selectedStyle, text));
        } else {
            return reply('_Style not found :(_');
        }
    } catch (error) {
        console.error(error);
        return reply('_An error occurred :(_');
    }
});