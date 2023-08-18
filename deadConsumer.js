import { kafka } from "./config.js";

async function consumeMessageFromUserTopic() {
  try {
    const consumer = kafka.consumer({ groupId: "dead-group" });
    await consumer.connect();
    await consumer.subscribe({
      topic: "Dead",
      fromBeginning: true,
    });

    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        const msg = JSON.parse(message.value.toString())
        console.log('inside the dead consumer')
        console.log(msg, partition, message.offset)
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
