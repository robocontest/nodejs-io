import {Readable} from "stream";
import InputInterface from "./InputInterface";
import {Buffer} from 'buffer';

const CHAR_SLASH_R = 13;
const CHAR_SLASH_N = 10;
const CHAR_SPACE = 32;
const CHAR_MINUS = 45;
const CHAR_DOT = 46;
const CHAR_0 = 48;
const CHAR_9 = 57;

export class Input implements InputInterface {
  private input: Readable;

  private _ended = false;

  private _chunk: Buffer;
  private _chunkOffset = 0;

  constructor(input: Readable) {
    this.input = input;
    this._chunk = Buffer.alloc(0)

    this.input.on('close', () => {
      this._ended = true;
    })
  }

  async start() {
    return new Promise((resolve => {
      this.input.on('readable', resolve)
    }))
  }

  async readNumber(): Promise<number> {
    let readChunk = [];
    let pos = 0;
    let found = false;

    main:
      while (true) {
        if (this._chunkOffset + 1 >= this._chunk.length) {
          this._chunk = await this._asyncRead();
          this._chunkOffset = 0;
        }

        if (this._chunk === null)
          break;

        for (let i = this._chunkOffset; i < this._chunk.length; i++) {
          if (
            (this._chunk[i] >= CHAR_0 && this._chunk[i] <= CHAR_9) ||
            (this._chunk[i] === CHAR_DOT) ||
            (pos === 0 && this._chunk[i] === CHAR_MINUS)
          ) {
            readChunk[pos++] = this._chunk[i];
            found = true;
          } else {
            this._chunkOffset = i + 1;

            if (found)
              break main;
          }
        }
      }

    return parseFloat(Buffer.from(readChunk).toString('utf8'));
  }

  async read(): Promise<string> {
    let readChunk = [];
    let pos = 0;
    let foundWord = false;

    main:
      while (true) {
        if (this._chunkOffset + 1 >= this._chunk.length) {
          this._chunk = await this._asyncRead();
          this._chunkOffset = 0;
        }

        if (this._chunk === null)
          break;

        for (let i = this._chunkOffset; i < this._chunk.length; i++) {
          if (this._chunk[i] === CHAR_SLASH_R || this._chunk[i] === CHAR_SLASH_N || this._chunk[i] === CHAR_SPACE) {
            this._chunkOffset = i;

            if (foundWord)
              break main;
          } else {
            foundWord = true;
            readChunk[pos++] = this._chunk[i];
          }
        }
      }

    return Buffer.from(readChunk).toString('utf8');
  }

  async readBigInt(): Promise<BigInt> {
    let readChunk = [];
    let pos = 0;
    let found = false;

    main:
      while (true) {
        if (this._chunkOffset + 1 >= this._chunk.length) {
          this._chunk = await this._asyncRead();
          this._chunkOffset = 0;
        }

        if (this._chunk === null)
          break;

        for (let i = this._chunkOffset; i < this._chunk.length; i++) {
          if (
            (this._chunk[i] >= CHAR_0 && this._chunk[i] <= CHAR_9) ||
            (pos === 0 && this._chunk[i] === CHAR_MINUS)
          ) {
            readChunk[pos++] = this._chunk[i];
            found = true;
          } else {
            this._chunkOffset = i + 1;

            if (found)
              break main;
          }
        }
      }

    return BigInt(Buffer.from(readChunk).toString('utf8'));
  }

  async readLine(): Promise<string> {
    let readChunk = [];
    let pos = 0;

    main:
      while (true) {
        if (this._chunkOffset + 1 >= this._chunk.length) {
          this._chunk = await this._asyncRead();
          this._chunkOffset = 0;
        }

        if (this._chunk === null)
          break;

        for (let i = this._chunkOffset; i < this._chunk.length; i++) {
          if (this._chunk[i] === CHAR_SLASH_R) {
            this._chunkOffset = i + 2;

            break main;
          } else if (this._chunk[i] === CHAR_SLASH_N) {
            this._chunkOffset = i + 1;

            break main;
          } else {
            readChunk[pos++] = this._chunk[i];
          }
        }
      }

    return Buffer.from(readChunk).toString('utf8');
  }


  private async _asyncRead(): Promise<Buffer> {
    return new Promise((resolve) => {
      this.input.once('data', ((chunk: Buffer) => {
        resolve(chunk)
      }))

      this.input.read()
    });
  }

  /**
   * @param shape n if vector array [3,4] if matrix
   */
  async readNumberArray(shape: number | number[]): Promise<number[]> {
    let dims = typeof shape === 'number' ? [shape] : shape;

    const read = async (currentDimension: number): Promise<number[]> => {
      let curArr: any[] = [];

      if (currentDimension + 1 != dims.length) {
        for (let x = 0; x < dims[currentDimension]; x++) {
          curArr.push(await read(currentDimension + 1))
        }
      } else {
        for (let x = 0; x < dims[currentDimension]; x++) {
          curArr.push(await this.readNumber())
        }
      }

      return curArr;
    }

    return await read(0)
  }
}

function input(input: Readable): Input {
  return new Input(input)
}

export default input;
