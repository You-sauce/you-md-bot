//const fetch = require("node-fetch");
const config = require('../config');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson} = require('../lib/function');
const fancy = require('../lib/style');
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { cmd } = require("../command");


cmd({
  pattern: "fancy",
  desc: "Apply fancy text styles",
  category: "owner",
  react: "💫",
  filename: __filename
},

async (conn, mek, m, { from, args, reply, prefix }) => {

  try {

    const id = args[0]?.match(/\d+/)?.join('');
    const text = args.slice(1).join(" ");

    // No argument → Show list
    if (!args.length) {
      return reply(
        `╭─ 「 *\`𝐅𝐀𝐍𝐂𝐘 𝐒𝐓𝐘𝐋𝐄\`* 」\n` +
        `│ Example: ${prefix}fancy 10 YOU MD\n│\n` +
        String.fromCharCode(8206).repeat(4001) +
        fancy.list('YOU MD', fancy)
      );
    }

    // Missing ID or text
    if (!id || !text) {
      return reply(
        `Example: ${prefix}fancy 10 YOU MD\n\n` +
        String.fromCharCode(8206).repeat(4001) +
        fancy.list('YOU MD', fancy)
      );
    }

    // Get style
    const style = fancy[parseInt(id) - 1];

    if (!style) {
      return reply("❌ Style not found.");
    }

    // Apply style
    const result = fancy.apply(style, text);

    return reply(result);

  } catch (e) {

    console.log("FANCY ERROR:", e);
    reply("❌ Error while generating fancy text.");

  }

});


cmd({
  pattern: "tagall",
  react: "🔊",
  alias: ["gc_tagall"],
  desc: "Tag all group members",
  category: "group",
  use: ".tagall [message]",
  filename: __filename
},

async (conn, mek, m, {
  from,
  participants,
  reply,
  isGroup,
  isAdmins,
  isCreator,
  command,
  body
}) => {

  try {

    // Group only
    if (!isGroup) {
      return reply("❌ This command works only in groups.");
    }

    // Admin / Owner only
    if (!isAdmins && !isCreator) {
      return reply("❌ Only admins or owner can use this command.");
    }

    // Get group info
    const metadata = await conn.groupMetadata(from);
    const groupName = metadata.subject || "Group";
    const total = participants.length;

    if (!total) return reply("❌ No members found.");

    // Message
    let msg = body.replace(command, "").trim();
    if (!msg) msg = "Hello everyone 👋";

    // Emojis
    const emojis = ['│❉', '│❖', '│❍', '│❂', '│✷', '│☉', '│❋'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    // Build text
    let text = `╭─ 「 *BOT TAGALL* 」\n`;
    text += `│📌 Group : *${groupName}*\n`;
    text += `│👥 Members : *${total}*\n`;
    text += `│💬 Message : *${msg}*\n│\n`;

    for (let user of participants) {
      text += `${emoji} @${user.id.split('@')[0]}\n`;
    }

    text += "╰────────────────❍";

    // Image
    const imageUrl = "https://files.catbox.moe/rzbd7d.jpg";
    const buffer = await getBuffer(imageUrl);

    // Send
    await conn.sendMessage(from, {
      image: buffer,
      caption: text,
      mentions: participants.map(u => u.id)
    }, { quoted: mek });

  } catch (err) {

    console.log("TAGALL ERROR:", err);
    reply("❌ Error while tagging members.");

  }

});



cmd({
pattern: "remove",
alias: ["kick","k"],
desc: "Removes a member from the group",
category: "admin",
react: "❌",
filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isBotAdmins, reply, sender }) => {

try {

if (!isGroup) return reply("❌ This command can only be used in groups.");

const botOwner = conn.user.id.split(":")[0];
const senderNumber = sender.split("@")[0];

if (senderNumber !== botOwner) {
return reply("❌ Only the bot owner can use this command.");
}

if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

let number;

if (m.quoted) {
number = m.quoted.sender.split("@")[0];
}

else if (q && q.includes("@")) {
number = q.replace(/[^0-9]/g,"");
}

else {
return reply("❌ Reply to a user or mention someone.");
}

const jid = number + "@s.whatsapp.net";

await conn.groupParticipantsUpdate(from,[jid],"remove");

await conn.sendMessage(from,{
text:`✅ Successfully removed @${number}`,
mentions:[jid]
},{quoted:mek});

}catch(err){

console.log("Remove Error:",err);
reply("❌ Failed to remove the member.");

}

});


cmd({
pattern: "demote",
alias: ["d","dismiss","removeadmin"],
desc: "Demotes a group admin to a normal member",
category: "admin",
react: "⬇️",
filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, reply, sender }) => {

try {

if (!isGroup) return reply("❌ This command can only be used in groups.");

if (!isAdmins) return reply("❌ Only group admins can use this command.");

if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

let number;

if (m.quoted) {
number = m.quoted.sender.split("@")[0];
}

else if (q && q.includes("@")) {
number = q.replace(/[^0-9]/g,"");
}

else {
return reply("❌ Reply to a user or mention someone.");
}

const botNumber = conn.user.id.split(":")[0];

if (number === botNumber) {
return reply("❌ The bot cannot demote itself.");
}

const jid = number + "@s.whatsapp.net";

await conn.groupParticipantsUpdate(from,[jid],"demote");

await conn.sendMessage(from,{
text:`✅ Successfully demoted @${number} to a normal member.`,
mentions:[jid]
},{quoted:mek});

}catch(err){

console.log("Demote Error:",err);
reply("❌ Failed to demote the member.");

}

});




