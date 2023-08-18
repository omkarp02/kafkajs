import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:29092"],
  logLevel: logLevel.INFO, // Set desired log level
  logCreator: ({ level, log }) => {
    saveLogToDatabase(level, log);
  },
});



function saveLogToDatabase(level, log){
    console.log(level, log)
}
