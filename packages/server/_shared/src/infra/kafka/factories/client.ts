import { Kafka, KafkaConfig } from 'kafkajs';

export const makeClient = (config: KafkaConfig) => {
  return new Kafka(config);
};
