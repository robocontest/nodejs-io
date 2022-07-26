export default interface InputInterface {
  readLine(): Promise<string>;

  read(): Promise<string>;

  readNumber(): Promise<number>;

  readNumberArray(shape: number|number[]): Promise<number[]>;

  readBigInt(): Promise<BigInt>;
}
