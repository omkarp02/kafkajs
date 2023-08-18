import { kafka } from "./config.js";
import addMessageToQueue from "./producer.js";



async function consumeMessageFromUserTopic() {
  try {
    const consumer = kafka.consumer({ groupId: "retry-group" });
    await consumer.connect();
    await consumer.subscribe({
      topic: "Retry",
      fromBeginning: true,
    });

    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        const msg = JSON.parse(message.value.toString())
        console.log('inside the retry consumer')
        console.log(msg, partition, message.offset)
        const partitionOfLead = msg.text[0].toLowerCase() < "n" ? 0 : 1;
        msg.noOfRetriesCount = Number(msg.noOfRetriesCount) + 1
        addMessageToQueue(msg, 'Lead', partitionOfLead)
        await consumer.commitOffsets([{
          topic, 
          partition,                                    
          offset: (Number(message.offset) + 1).toString() 
        }])
      },
    });
  } catch (error) {
    console.log(error);
  }
}

consumeMessageFromUserTopic();
