export interface IMapper<T, U> {
  toPersistence(t: T): U | Promise<U>;

  toDomain(raw: U): T | Promise<T>;
}
