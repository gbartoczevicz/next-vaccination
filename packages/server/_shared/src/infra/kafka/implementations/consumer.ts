import { Kafka } from 'kafkajs';
import { IEventConsumer, IKafkaConsumer } from '../contracts/consumer';

interface IConsumerProps {
  client: Kafka;
  groupId: string;
  topic: string;
}

export class Consumer implements IKafkaConsumer {
  private client: Kafka;

  private groupId: string;

  private topic: string;

  constructor(props: IConsumerProps) {
    this.client = props.client;
    this.groupId = props.groupId;
    this.topic = props.topic;
  }

  async execute(eventConsumer: IEventConsumer): Promise<void> {
    const consumer = this.client.consumer({ groupId: this.groupId });

    await consumer.connect();

    await consumer.subscribe({ topic: this.topic });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`${topic}[${partition} | ${message.offset}] / ${message.timestamp}`);

        const json = JSON.parse(message.value.toString());

        await eventConsumer.execute(json);
      }
    });
  }
}
