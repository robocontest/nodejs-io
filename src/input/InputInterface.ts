export default interface InputInterface {
  readLine(): Promise<string>;

  read(): Promise<string>;

  readNumber(): Promise<number>;

  readNumberArray(n: number): Promise<number[]>;

  readBigInt(): Promise<BigInt>;
}
