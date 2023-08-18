import { kafka } from "./config.js";


const admin = kafka.admin();
await admin.connect();

async function createTopics(name, partition) {
  try {
    await admin.createTopics({
      topics: [
        {
          topic: name,
          numPartitions: partition,
        },
      ],
    });
    console.log("topic created successfully");
    
  } catch (error) {}
}

async function listTopics() {
    try {
        const data = await admin.listTopics()
        console.log(data)
    } catch (error) {
        
    }
}

async function deleteTopics(listOfTopics){
    try {
        await admin.deleteTopics({
            topics: listOfTopics
        })

    } catch (error) {
        
    }
}


async function getNumberOfPartitions(topicName) {
  const admin = kafka.admin();

  await admin.connect();

  const topicMetadata = await admin.fetchTopicMetadata({ topics: [topicName] });
  const partitions = topicMetadata.topics[0].partitions.length;

  await admin.disconnect();

  return partitions;
}

createTopics('Lead', 2)
createTopics('Retry', 1)
createTopics('Dead', 1)


listTopics()

