const crypto = require('crypto');

function getInstructionDiscriminator(name) {
  return Array.from(crypto.createHash('sha256').update(`global:${name}`).digest().slice(0, 8));
}

function getAccountDiscriminator(name) {
  return Array.from(crypto.createHash('sha256').update(`account:${name}`).digest().slice(0, 8));
}

console.log("Instructions:");
console.log("updateUser:", getInstructionDiscriminator("update_user"));
console.log("createChannel:", getInstructionDiscriminator("create_channel"));
console.log("sendInvite:", getInstructionDiscriminator("send_invite"));

console.log("\nAccounts:");
console.log("Channel:", getAccountDiscriminator("Channel"));
console.log("Invite:", getAccountDiscriminator("Invite"));