cmd({
pattern: "promote",
alias: ["p","makeadmin"],
desc: "Promotes a member to group admin",
category: "admin",
react: "⬆️",
filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, reply, sender }) => {

try {

// Vérifier si c'est un groupe
if (!isGroup) return reply("❌ This command can only be used in groups.");

// Vérifier si l'utilisateur est admin
if (!isAdmins) return reply("❌ Only group admins can use this command.");

// Vérifier si le bot est admin
if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

// Récupérer le numéro à promouvoir
let number;

if (m.quoted) {
number = m.quoted.sender.split("@")[0];
}

else if (q && q.includes("@")) {
number = q.replace(/[^0-9]/g,"");
}

else {
return reply("❌ Reply to a message or mention someone.");
}

// Empêcher le bot de se promouvoir
const botNumber = conn.user.id.split(":")[0];
if (number === botNumber) return reply("❌ The bot cannot promote itself.");

const jid = number + "@s.whatsapp.net";

// Promouvoir
await conn.groupParticipantsUpdate(from,[jid],"promote");

await conn.sendMessage(from,{
text:`✅ Successfully promoted @${number} to admin.`,
mentions:[jid]
},{quoted:mek});

}catch(err){

console.log("Promote Error:",err);
reply("❌ Failed to promote the member.");

}

});

//----------------- GC TOOLS
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ────────────── Remove non-admin members ──────────────
cmd({
    pattern: "removemembers",
    alias: ["kickall","endgc","endgroup"],
    desc: "Remove all non-admin members from the group.",
    react: "🎉",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, groupMetadata, groupAdmins, isBotAdmins, senderNumber, reply, isGroup }) => {
try {
if (!isGroup) return reply("❌ This command can only be used in groups.");

const botOwner = conn.user.id.split(":")[0];
if (senderNumber !== botOwner) return reply("❌ Only the bot owner can use this command.");

if (!isBotAdmins) return reply("❌ I need to be an admin to execute this command.");

const nonAdminParticipants = groupMetadata.participants.filter(p => !groupAdmins.includes(p.id));

if (nonAdminParticipants.length === 0) return reply("❌ There are no non-admin members to remove.");

reply(`⚡ Starting to remove ${nonAdminParticipants.length} non-admin members...`);

for (let p of nonAdminParticipants) {
try {
await conn.groupParticipantsUpdate(from,[p.id],"remove");
await sleep(2000);
} catch(e){
console.error(`Failed to remove ${p.id}:`,e);
}
}

reply("✅ Successfully removed all non-admin members from the group.");

}catch(e){
console.error("Remove non-admins Error:",e);
reply("❌ An error occurred while trying to remove non-admin members.");
}
});

// ────────────── Remove admin members ──────────────
cmd({
pattern:"removeadmins",
alias:["kickadmins","kickall3","deladmins"],
desc:"Remove all admin members from the group, excluding the bot and bot owner.",
react:"🎉",
category:"group",
filename: __filename
}, async(conn, mek, m, { from, isGroup, senderNumber, groupMetadata, groupAdmins, isBotAdmins, reply }) => {
try {
if (!isGroup) return reply("❌ This command can only be used in groups.");

const botOwner = conn.user.id.split(":")[0];
if (senderNumber !== botOwner) return reply("❌ Only the bot owner can use this command.");

if (!isBotAdmins) return reply("❌ I need to be an admin to execute this command.");

const adminParticipants = groupMetadata.participants.filter(p => groupAdmins.includes(p.id) && p.id !== conn.user.id && p.id !== `${botOwner}@s.whatsapp.net`);

if (adminParticipants.length === 0) return reply("❌ There are no admin members to remove.");

reply(`⚡ Starting to remove ${adminParticipants.length} admin members, excluding the bot and bot owner...`);

for (let p of adminParticipants){
try{
await conn.groupParticipantsUpdate(from,[p.id],"remove");
await sleep(2000);
}catch(e){
console.error(`Failed to remove ${p.id}:`,e);
}
}

reply("✅ Successfully removed all admin members, excluding the bot and bot owner.");

}catch(e){
console.error("Remove admins Error:",e);
reply("❌ An error occurred while trying to remove admins.");
}
});

// ────────────── Remove all members and admins ──────────────
cmd({
pattern:"removeall2",
alias:["kickall2","endgc2","endgroup2"],
desc:"Remove all members and admins from the group, excluding the bot and bot owner.",
react:"🎉",
category:"group",
filename: __filename
}, async(conn, mek, m, { from, isGroup, senderNumber, groupMetadata, isBotAdmins, reply }) => {
try{
if (!isGroup) return reply("❌ This command can only be used in groups.");

const botOwner = conn.user.id.split(":")[0];
if (senderNumber !== botOwner) return reply("❌ Only the bot owner can use this command.");

if (!isBotAdmins) return reply("❌ I need to be an admin to execute this command.");

const participantsToRemove = groupMetadata.participants.filter(p => p.id !== conn.user.id && p.id !== `${botOwner}@s.whatsapp.net`);

if (participantsToRemove.length === 0) return reply("❌ No members to remove after excluding the bot and bot owner.");

reply(`⚡ Starting to remove ${participantsToRemove.length} members, excluding the bot and bot owner...`);

for (let p of participantsToRemove){
try{
await conn.groupParticipantsUpdate(from,[p.id],"remove");
await sleep(2000);
}catch(e){
console.error(`Failed to remove ${p.id}:`,e);
}
}

reply("✅ Successfully removed all members, excluding the bot and bot owner, from the group.");

}catch(e){
console.error("Remove all Error:",e);
reply("❌ An error occurred while trying to remove members.");
}
});

//------------------

const OWNER_PATH = path.join(__dirname, "../lib/sudo.json");

// Assure que le fichier sudo.json existe
if (!fs.existsSync(OWNER_PATH)) {
    fs.writeFileSync(OWNER_PATH, JSON.stringify([]));
}
