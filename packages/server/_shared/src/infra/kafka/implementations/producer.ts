import { Kafka } from 'kafkajs';
import { IKafkaProducer } from '../contracts';

interface IProducerProps {
  client: Kafka;
  topic: string;
}

export class Producer implements IKafkaProducer {
  private client: Kafka;

  private topic: string;

  constructor(props: IProducerProps) {
    this.client = props.client;
    this.topic = props.topic;
  }

  async execute(message: any): Promise<void> {
    const producer = this.client.producer();

    await producer.connect();

    await producer.send({
      topic: this.topic,
      messages: [
        {
          value: JSON.stringify(message)
        }
      ]
    });

    await producer.disconnect();
  }
}
