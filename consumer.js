import sendEmail from "./utils/sendEmail.js";
import addMessageToQueue from "./producer.js";
import { kafka } from "./config.js";


async function consumeMessageFromUserTopic() {
  try {
    const consumer = kafka.consumer({ groupId: "lead-group" });
    await consumer.connect();
    await consumer.subscribe({
      topic: "Lead",
      fromBeginning: true,
    });

    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        const msg = JSON.parse(message.value.toString());
        try {
          console.log("inside the lead consumer");
          console.log(msg, partition, message.offset);

          if (msg.text == "error") throw new Error('some thign went wrong');

          await sendEmail({msg: `${msg} ${message.offset}`, email: 'omkar.pawar@iorta.in'})
        } catch (error) {
          if (msg.noOfRetriesCount <= 5) {
            await addMessageToQueue(msg, "Retry", 0);
          } else {
            await addMessageToQueue(msg, "Dead", 0);
          }
        } finally {
          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString(),
            },
          ]);
        }
      },
    });
  } catch (error) {
    console.log(error);
  }
}

consumeMessageFromUserTopic();
