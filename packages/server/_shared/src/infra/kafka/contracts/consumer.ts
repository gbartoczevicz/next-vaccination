export interface IEventConsumer {
  execute(message: any): Promise<void>;
}

export interface IKafkaConsumer {
  execute(consumer: IEventConsumer): Promise<void>;
}
