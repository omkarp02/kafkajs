import addMessageToQueue from "./producer.js";


const msg = { text: process.argv[2], noOfRetriesCount: 0 };
const partition = msg.text[0].toLowerCase() < "n" ? 0 : 1;
addMessageToQueue(msg, "Lead", 0)