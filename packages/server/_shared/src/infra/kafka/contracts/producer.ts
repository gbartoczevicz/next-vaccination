export interface IKafkaProducer {
  execute(message: any): Promise<void>;
}
