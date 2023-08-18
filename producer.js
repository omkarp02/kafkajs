import { kafka } from "./config.js";


export default async function addMessageToQueue(msg, topic, partition) {
  try {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: topic,
      messages: [
        {
          partition,
          value: JSON.stringify({
            text: msg.text,
            noOfRetriesCount: msg.noOfRetriesCount,
          }),
        },
      ],
    });

    await producer.disconnect();
  } catch (error) {
    console.log(">>>>>>>>>>>here is errro", error);
  }
}


